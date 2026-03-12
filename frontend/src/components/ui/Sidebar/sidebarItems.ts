import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PaymentIcon from "@mui/icons-material/Payment";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

export const sidebarMenuItems = [
  { label: "Dashboard", icon: DashboardIcon, path: "/" },
  { label: "Bookings", icon: EventIcon, path: "/bookings" },
  { label: "Drivers", icon: PeopleIcon, path: "/drivers" },
  { label: "Fleet", icon: DirectionsCarIcon, path: "/fleet" },
];

export const sidebarFinancialItems = [
  { label: "Payments", icon: PaymentIcon, path: "/payments" },
  { label: "Pricing", icon: PriceChangeIcon, path: "/pricing" },
];

export const sidebarBottomItems = [
  { label: "Settings", icon: SettingsIcon, path: "/settings" },
  { label: "Sign Out", icon: LogoutIcon, path: "/sign-out", isSignOut: true },
];
