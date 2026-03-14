import { Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CardStat from "../../../components/ui/CardStat";

const stats = [
  { label: "Total Drivers", value: "48", icon: PeopleIcon },
  { label: "Active Now", value: "12", icon: DirectionsCarIcon },
  { label: "Revenue MTD", value: "$124.5k", icon: AttachMoneyIcon },
];

export default function DriversStats() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", sm: "repeat(3, minmax(0, 1fr))" },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <CardStat key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
