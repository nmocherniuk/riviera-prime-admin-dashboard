import { api } from "./api";

export type DashboardOverviewDto = {
  totalBookings: number;
  totalBodyguards: number;
  todaysRides: number;
  todaysRevenueEur: number;
  activeDrivers: number;
  awaitingConfirmation: number;
};

export type DashboardRevenueBucketDto = {
  label: string;
  amountEur: number;
};

export type DashboardRevenueSeriesDto = {
  day: DashboardRevenueBucketDto[];
  week: DashboardRevenueBucketDto[];
  month: DashboardRevenueBucketDto[];
};

export async function getDashboardOverview() {
  const { data } = await api.get<{ overview: DashboardOverviewDto }>("/dashboard/overview");
  return data.overview;
}

export async function getDashboardRevenueSeries() {
  const { data } = await api.get<{ revenueSeries: DashboardRevenueSeriesDto }>(
    "/dashboard/revenue-series",
  );
  return data.revenueSeries;
}

