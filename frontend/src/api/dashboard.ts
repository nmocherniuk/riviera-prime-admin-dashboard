import { api } from "./api";

export type DashboardOverviewDto = {
  totalBookings: number;
  totalBodyguards: number;
};

export async function getDashboardOverview() {
  const { data } = await api.get<{ overview: DashboardOverviewDto }>("/dashboard/overview");
  return data.overview;
}

