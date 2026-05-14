import {
  Box,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useMemo, useState } from "react";
import type { ChartOptions } from "chart.js";
import ChartPlaceholderCard from "./ChartPlaceholderCard";
import { Line } from "react-chartjs-2";
import { theme } from "../../../theme/theme";
import type { DashboardRevenueSeriesDto } from "../../../api/dashboard";
import { dashboardContent } from "../../../content/dashboard";

type Period = "day" | "week" | "month";

const eurFormatter = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});

function labelFromDateKey(ymd: string): string {
  const parts = ymd.split("-").map(Number);
  const y = parts[0];
  const m = parts[1];
  const d = parts[2];
  if (!y || !m || !d) return ymd;
  return new Date(y, m - 1, d).toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "2-digit",
  });
}

type WeeklyRevenueCardProps = {
  series: DashboardRevenueSeriesDto | undefined;
  isPending: boolean;
};

export default function WeeklyRevenueCard({
  series,
  isPending,
}: WeeklyRevenueCardProps) {
  const [period, setPeriod] = useState<Period>("week");

  const { labels, amounts, yMax } = useMemo(() => {
    if (isPending || !series) {
      return { labels: [] as string[], amounts: [] as number[], yMax: 100 };
    }
    const buckets =
      period === "day"
        ? series.day
        : period === "week"
          ? series.week
          : series.month;
    const labelsInner = buckets.map((b) =>
      period === "day" ? b.label : labelFromDateKey(b.label),
    );
    const amountsInner = buckets.map((b) => b.amountEur);
    const maxVal = amountsInner.length ? Math.max(...amountsInner, 0) : 0;
    const yMaxInner = maxVal <= 0 ? 100 : Math.ceil(maxVal * 1.15);
    return {
      labels: labelsInner,
      amounts: amountsInner,
      yMax: yMaxInner,
    };
  }, [period, series, isPending]);

  const chartData = useMemo(
    () => ({
      labels,
      datasets: [
        {
          label: dashboardContent.revenue.chartDatasetLabel,
          backgroundColor: theme.palette.primary.main,
          borderColor: theme.palette.primary.main,
          data: amounts,
          borderWidth: 2,
          pointRadius: period === "month" ? 0 : 2,
          tension: 0.2,
        },
      ],
    }),
    [labels, amounts, period],
  );

  const chartOptions = useMemo<ChartOptions<"line">>(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (ctx) => {
              const v = ctx.parsed.y;
              if (v == null) return "";
              return `${dashboardContent.revenue.tooltipRevenuePrefix} ${eurFormatter.format(v)}`;
            },
          },
        },
      },
      scales: {
        x: {
          ticks: {
            autoSkip: true,
            maxTicksLimit: period === "month" ? 10 : 14,
            maxRotation: period === "month" ? 45 : 0,
            minRotation: 0,
          },
          grid: { display: false },
        },
        y: {
          beginAtZero: true,
          suggestedMax: yMax,
          ticks: {
            callback: (value) =>
              typeof value === "number"
                ? eurFormatter.format(value)
                : String(value),
          },
        },
      },
    }),
    [yMax, period],
  );

  return (
    <ChartPlaceholderCard
      title={dashboardContent.revenue.sectionTitle}
      chartId="weekly-revenue-chart-container"
      ariaLabel={dashboardContent.revenue.chartAriaLabel}
      headerRightContent={
        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(_, newPeriod) => {
            if (newPeriod != null) setPeriod(newPeriod);
          }}
          size="small"
          sx={{
            bgcolor: "rgba(255,255,255,0.04)",
            borderRadius: 2,
            "& .MuiToggleButton-root": {
              px: 2,
              py: 1,
              border: "none",
              color: "text.secondary",
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "none",
              "&.Mui-selected": {
                bgcolor: "primary.main",
                color: "grey.900",
                "&:hover": { bgcolor: "primary.dark" },
              },
              "&:hover": {
                bgcolor: "rgba(255,255,255,0.08)",
                color: "text.primary",
              },
            },
          }}
        >
          <ToggleButton value="day">
            {dashboardContent.revenue.periodDay}
          </ToggleButton>
          <ToggleButton value="week">
            {dashboardContent.revenue.periodWeek}
          </ToggleButton>
          <ToggleButton value="month">
            {dashboardContent.revenue.periodMonth}
          </ToggleButton>
        </ToggleButtonGroup>
      }
    >
      {isPending || !series ? (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            minHeight: 280,
            color: "text.secondary",
            typography: "body2",
          }}
        >
          {dashboardContent.revenue.loadingMessage}
        </Box>
      ) : (
        <Line data={chartData} options={chartOptions} />
      )}
    </ChartPlaceholderCard>
  );
}
