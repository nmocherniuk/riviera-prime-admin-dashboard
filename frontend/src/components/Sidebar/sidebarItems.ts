import DashboardIcon from "@mui/icons-material/Dashboard";
import EventIcon from "@mui/icons-material/Event";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import SecurityIcon from "@mui/icons-material/Security";
import PaymentIcon from "@mui/icons-material/Payment";
import PriceChangeIcon from "@mui/icons-material/PriceChange";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import { commonContent } from "../../content/common";

export const sidebarMenuItems = [
  { label: commonContent.nav.dashboard, icon: DashboardIcon, path: "/" },
];

export const sidebarDriversItems = [
  { label: commonContent.nav.bookings, icon: EventIcon, path: "/bookings" },
  { label: commonContent.nav.drivers, icon: PeopleIcon, path: "/drivers-partners" },
  { label: commonContent.nav.fleet, icon: DirectionsCarIcon, path: "/fleet" },
  { label: commonContent.nav.pricing, icon: PriceChangeIcon, path: "/pricing" },
];

export const sidebarSecurityItems = [
  { label: commonContent.nav.security, icon: SecurityIcon, path: "/security-partners" },
];

export const sidebarFinancialItems = [
  { label: commonContent.nav.payments, icon: PaymentIcon, path: "/payments" },
];

export const sidebarBottomItems = [
  { label: commonContent.nav.settings, icon: SettingsIcon, path: "/settings" },
  {
    label: commonContent.nav.signOut,
    icon: LogoutIcon,
    path: "/sign-out",
    isSignOut: true,
  },
];
