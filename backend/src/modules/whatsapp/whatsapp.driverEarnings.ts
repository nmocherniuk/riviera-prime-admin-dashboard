/**
 * Sends a post-trip earnings update to the driver over WhatsApp.
 *
 * - Reads the transferred partner payout from the booking snapshot.
 * - Queries Stripe Connect balance on the driver's connected account to split
 *   funds into pending vs available.
 * - Shows a "Withdraw" button only when there is a positive available EUR balance.
 *   The WITHDRAW button id is already handled in whatsapp.replyMessages.ts
 *   (see `requestDriverManualPayout`), so we don't reimplement payout here.
 */

import type Stripe from "stripe";
import { prisma } from "../../lib/prisma.js";
import { getStripe } from "../../lib/stripe.js";
import { findDriverById } from "../driver/driver.repository.js";
import {
  sendWhatsAppInteractiveButtons,
  sendWhatsAppText,
} from "./whatsapp.service.js";

type EarningsFormatArgs = {
  amountEarnedEur: number;
  pendingEur: number;
  availableEur: number;
  availableOn: Date | null;
};

export type DriverStripeBalanceView = {
  availableEur: number;
  pendingEur: number;
  availableOn: Date | null;
};

function normalizeWaTo(raw: string): string {
  return raw.replace(/\D/g, "");
}

export function formatEur(value: number): string {
  return `€${value.toFixed(2)}`;
}

export function formatAvailableDate(date: Date | null): string {
  if (!date) return "bientôt";
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      timeZone: "Europe/Paris",
    }).format(date);
  } catch {
    return "bientôt";
  }
}

function formatEarningsBody(args: EarningsFormatArgs): string {
  const common = [
    "💰 *Mise à jour des gains*",
    "",
    "Course terminée avec succès ✅",
    "",
    `Montant gagné : ${formatEur(args.amountEarnedEur)}`,
    "",
  ];

  if (args.availableEur > 0) {
    return [
      ...common,
      `💳 Disponible au retrait : ${formatEur(args.availableEur)}`,
      ...(args.pendingEur > 0
        ? ["", `⏳ Encore en attente : ${formatEur(args.pendingEur)}`]
        : []),
      "",
      "Appuyez ci-dessous pour retirer vos gains 👇",
    ].join("\n");
  }

  return [
    ...common,
    `⏳ En attente : ${formatEur(args.pendingEur)}`,
    `Disponible le : ${formatAvailableDate(args.availableOn)}`,
    "",
    `💳 Disponible au retrait : ${formatEur(0)}`,
    "",
    "Nous vous informerons dès que vos fonds seront disponibles.",
  ].join("\n");
}

/** Sum EUR-denominated cents across a Stripe balance bucket. */
function sumEurCents(entries: Stripe.Balance.Pending[] | Stripe.Balance.Available[]): number {
  return entries
    .filter((entry) => entry.currency === "eur")
    .reduce((acc, entry) => acc + entry.amount, 0);
}

/**
 * Finds the earliest `available_on` timestamp among pending balance transactions
 * on the driver's connected account. Best-effort — returns null when unavailable.
 */
export async function estimateAvailabilityDate(
  stripeAccountId: string,
): Promise<Date | null> {
  try {
    const list = await getStripe().balanceTransactions.list(
      { limit: 25 },
      { stripeAccount: stripeAccountId },
    );
    const pendingEurTxs = list.data.filter(
      (t) => t.currency === "eur" && t.status === "pending" && t.available_on,
    );
    if (!pendingEurTxs.length) return null;
    const earliest = Math.min(...pendingEurTxs.map((t) => t.available_on));
    return new Date(earliest * 1000);
  } catch (error) {
    console.warn(
      `[earnings] could not fetch balance transactions for account ${stripeAccountId}`,
      error,
    );
    return null;
  }
}

/**
 * Reads live EUR balance breakdown from Stripe Connect for the driver account.
 * - `availableEur` / `pendingEur` come from balance.retrieve buckets (EUR only).
 * - `availableOn` is a best-effort earliest available_on among pending EUR
 *   balance_transactions; used only when nothing is available yet.
 */
export async function getDriverStripeBalanceView(
  stripeAccountId: string,
): Promise<DriverStripeBalanceView> {
  try {
    const balance = await getStripe().balance.retrieve(
      {},
      { stripeAccount: stripeAccountId },
    );
    const pendingEur = sumEurCents(balance.pending) / 100;
    const availableEur = sumEurCents(balance.available) / 100;
    const availableOn =
      availableEur <= 0 && pendingEur > 0
        ? await estimateAvailabilityDate(stripeAccountId)
        : null;
    return { availableEur, pendingEur, availableOn };
  } catch (error) {
    console.error(
      `[earnings] failed to read Stripe balance for account=${stripeAccountId}`,
      error,
    );
    return { availableEur: 0, pendingEur: 0, availableOn: null };
  }
}

export async function sendDriverEarningsMessage(
  driverId: string,
  bookingId: string,
): Promise<void> {
  const [driver, booking] = await Promise.all([
    findDriverById(driverId),
    prisma.bookings.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        finalPartnerPayout: true,
        driverAmount: true,
      },
    }),
  ]);

  if (!driver) {
    console.warn(`[earnings] driver ${driverId} not found — skipping WhatsApp`);
    return;
  }
  if (!booking) {
    console.warn(`[earnings] booking ${bookingId} not found — skipping WhatsApp`);
    return;
  }
  if (!driver.phone) {
    console.warn(
      `[earnings] driver ${driverId} has no phone — skipping WhatsApp`,
    );
    return;
  }

  const amountEarnedEur = Number(
    booking.finalPartnerPayout ?? booking.driverAmount ?? 0,
  );

  const { availableEur, pendingEur, availableOn } = driver.stripeAccountId
    ? await getDriverStripeBalanceView(driver.stripeAccountId)
    : { availableEur: 0, pendingEur: 0, availableOn: null };

  const body = formatEarningsBody({
    amountEarnedEur,
    pendingEur,
    availableEur,
    availableOn,
  });

  const to = normalizeWaTo(driver.phone);

  try {
    if (availableEur > 0) {
      await sendWhatsAppInteractiveButtons(to, body, [
        { id: "WITHDRAW", title: "💸 Retirer" },
      ]);
    } else {
      await sendWhatsAppText(to, body);
    }
  } catch (error) {
    console.error(
      `[earnings] failed to send WhatsApp earnings update driver=${driverId} booking=${bookingId}`,
      error,
    );
  }
}
