import "./App.css";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "./theme/theme";
import Sidebar from "./components/ui/Sidebar";
import { Box, AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import BookingsPage from "./pages/Bookings/BookingsPage";
import {
  BookingsDateProvider,
  useBookingsDate,
} from "./pages/Bookings/BookingsDateContext";
import WeekStrip from "./pages/Bookings/components/WeekStrip";

const drawerWidth = 260;

function WeekStripWithContext() {
  const { selectedDate, setSelectedDate } = useBookingsDate();
  return (
    <WeekStrip selectedDate={selectedDate} onChangeDate={setSelectedDate} />
  );
}

function App() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <ThemeProvider theme={theme}>
      <BookingsDateProvider>
        <Box sx={{ display: "flex", minHeight: "100vh" }}>
          <AppBar
            position="fixed"
            sx={{
              display: { xs: "block", md: "none" },
              ml: { md: `${drawerWidth}px` },
            }}
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
              mt: { xs: "130px", md: 0 },
            }}
          >
            <Routes>
              <Route path="/" element={<Navigate to="/bookings" replace />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="*" element={<Navigate to="/bookings" replace />} />
            </Routes>
          </Box>
        </Box>
      </BookingsDateProvider>
    </ThemeProvider>
  );
}

export default App;
