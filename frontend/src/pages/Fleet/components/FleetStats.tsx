import { Box } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";
import CardStat from "../../../components/ui/CardStat";

const stats = [
  { label: "Total Fleet", value: "48", icon: DirectionsCarIcon },
  { label: "Active Now", value: "12", icon: LocalTaxiIcon },
  { label: "Offline", value: "$124.5k", icon: OfflineBoltIcon },
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
