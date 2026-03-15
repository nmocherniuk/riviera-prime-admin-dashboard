import { Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CardStat from "../../../components/CardStat";

const stats = [
  { label: "Active Now", value: "12", icon: PeopleIcon },
  { label: "On Ride", value: "8", icon: DirectionsCarIcon },
  { label: "Offline", value: "28", icon: PersonOffIcon },
  { label: "Revenue MTD", value: "£124.5k", icon: AttachMoneyIcon },
];

export default function DriversStats() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <CardStat key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
