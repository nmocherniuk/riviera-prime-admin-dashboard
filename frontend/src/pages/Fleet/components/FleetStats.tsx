import { Box } from "@mui/material";
import BuildCircleIcon from "@mui/icons-material/BuildCircle";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import CardStat from "../../../components/CardStat";

const stats = [
  { label: "Available", value: "32", icon: DirectionsCarIcon },
  { label: "On Trip", value: "12", icon: LocalTaxiIcon },
  { label: "Maintenance", value: "4", icon: BuildCircleIcon },
];

export default function FleetStats() {
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
