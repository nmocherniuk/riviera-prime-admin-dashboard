import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import PaymentIcon from "@mui/icons-material/Payment";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export const sidebarMenuItems = [
  { label: "Dashboard", icon: DashboardIcon, path: "/" },
];

export const sidebarDriversItems = [
  { label: "Bookings", icon: EventIcon, path: "/bookings" },
  { label: "Drivers", icon: PeopleIcon, path: "/drivers-partners" },
  { label: "Fleet", icon: DirectionsCarIcon, path: "/fleet" },
  { label: "Pricing", icon: PriceChangeIcon, path: "/pricing" },
];

export const sidebarSecurityItems = [
  { label: "Security", icon: SecurityIcon, path: "/security-partners" },
];

export const sidebarFinancialItems = [
  { label: "Payments", icon: PaymentIcon, path: "/payments" },
];

export const sidebarBottomItems = [
  { label: "Settings", icon: SettingsIcon, path: "/settings" },
  { label: "Sign Out", icon: LogoutIcon, path: "/sign-out", isSignOut: true },
];
