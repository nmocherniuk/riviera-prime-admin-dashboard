import { Box, Paper, Typography, ToggleButton, ToggleButtonGroup } from "@mui/material";
import { useState } from "react";
import ChartPlaceholderCard from "./ChartPlaceholderCard";
import { Line } from "react-chartjs-2";
import { theme } from "../../../theme/theme";

type Period = "day" | "week" | "month";

export default function WeeklyRevenueCard() {
  const [period, setPeriod] = useState<Period>("week");

  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        backgroundColor: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        data: [0, 10, 5, 2, 20, 30, 45]
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Chart.js Line Chart'
      }
    }
  };

  return (


    <ChartPlaceholderCard
      title="Weekly Revenue Performance"
      chartId="weekly-revenue-chart-container"
      ariaLabel="Chart area for Weekly Revenue"
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
          <ToggleButton value="day">Day</ToggleButton>
          <ToggleButton value="week">Week</ToggleButton>
          <ToggleButton value="month">Month</ToggleButton>
        </ToggleButtonGroup>
      }
    >
      <Line data={data} options={options} />
    </ChartPlaceholderCard>
  );
}
