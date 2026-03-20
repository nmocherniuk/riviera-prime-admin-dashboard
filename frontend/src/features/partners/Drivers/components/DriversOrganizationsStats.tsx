import { Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CardStat from "../../../../components/CardStat";

const stats = [
  { label: "Organizations", value: "3", icon: BusinessIcon },
  { label: "Active Drivers", value: "12", icon: GroupsIcon },
  { label: "Fleet Coverage", value: "48", icon: DirectionsCarIcon },
];

export default function DriversOrganizationsStats() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
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
