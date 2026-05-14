import { Box, CircularProgress, Container } from "@mui/material";
import DashboardStatCards from "../features/Dashboard/components/DashboardStatCards";
import { Line } from "react-chartjs-2";
import Alert from "@mui/material/Alert";
import { useMemo } from "react";
import { useQueries } from "@tanstack/react-query";

import WeeklyRevenueCard from "../features/Dashboard/components/WeeklyRevenueCard";
import ChartPlaceholderCard from "../features/Dashboard/components/ChartPlaceholderCard";
import DashboardHeader from "../features/Dashboard/components/DashboardHeader";
import { theme } from "../theme/theme";
import type { BookingDto } from "../api/bookings";
import { listBookings } from "../api/bookings";
import { getDashboardOverview, getDashboardRevenueSeries } from "../api/dashboard";
import { listDrivers } from "../api/drivers";
import { listOrganizations } from "../api/organizations";
import type { Driver } from "../features/partners/Drivers/components/drivers/types";
import { queryKeys } from "../api/queryKeys";
import { dashboardContent } from "../content/dashboard";

const HISTORY_DAYS = 30;
const FUTURE_DAYS = 1;

function toDateKey(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function toChartLabel(value: Date): string {
  return value.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}

export default function DashboardPage() {
  const [
    bookingsQuery,
    organizationsQuery,
    driversQuery,
    dashboardQuery,
    revenueSeriesQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: queryKeys.bookings.list(),
        queryFn: () => listBookings(),
      },
      {
        queryKey: queryKeys.organizations.list("SECURITY"),
        queryFn: () => listOrganizations("SECURITY"),
      },
      {
        queryKey: queryKeys.drivers.list(),
        queryFn: () => listDrivers(),
      },
      {
        queryKey: queryKeys.dashboard.overview(),
        queryFn: () => getDashboardOverview(),
      },
      {
        queryKey: queryKeys.dashboard.revenueSeries(),
        queryFn: () => getDashboardRevenueSeries(),
      },
    ],
  });

  const isPending =
    bookingsQuery.isPending ||
    organizationsQuery.isPending ||
    driversQuery.isPending;

  const errorFirst =
    bookingsQuery.error ??
    organizationsQuery.error ??
    driversQuery.error ??
    dashboardQuery.error ??
    revenueSeriesQuery.error;
  const error =
    errorFirst instanceof Error
      ? errorFirst.message
      : errorFirst
        ? dashboardContent.errors.loadOverview
        : null;

  const { bookingDateKeys, bookingDailyCounts } =
    useMemo(() => {
      const bookings: BookingDto[] =
        (bookingsQuery.data as BookingDto[] | undefined) ?? [];
      const organizations = organizationsQuery.data ?? [];
      const drivers: Driver[] =
        (driversQuery.data as Driver[] | undefined) ?? [];

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const startDate = new Date(today);
      startDate.setDate(today.getDate() - (HISTORY_DAYS - 1));
      const endDate = new Date(today);
      endDate.setDate(today.getDate() + FUTURE_DAYS);

      const axisDates: Date[] = [];
      const current = new Date(startDate);
      while (current <= endDate) {
        axisDates.push(new Date(current));
        current.setDate(current.getDate() + 1);
      }

      const securityOrganizationIds = new Set(
        organizations.map((organization) => organization.id),
      );

      const bookingsCountByDay = new Map<string, number>();
      bookings.forEach((booking) => {
        const dayKey = booking.bookingAt.slice(0, 10);
        bookingsCountByDay.set(
          dayKey,
          (bookingsCountByDay.get(dayKey) ?? 0) + 1,
        );
      });

      const bodyguardsCountByDay = new Map<string, number>();
      drivers
        .filter((driver) =>
          securityOrganizationIds.has(driver.organizationId),
        )
        .forEach((driver) => {
          const createdAt = driver.createdAt;
          if (!createdAt) return;
          const dayKey = createdAt.slice(0, 10);
          bodyguardsCountByDay.set(
            dayKey,
            (bodyguardsCountByDay.get(dayKey) ?? 0) + 1,
          );
        });

      const keys = axisDates.map(toDateKey);
      return {
        bookingDateKeys: keys.map((key) => {
          const [year, month, day] = key.split("-");
          return toChartLabel(
            new Date(Number(year), Number(month) - 1, Number(day)),
          );
        }),
        bookingDailyCounts: keys.map((key) => bookingsCountByDay.get(key) ?? 0),
        bodyguardDailyCounts: keys.map(
          (key) => bodyguardsCountByDay.get(key) ?? 0,
        ),
      };
    }, [
      bookingsQuery.data,
      organizationsQuery.data,
      driversQuery.data,
    ]);

  const bookingsOverviewData = useMemo(
    () => ({
      labels: bookingDateKeys,
      datasets: [
        {
          label: dashboardContent.bookings.chartDatasetLabel,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          data: bookingDailyCounts,
          borderWidth: 2,
          pointRadius: 0,
          tension: 0,
        },
      ],
    }),
    [bookingDateKeys, bookingDailyCounts],
  );

  const bookingsChartOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index" as const,
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top" as const,
        },
        title: {
          display: false,
        },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(27, 31, 39, 0.96)",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1,
          titleColor: "#e5e7eb",
          bodyColor: "#f3f4f6",
          footerColor: "#9ca3af",
          titleFont: {
            size: 13,
            weight: 700 as const,
          },
          bodyFont: {
            size: 12,
            weight: 600 as const,
          },
          footerFont: {
            size: 11,
            weight: 500 as const,
          },
          padding: 12,
          displayColors: true,
          usePointStyle: true,
          boxPadding: 6,
          callbacks: {
            title: (items: { label: string }[]) => {
              const rawLabel = items[0]?.label ?? "";
              const [day, month] = rawLabel.split(".");
              if (!day || !month) return rawLabel;
              const now = new Date();
              const date = new Date(
                now.getFullYear(),
                Number(month) - 1,
                Number(day),
              );
              return date.toLocaleDateString("fr-FR", {
                weekday: "long",
                day: "numeric",
                month: "short",
              });
            },
            label: (context: {
              dataset: { label?: string };
              formattedValue: string;
            }) => {
              const metricLabel =
                context.dataset.label ?? dashboardContent.charts.metricFallback;
              return `${metricLabel} : ${context.formattedValue}`;
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: false,
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 8,
            maxRotation: 0,
            minRotation: 0,
          },
          grid: {
            display: false,
          },
        },
        y: {
          min: 0,
          max: 25,
          ticks: {
            stepSize: 5,
          },
        },
      },
    }),
    [],
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        ) : null}
        {isPending ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 2 }}>
            <CircularProgress size={28} />
          </Box>
        ) : null}
        <DashboardHeader />

        <Box sx={{ mt: 2 }}>
          <DashboardStatCards
            overview={dashboardQuery.data}
            isPending={dashboardQuery.isPending}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <WeeklyRevenueCard
            series={revenueSeriesQuery.data}
            isPending={revenueSeriesQuery.isPending}
          />
        </Box>

        <Box sx={{ mt: 2 }}>
          <ChartPlaceholderCard
            title={dashboardContent.bookings.sectionTitle}
            chartId="bookings-overview-chart-container"
            ariaLabel={dashboardContent.bookings.chartAriaLabel}
          >
            <Line data={bookingsOverviewData} options={bookingsChartOptions} />
          </ChartPlaceholderCard>
        </Box>
      </Container>
    </Box>
  );
}
