import { prisma } from "../../lib/prisma.js";

export type DashboardOverview = {
  totalBookings: number;
  totalBodyguards: number;
  /** Bookings scheduled for the current UTC calendar day. */
  todaysRides: number;
  /** Sum of paid booking amounts for trips on the current UTC day (finalCustomerPrice ?? totalAmount). */
  todaysRevenueEur: number;
  /** Drivers with `status === true`. */
  activeDrivers: number;
  /** Bookings still in PENDING (not yet assigned / confirmed in ops flow). */
  awaitingConfirmation: number;
};

function utcDayBounds(now = new Date()): { start: Date; end: Date } {
  const start = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      0,
      0,
      0,
      0,
    ),
  );
  const end = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate(),
      23,
      59,
      59,
      999,
    ),
  );
  return { start, end };
}

export async function getDashboardOverviewService(): Promise<DashboardOverview> {
  const { start, end } = utcDayBounds();

  const [
    totalBookings,
    totalBodyguards,
    todaysRides,
    todaysPaidBookings,
    activeDrivers,
    awaitingConfirmation,
  ] = await Promise.all([
    prisma.bookings.count(),
    prisma.drivers.count({
      where: {
        organization: {
          type: "SECURITY",
        },
      },
    }),
    prisma.bookings.count({
      where: { bookingAt: { gte: start, lte: end } },
    }),
    prisma.bookings.findMany({
      where: {
        bookingAt: { gte: start, lte: end },
        paymentStatus: "PAID",
      },
      select: { finalCustomerPrice: true, totalAmount: true },
    }),
    prisma.drivers.count({ where: { status: true } }),
    prisma.bookings.count({ where: { status: "PENDING" } }),
  ]);

  const todaysRevenueEur = todaysPaidBookings.reduce((sum, row) => {
    const v = row.finalCustomerPrice ?? row.totalAmount;
    return sum + (v != null ? Number(v) : 0);
  }, 0);

  return {
    totalBookings,
    totalBodyguards,
    todaysRides,
    todaysRevenueEur: Math.round(todaysRevenueEur * 100) / 100,
    activeDrivers,
    awaitingConfirmation,
  };
}

export type DashboardRevenueBucket = {
  label: string;
  amountEur: number;
};

export type DashboardRevenueSeries = {
  /** Paid revenue by `bookingAt` hour (UTC) for the current UTC calendar day. */
  day: DashboardRevenueBucket[];
  /** Last 7 UTC calendar days (including today). */
  week: DashboardRevenueBucket[];
  /** Last 30 UTC calendar days (including today). */
  month: DashboardRevenueBucket[];
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

function bookingAmountEur(row: {
  finalCustomerPrice: unknown;
  totalAmount: unknown;
}): number {
  const v = row.finalCustomerPrice ?? row.totalAmount;
  return v != null ? Number(v) : 0;
}

/**
 * Paid booking revenue attributed to trip date (`bookingAt`), same basis as `todaysRevenueEur`.
 * One DB read; buckets computed in memory.
 */
export async function getDashboardRevenueSeriesService(): Promise<DashboardRevenueSeries> {
  const now = new Date();
  const { start: startTodayUtc, end: endTodayUtc } = utcDayBounds(now);

  const monthStart = new Date(startTodayUtc);
  monthStart.setUTCDate(monthStart.getUTCDate() - 29);

  const paid = await prisma.bookings.findMany({
    where: {
      paymentStatus: "PAID",
      bookingAt: { gte: monthStart, lte: endTodayUtc },
    },
    select: { bookingAt: true, finalCustomerPrice: true, totalAmount: true },
  });

  const day: DashboardRevenueBucket[] = [];
  for (let h = 0; h < 24; h += 1) {
    const start = new Date(
      Date.UTC(
        startTodayUtc.getUTCFullYear(),
        startTodayUtc.getUTCMonth(),
        startTodayUtc.getUTCDate(),
        h,
        0,
        0,
        0,
      ),
    );
    const end = new Date(
      Date.UTC(
        startTodayUtc.getUTCFullYear(),
        startTodayUtc.getUTCMonth(),
        startTodayUtc.getUTCDate(),
        h,
        59,
        59,
        999,
      ),
    );
    let sum = 0;
    for (const b of paid) {
      if (b.bookingAt >= start && b.bookingAt <= end) {
        sum += bookingAmountEur(b);
      }
    }
    day.push({
      label: `${String(h).padStart(2, "0")}:00`,
      amountEur: round2(sum),
    });
  }

  const week: DashboardRevenueBucket[] = [];
  for (let i = 6; i >= 0; i -= 1) {
    const d = new Date(startTodayUtc);
    d.setUTCDate(d.getUTCDate() - i);
    const dayStart = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
    );
    const dayEnd = new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
    let sum = 0;
    for (const b of paid) {
      if (b.bookingAt >= dayStart && b.bookingAt <= dayEnd) {
        sum += bookingAmountEur(b);
      }
    }
    week.push({
      label: dayStart.toISOString().slice(0, 10),
      amountEur: round2(sum),
    });
  }

  const month: DashboardRevenueBucket[] = [];
  for (let i = 29; i >= 0; i -= 1) {
    const d = new Date(startTodayUtc);
    d.setUTCDate(d.getUTCDate() - i);
    const dayStart = new Date(
      Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), 0, 0, 0, 0),
    );
    const dayEnd = new Date(
      Date.UTC(
        d.getUTCFullYear(),
        d.getUTCMonth(),
        d.getUTCDate(),
        23,
        59,
        59,
        999,
      ),
    );
    let sum = 0;
    for (const b of paid) {
      if (b.bookingAt >= dayStart && b.bookingAt <= dayEnd) {
        sum += bookingAmountEur(b);
      }
    }
    month.push({
      label: dayStart.toISOString().slice(0, 10),
      amountEur: round2(sum),
    });
  }

  return { day, week, month };
}

