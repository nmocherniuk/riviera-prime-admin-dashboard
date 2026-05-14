import { Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CardStat from "../../../components/CardStat";
import type { DashboardOverviewDto } from "../../../api/dashboard";
import { dashboardContent } from "../../../content/dashboard";

const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

type DashboardStatCardsProps = {
  overview: DashboardOverviewDto | undefined;
  isPending: boolean;
};

export default function DashboardStatCards({
  overview,
  isPending,
}: DashboardStatCardsProps) {
  const rides = isPending ? "—" : String(overview?.todaysRides ?? 0);
  const revenue = isPending
    ? "—"
    : eurFormatter.format(overview?.todaysRevenueEur ?? 0);
  const drivers = isPending ? "—" : String(overview?.activeDrivers ?? 0);
  const awaiting = isPending
    ? "—"
    : String(overview?.awaitingConfirmation ?? 0);

  const stats = [
    {
      key: "todaysRides",
      label: dashboardContent.stats.todaysRides,
      value: rides,
      icon: DirectionsCarIcon,
    },
    {
      key: "todaysRevenue",
      label: dashboardContent.stats.todaysRevenue,
      value: revenue,
      icon: AttachMoneyIcon,
    },
    {
      key: "activeDrivers",
      label: dashboardContent.stats.activeDrivers,
      value: drivers,
      icon: PeopleIcon,
    },
    {
      key: "awaitingConfirmation",
      label: dashboardContent.stats.awaitingConfirmation,
      value: awaiting,
      icon: NotificationsActiveIcon,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <CardStat
          key={stat.key}
          stat={{ label: stat.label, value: stat.value, icon: stat.icon }}
        />
      ))}
    </Box>
  );
}
