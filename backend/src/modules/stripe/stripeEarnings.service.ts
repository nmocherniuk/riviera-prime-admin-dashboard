import { prisma } from "../../lib/prisma.js";
import { getStripe } from "../../lib/stripe.js";

const DEFAULT_PER_HOUR_EUR = 120;
const PLATFORM_COMMISSION_PERCENT = Number(
  process.env.PLATFORM_COMMISSION_PERCENT ?? "20",
);

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

async function estimateTotalAmountEur(
  durationMin: number,
  vehicleId: string | null,
): Promise<number> {
  const hours = durationMin / 60;
  let perHour = DEFAULT_PER_HOUR_EUR;
  if (vehicleId) {
    const pricing = await prisma.vehiclePricings.findUnique({
      where: { vehicleId },
      select: { perHour: true },
    });
    if (pricing) perHour = Number(pricing.perHour);
  }
  return round2(hours * perHour);
}

function splitAmounts(totalAmount: number): FinancialAmounts {
  const platformFee = round2(
    (totalAmount * PLATFORM_COMMISSION_PERCENT) / 100,
  );
  const driverAmount = round2(totalAmount - platformFee);
  return {
    totalAmount,
    driverAmount,
    platformFee,
    totalAmountCents: Math.round(totalAmount * 100),
    driverAmountCents: Math.round(driverAmount * 100),
    platformFeeCents: Math.round(platformFee * 100),
  };
}

async function ensureBookingAmounts(bookingId: string): Promise<FinancialAmounts> {
  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      durationMin: true,
      vehicleId: true,
      totalAmount: true,
      driverAmount: true,
      platformFee: true,
    },
  });
  if (!booking) throw new Error("Booking not found");

  if (
    booking.totalAmount != null &&
    booking.driverAmount != null &&
    booking.platformFee != null
  ) {
    const totalAmount = Number(booking.totalAmount);
    const driverAmount = Number(booking.driverAmount);
    const platformFee = Number(booking.platformFee);
    return {
      totalAmount,
      driverAmount,
      platformFee,
      totalAmountCents: Math.round(totalAmount * 100),
      driverAmountCents: Math.round(driverAmount * 100),
      platformFeeCents: Math.round(platformFee * 100),
    };
  }

  const totalAmount = await estimateTotalAmountEur(
    booking.durationMin,
    booking.vehicleId ?? null,
  );
  const amounts = splitAmounts(totalAmount);

  await prisma.bookings.update({
    where: { id: bookingId },
    data: {
      totalAmount: amounts.totalAmount,
      driverAmount: amounts.driverAmount,
      platformFee: amounts.platformFee,
    },
  });

  return amounts;
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
  const transfer = await stripe.transfers.create(
    {
      amount: amounts.driverAmountCents,
      currency: "eur",
      destination: booking.driver.stripeAccountId,
      metadata: { bookingId: booking.id, driverId: booking.driverId },
      transfer_group: `booking_${booking.id}`,
    },
    { idempotencyKey: `booking_transfer_${booking.id}` },
  );

  const updated = await prisma.bookings.updateMany({
    where: { id: booking.id, isTransferred: false },
    data: {
      isTransferred: true,
      transferredAt: new Date(),
      payoutStatus: "PENDING",
      platformPayoutStatus: "AVAILABLE",
      stripeTransferId: transfer.id,
      totalAmount: amounts.totalAmount,
      driverAmount: amounts.driverAmount,
      platformFee: amounts.platformFee,
    },
  });

  if (updated.count > 0) {
    console.log(
      `[earnings] transferred booking=${booking.id} amount=${amounts.driverAmountCents} transfer=${transfer.id}`,
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
      durationMin: true,
      vehicleId: true,
      driverAmount: true,
    },
  });

  let totalEarned = 0;
  let availableBalance = 0;
  let pending = 0;

  for (const booking of bookings) {
    let driverAmount = booking.driverAmount != null ? Number(booking.driverAmount) : null;
    if (driverAmount == null) {
      const total = await estimateTotalAmountEur(
        booking.durationMin,
        booking.vehicleId ?? null,
      );
      driverAmount = splitAmounts(total).driverAmount;
    }

    if (booking.isTransferred) {
      totalEarned += driverAmount;
      if (booking.payoutStatus === "PENDING") {
        availableBalance += driverAmount;
      }
    } else if (booking.status !== "COMPLETED") {
      pending += driverAmount;
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
