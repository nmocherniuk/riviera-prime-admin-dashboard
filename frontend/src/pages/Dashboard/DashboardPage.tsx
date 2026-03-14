import { Box, Container, Grid } from "@mui/material";
import DashboardStatCards from "./components/DashboardStatCards";

import WeeklyRevenueCard from "./components/WeeklyRevenueCard";
import ChartPlaceholderCard from "./components/ChartPlaceholderCard";
import DashboardHeader from "./components/DashboardHeader";

export default function DashboardPage() {
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
          />
        </Box>
      </Container>
    </Box>
  );
}
