import { Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import GroupIcon from "@mui/icons-material/Group";
import AssignmentIcon from "@mui/icons-material/Assignment";
import CardStat from "../../../../components/CardStat";

const stats = [
  { label: "Active Partners", value: "9", icon: BusinessIcon },
  { label: "Inactive Partners", value: "3", icon: PersonOffIcon },
  { label: "Bodyguards Available", value: "28", icon: GroupIcon },
  { label: "On Assignment", value: "5", icon: AssignmentIcon },
];

export default function SecurityPartnersStats() {
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
