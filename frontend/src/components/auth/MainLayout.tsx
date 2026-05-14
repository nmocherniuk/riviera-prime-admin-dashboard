import { Box, AppBar, IconButton, Toolbar } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar";
import WeekStrip from "../../features/Bookings/components/WeekStrip";
import {
  BookingsDateProvider,
  useBookingsDate,
} from "../../features/Bookings/store/BookingsDateContext";

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

function MainLayoutInner() {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
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
        <Outlet />
      </Box>
    </Box>
  );
}

export default function MainLayout() {
  return (
    <BookingsDateProvider>
      <MainLayoutInner />
    </BookingsDateProvider>
  );
}
