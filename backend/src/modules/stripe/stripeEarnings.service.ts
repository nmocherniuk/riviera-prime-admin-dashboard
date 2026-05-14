import { prisma } from "../../lib/prisma.js";
import { getStripe } from "../../lib/stripe.js";
import { ensureBookingPricingSnapshot } from "../booking/booking.pricing.js";

type FinancialAmounts = {
  totalAmount: number;
  driverAmount: number;
  platformFee: number;
  totalAmountCents: number;
  driverAmountCents: number;
  platformFeeCents: number;
};

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

/**
 * Uses persisted booking pricing snapshot only (marketplace model).
 * Client paid totalAmount to platform; on completion we transfer driverAmount to connected account.
 */
async function ensureBookingAmounts(bookingId: string): Promise<FinancialAmounts> {
  let booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      totalAmount: true,
      driverAmount: true,
      platformFee: true,
      finalCustomerPrice: true,
      finalPartnerPayout: true,
      platformMargin: true,
    },
  });
  if (!booking) throw new Error("Booking not found");

  const incomplete =
    booking.finalCustomerPrice == null ||
    booking.finalPartnerPayout == null ||
    booking.totalAmount == null;
  if (incomplete) {
    await ensureBookingPricingSnapshot(bookingId);
    booking = await prisma.bookings.findUnique({
      where: { id: bookingId },
      select: {
        id: true,
        totalAmount: true,
        driverAmount: true,
        platformFee: true,
        finalCustomerPrice: true,
        finalPartnerPayout: true,
        platformMargin: true,
      },
    });
    if (!booking) throw new Error("Booking not found");
  }

  const totalAmount = Number(
    booking.finalCustomerPrice ?? booking.totalAmount ?? 0,
  );
  const driverAmount = Number(
    booking.finalPartnerPayout ?? booking.driverAmount ?? 0,
  );
  const platformFee = Number(
    booking.platformMargin ?? booking.platformFee ?? round2(totalAmount - driverAmount),
  );

  return {
    totalAmount,
    driverAmount,
    platformFee,
    totalAmountCents: Math.round(totalAmount * 100),
    driverAmountCents: Math.round(driverAmount * 100),
    platformFeeCents: Math.round(platformFee * 100),
  };
}

/**
 * Best-effort lookup of the latest_charge for this booking's PaymentIntent.
 * Passing it as `source_transaction` lets Stripe pull funds from the customer's
 * charge even while it's still pending (no need to wait for available balance).
 */
async function resolveSourceChargeId(
  stripePaymentIntentId: string | null,
): Promise<string | null> {
  if (!stripePaymentIntentId) return null;
  try {
    const pi = await getStripe().paymentIntents.retrieve(
      stripePaymentIntentId,
    );
    const latestCharge = pi.latest_charge;
    if (!latestCharge) return null;
    return typeof latestCharge === "string" ? latestCharge : latestCharge.id;
  } catch (error) {
    console.warn(
      `[earnings] could not load PaymentIntent ${stripePaymentIntentId}`,
      error,
    );
    return null;
  }
}

export async function transferBookingEarningsToDriver(
  bookingId: string,
): Promise<void> {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      status: true,
      paymentStatus: true,
      isTransferred: true,
      driverId: true,
      stripePaymentIntentId: true,
      driver: { select: { stripeAccountId: true } },
    },
  });
  if (!booking) return;
  if (booking.status !== "COMPLETED") return;
  if (booking.paymentStatus !== "PAID") return;
  if (booking.isTransferred) return;
  if (!booking.driverId || !booking.driver?.stripeAccountId) return;

  const amounts = await ensureBookingAmounts(booking.id);
  if (amounts.driverAmountCents <= 0) return;

  const stripe = getStripe();
  const sourceChargeId = await resolveSourceChargeId(
    booking.stripePaymentIntentId,
  );

  const baseParams = {
    amount: amounts.driverAmountCents,
    currency: "eur",
    destination: booking.driver.stripeAccountId,
    metadata: { bookingId: booking.id, driverId: booking.driverId },
    transfer_group: `booking_${booking.id}`,
  } as const;

  let transfer;
  try {
    transfer = sourceChargeId
      ? await stripe.transfers.create(
          { ...baseParams, source_transaction: sourceChargeId },
          {
            idempotencyKey: `booking_transfer_${booking.id}_src_${sourceChargeId}`,
          },
        )
      : await stripe.transfers.create(baseParams, {
          idempotencyKey: `booking_transfer_${booking.id}_direct`,
        });
  } catch (error) {
    const stripeError = error as { code?: string; message?: string };
    console.error(
      `[earnings] transfer failed booking=${booking.id} code=${stripeError.code ?? "?"} msg=${stripeError.message ?? "?"}`,
    );
    throw error;
  }

  const updated = await prisma.bookings.updateMany({
    where: { id: booking.id, isTransferred: false },
    data: {
      isTransferred: true,
      transferredAt: new Date(),
      payoutStatus: "PENDING",
      platformPayoutStatus: "AVAILABLE",
      stripeTransferId: transfer.id,
    },
  });

  if (updated.count > 0) {
    console.log(
      `[earnings] transferred booking=${booking.id} amount=${amounts.driverAmountCents}EUR transfer=${transfer.id} source=${sourceChargeId ?? "direct"}`,
    );
  }
}

export async function getDriverEarningsSummary(driverId: string): Promise<{
  totalEarned: number;
  availableBalance: number;
  pending: number;
  currency: "EUR";
}> {
  const bookings = await prisma.bookings.findMany({
    where: { driverId },
    select: {
      id: true,
      status: true,
      isTransferred: true,
      payoutStatus: true,
      finalPartnerPayout: true,
      driverAmount: true,
    },
  });

  let totalEarned = 0;
  let availableBalance = 0;
  let pending = 0;

  for (const booking of bookings) {
    const partner = Number(
      booking.finalPartnerPayout ?? booking.driverAmount ?? 0,
    );

    if (booking.isTransferred) {
      totalEarned += partner;
      if (booking.payoutStatus === "PENDING") {
        availableBalance += partner;
      }
    } else if (booking.status !== "COMPLETED") {
      pending += partner;
    }
  }

  return {
    totalEarned: round2(totalEarned),
    availableBalance: round2(availableBalance),
    pending: round2(pending),
    currency: "EUR",
  };
}

export async function syncCompletedTransfersForDriver(driverId: string): Promise<void> {
  const rows = await prisma.bookings.findMany({
    where: {
      driverId,
      status: "COMPLETED",
      paymentStatus: "PAID",
      isTransferred: false,
    },
    select: { id: true },
  });
  for (const row of rows) {
    try {
      await transferBookingEarningsToDriver(row.id);
    } catch (error) {
      console.error(`[earnings] transfer failed booking=${row.id}`, error);
    }
  }
}

export async function requestDriverManualPayout(driverId: string): Promise<{
  status: "no_funds" | "paid";
  amount: number;
}> {
  const driver = await prisma.drivers.findUnique({
    where: { id: driverId },
    select: { stripeAccountId: true },
  });
  if (!driver?.stripeAccountId) return { status: "no_funds", amount: 0 };

  const stripe = getStripe();
  const balance = await stripe.balance.retrieve(
    {},
    { stripeAccount: driver.stripeAccountId },
  );
  const eurAvailable =
    balance.available.find((entry) => entry.currency === "eur")?.amount ?? 0;
  if (eurAvailable <= 0) return { status: "no_funds", amount: 0 };

  await stripe.payouts.create(
    { amount: eurAvailable, currency: "eur" },
    {
      stripeAccount: driver.stripeAccountId,
      idempotencyKey: `driver_payout_${driverId}_${eurAvailable}_${Date.now()}`,
    },
  );

  await prisma.bookings.updateMany({
    where: { driverId, payoutStatus: "PENDING" },
    data: { payoutStatus: "PAID" },
  });

  console.log(`[earnings] payout sent driver=${driverId} amount=${eurAvailable}`);
  return { status: "paid", amount: round2(eurAvailable / 100) };
}
