import type { Stripe } from "stripe";
import { prisma } from "../../lib/prisma.js";
import { getStripe } from "../../lib/stripe.js";
import { findBookingById } from "../booking/booking.repository.js";
import {
  estimateBookingPriceEur,
  type BookingPricingRow,
} from "../booking/booking.service.js";

/** Admin Payments table: binary view — Stripe details stay in `stripeStatus` / timeline. */
export type AdminPaymentStatus = "paid" | "unpaid";

export type AdminPaymentHistoryItem = {
  id: string;
  bookingId: string;
  clientName: string;
  route: string;
  amount: number;
  currency: string;
  paymentStatus: AdminPaymentStatus;
  paymentMethod: string;
  date: string;
  updatedAt: string;
  driverName?: string;
  vehicle?: string;
  stripeStatus?: string;
  cardLast4?: string;
  stripePaymentIntentId: string | null;
  timeline: { label: string; date: string }[];
};

function ymd(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function getCharge(pi: Stripe.PaymentIntent): Stripe.Charge | null {
  const c = pi.latest_charge;
  if (!c || typeof c === "string") return null;
  return c;
}

function paymentMethodLabel(pi: Stripe.PaymentIntent): string {
  const ch = getCharge(pi);
  const details = ch?.payment_method_details;
  if (!details) return "-";
  if (details.type === "card" || details.card) return "Card";
  if (details.type === "link") return "Link";
  return details.type ?? "Card";
}

function cardLast4(pi: Stripe.PaymentIntent): string | undefined {
  const ch = getCharge(pi);
  const last4 = ch?.payment_method_details?.card?.last4;
  return last4 ?? undefined;
}

function mapUiStatus(
  pi: Stripe.PaymentIntent | null,
  dbPayment: "PAID" | "UNPAID",
): AdminPaymentStatus {
  if (dbPayment === "PAID") return "paid";
  if (!pi) return "unpaid";
  if (pi.status === "succeeded") {
    const ch = getCharge(pi);
    const total = ch?.amount ?? 0;
    if (ch && total > 0 && ch.amount_refunded >= total) return "unpaid";
    return "paid";
  }
  return "unpaid";
}

function buildTimeline(pi: Stripe.PaymentIntent): { label: string; date: string }[] {
  const out: { label: string; date: string }[] = [];
  out.push({
    label: "Payment intent created",
    date: new Date(pi.created * 1000).toISOString(),
  });
  const ch = getCharge(pi);
  if (ch) {
    if (ch.status === "succeeded" || ch.status === "pending") {
      out.push({
        label: `Charge ${ch.status}`,
        date: new Date(ch.created * 1000).toISOString(),
      });
    }
    if (ch.amount_refunded > 0) {
      out.push({
        label: "Refund recorded",
        date: new Date(ch.created * 1000).toISOString(),
      });
    }
  }
  return out;
}

async function rowToDto(
  stripe: Stripe | null,
  row: BookingPricingRow,
  cachedPi?: Stripe.PaymentIntent | null,
): Promise<AdminPaymentHistoryItem> {
  const route = `${row.from} → ${row.to}`;
  const driverName = row.driver?.name ?? undefined;
  const vehicle = row.vehicle?.vehicleName ?? undefined;
  const date = ymd(new Date(row.bookingAt));
  let pi: Stripe.PaymentIntent | null = cachedPi ?? null;
  if (stripe && row.stripePaymentIntentId && !pi) {
    try {
      pi = await stripe.paymentIntents.retrieve(row.stripePaymentIntentId, {
        expand: ["latest_charge"],
      });
    } catch {
      pi = null;
    }
  }

  const amountEstimated = await estimateBookingPriceEur(row);
  let amount = amountEstimated;
  let currency = "EUR";
  if (pi) {
    amount = pi.amount / 100;
    currency = (pi.currency ?? "eur").toUpperCase();
  }

  const paymentStatus = mapUiStatus(pi, row.paymentStatus);
  const stripeStatus = pi?.status;
  const timeline = pi
    ? buildTimeline(pi)
    : row.paymentStatus === "UNPAID" && row.status === "ASSIGNED"
      ? [
          {
            label: "Driver assigned — awaiting client payment",
            date: row.updatedAt.toISOString(),
          },
        ]
      : [];
  const last4 = pi ? cardLast4(pi) : undefined;

  /** While payment is still expected, always show this — even if a PI exists but is not completed. */
  const paymentMethod =
    paymentStatus === "unpaid"
      ? "Awaiting payment"
      : pi
        ? paymentMethodLabel(pi)
        : "—";

  const base: AdminPaymentHistoryItem = {
    id: row.id,
    bookingId: row.id,
    clientName: row.clientName,
    route,
    amount,
    currency,
    paymentStatus,
    paymentMethod,
    date,
    updatedAt: row.updatedAt.toISOString(),
    stripePaymentIntentId: row.stripePaymentIntentId,
    timeline,
  };
  if (driverName !== undefined) base.driverName = driverName;
  if (vehicle !== undefined) base.vehicle = vehicle;
  if (stripeStatus !== undefined) base.stripeStatus = stripeStatus;
  if (last4 !== undefined && paymentStatus === "paid") base.cardLast4 = last4;
  return base;
}

/**
 * All bookings that initiated or completed a Stripe flow, plus recent PaymentIntents
 * referenced by metadata.bookingId, merged and enriched from Stripe.
 */
export async function listPaymentHistory(): Promise<AdminPaymentHistoryItem[]> {
  let stripe: Stripe | null = null;
  try {
    stripe = getStripe();
  } catch {
    stripe = null;
  }

  const fromDb = await prisma.bookings.findMany({
    where: {
      OR: [
        { stripePaymentIntentId: { not: null } },
        { paymentStatus: "PAID" },
        /** Driver assigned, client has not paid — show in Payments as unpaid with estimate. */
        {
          AND: [{ status: "ASSIGNED" }, { paymentStatus: "UNPAID" }],
        },
      ],
    },
    orderBy: { updatedAt: "desc" },
    take: 500,
    include: {
      driver: { select: { id: true, name: true } },
      vehicle: { select: { id: true, vehicleName: true } },
    },
  });

  const piById = new Map<string, Stripe.PaymentIntent>();
  let recentList: Stripe.PaymentIntent[] = [];
  if (stripe) {
    try {
      const list = await stripe.paymentIntents.list({
        limit: 100,
        expand: ["data.latest_charge"],
      });
      recentList = list.data;
      for (const pi of list.data) {
        piById.set(pi.id, pi);
      }
    } catch (e) {
      console.error("[payments] Stripe list failed:", e);
    }
  }

  const seenBookingIds = new Set<string>();
  const dtos: AdminPaymentHistoryItem[] = [];

  for (const row of fromDb) {
    seenBookingIds.add(row.id);
    const cached = row.stripePaymentIntentId
      ? piById.get(row.stripePaymentIntentId) ?? null
      : null;
    dtos.push(await rowToDto(stripe, row as BookingPricingRow, cached));
  }

  if (stripe && recentList.length > 0) {
    for (const pi of recentList) {
      const bid = pi.metadata?.bookingId;
      if (!bid || seenBookingIds.has(bid)) continue;
      const row = await findBookingById(bid);
      if (!row) continue;
      seenBookingIds.add(bid);
      dtos.push(await rowToDto(stripe, row as BookingPricingRow, pi));
    }
  }

  const seen = new Set<string>();
  const deduped: AdminPaymentHistoryItem[] = [];
  for (const d of dtos) {
    if (seen.has(d.bookingId)) continue;
    seen.add(d.bookingId);
    deduped.push(d);
  }

  deduped.sort(
    (a, b) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
  );

  return deduped;
}

export async function getAdminAvailableBalance(): Promise<{
  availableBalance: number;
  currency: "EUR";
}> {
  const rows = await prisma.bookings.findMany({
    where: {
      platformPayoutStatus: "AVAILABLE",
      platformFee: { not: null },
    },
    select: { platformFee: true },
  });
  const availableBalance = rows.reduce(
    (sum, row) => sum + Number(row.platformFee ?? 0),
    0,
  );
  return {
    availableBalance: Math.round(availableBalance * 100) / 100,
    currency: "EUR",
  };
}

export async function withdrawAdminAvailableBalance(): Promise<{
  amount: number;
  currency: "EUR";
}> {
  const { availableBalance } = await getAdminAvailableBalance();
  if (availableBalance <= 0) {
    throw new Error("No available balance");
  }

  const stripe = getStripe();
  const amountCents = Math.round(availableBalance * 100);
  const payout = await stripe.payouts.create(
    {
      amount: amountCents,
      currency: "eur",
      metadata: { scope: "platform_commission" },
    },
    { idempotencyKey: `admin_withdraw_${amountCents}_${Date.now()}` },
  );

  await prisma.$transaction([
    prisma.bookings.updateMany({
      where: { platformPayoutStatus: "AVAILABLE" },
      data: { platformPayoutStatus: "PAID" },
    }),
    prisma.adminPayouts.create({
      data: { amount: availableBalance, currency: "EUR" },
    }),
  ]);

  console.log(
    `[admin-withdraw] payout sent amount=${amountCents} payout=${payout.id}`,
  );

  return { amount: availableBalance, currency: "EUR" };
}
