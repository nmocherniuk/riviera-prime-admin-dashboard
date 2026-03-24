import { prisma } from "../../lib/prisma.js";

export type DashboardOverview = {
  totalBookings: number;
  totalBodyguards: number;
};

export async function getDashboardOverviewService(): Promise<DashboardOverview> {
  const [totalBookings, totalBodyguards] = await Promise.all([
    prisma.bookings.count(),
    prisma.drivers.count({
      where: {
        organization: {
          type: "SECURITY",
        },
      },
    }),
  ]);

  return {
    totalBookings,
    totalBodyguards,
  };
}

