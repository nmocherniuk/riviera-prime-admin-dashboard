import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import BookingsPage from "./pages/BookingsPage";
import FleetPage from "./pages/FleetPage";
import PricingPage from "./pages/PricingPage";
import PaymentsPage from "./pages/PaymentsPage";
import SecurityOrganizationsPage from "./pages/SecurityOrganizationsPage";
import SecurityOrganizationPage from "./pages/SecurityOrganizationPage";
import DriverOrganizationsPage from "./pages/DriverOrganizationsPage";
import DriversPage from "./pages/DriversPage";
import AuthBootstrap from "./components/auth/AuthBootstrap";
import RequireAuth from "./components/auth/RequireAuth";
import GuestOnly from "./components/auth/GuestOnly";
import MainLayout from "./components/auth/MainLayout";
import { ToastProvider } from "./providers/ToastProvider";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <ToastProvider>
        <AuthBootstrap>
          <Routes>
            <Route element={<GuestOnly />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>

            <Route element={<RequireAuth />}>
              <Route element={<MainLayout />}>
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
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthBootstrap>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
