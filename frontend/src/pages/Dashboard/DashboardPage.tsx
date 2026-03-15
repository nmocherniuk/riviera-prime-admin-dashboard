import { Box, Container, Grid } from "@mui/material";
import DashboardStatCards from "./components/DashboardStatCards";
import { Line } from 'react-chartjs-2';

import WeeklyRevenueCard from "./components/WeeklyRevenueCard";
import ChartPlaceholderCard from "./components/ChartPlaceholderCard";
import DashboardHeader from "./components/DashboardHeader";
import { theme } from "../../theme/theme";

export default function DashboardPage() {
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
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        <DashboardHeader />

        <Box sx={{ mt: 2 }}>
          <DashboardStatCards />
        </Box>

        <Box sx={{ mt: 2 }}>
          <WeeklyRevenueCard />
        </Box>

        <Box sx={{ mt: 2 }}>
          <ChartPlaceholderCard
            title="Bookings overview"
            chartId="bookings-overview-chart-container"
            ariaLabel="Chart area for Bookings overview"
          >
            <Line data={data} options={options} />
          </ChartPlaceholderCard>
        </Box>

        <Box sx={{ mt: 2 }}>
          <ChartPlaceholderCard
            title="Security Partners overview"
            chartId="security-partners-overview-chart-container"
            ariaLabel="Chart area for Security Partners overview"
          >
            <Line data={data} options={options} />
          </ChartPlaceholderCard>
        </Box>
      </Container>
    </Box>
  );
}
