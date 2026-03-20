import { Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import CardStat from "../../../components/CardStat";

const stats = [
  { label: "Today's Rides", value: "42", icon: DirectionsCarIcon },
  { label: "Today's Revenue", value: "€12,450", icon: AttachMoneyIcon },
  { label: "Active Drivers", value: "18", icon: PeopleIcon },
  { label: "Awaiting Confirmation", value: "5", icon: NotificationsActiveIcon },
];

export default function DashboardStatCards() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <CardStat key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
