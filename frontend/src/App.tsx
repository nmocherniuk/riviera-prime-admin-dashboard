import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import Sidebar from "./components/Sidebar/Sidebar";
import { Box, AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import WeekStrip from "./features/Bookings/components/WeekStrip";
import LoginPage from "./pages/LoginPage";
import {
  BookingsDateProvider,
  useBookingsDate,
} from "./features/Bookings/store/BookingsDateContext";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";
import FleetPage from "./pages/FleetPage";
import PricingPage from "./pages/PricingPage";
import PaymentsPage from "./pages/PaymentsPage";
import SecurityOrganizationsPage from "./pages/SecurityOrganizationsPage";
import SecurityOrganizationPage from "./pages/SecurityOrganizationPage";
import DriverOrganizationsPage from "./pages/DriverOrganizationsPage";
import DriverOrganizationDetailPage from "./pages/DriversPage";
import DriversPage from "./pages/DriversPage";

const drawerWidth = 260;

function WeekStripWithContext() {
  const { selectedDate, setSelectedDate, scrollToDate } = useBookingsDate();
  const handleDateChange = (date: Date) => {
    setSelectedDate(date);
    scrollToDate(date);
  };
  return (
    <WeekStrip selectedDate={selectedDate} onChangeDate={handleDateChange} />
  );
}

function App() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  if (location.pathname === "/login") {
    return (
      <ThemeProvider theme={theme}>
        <LoginPage />
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <BookingsDateProvider>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <AppBar
            position="fixed"
            elevation={0}
            sx={(theme) => ({
              display: { xs: "block", md: "none" },
              ml: { md: `${drawerWidth}px` },
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              borderBottom: "1px solid",
              borderBottomColor: theme.palette.divider,
            })}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open menu"
                edge="start"
                onClick={() => setMobileOpen(true)}
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
            </Toolbar>
            {location.pathname === "/bookings" && <WeekStripWithContext />}
          </AppBar>

          <Sidebar open={mobileOpen} onClose={() => setMobileOpen(false)} />

          <Box
            component="main"
            sx={{
              flexGrow: 1,
              mt: {
                xs: location.pathname === "/bookings" ? "120px" : "80px",
                md: 0,
              },
            }}
          >
            <Routes>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route
                path="/drivers-partners"
                element={<DriverOrganizationsPage />}
              />
              <Route
                path="/drivers-partners/:organizationId"
                element={<DriversPage />}
              />
              <Route path="/fleet" element={<FleetPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/payments" element={<PaymentsPage />} />
              <Route
                path="/security-partners"
                element={<SecurityOrganizationsPage />}
              />
              <Route
                path="/security-partners/:partnerId"
                element={<SecurityOrganizationPage />}
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Box>
        </Box>
      </BookingsDateProvider>
    </ThemeProvider>
  );
}

export default App;
