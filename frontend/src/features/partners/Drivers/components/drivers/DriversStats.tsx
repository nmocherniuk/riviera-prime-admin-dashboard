import { Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import CardStat from "../../../../../components/CardStat";

type Props = {
  activeCount: number;
  inactiveCount: number;
};

export default function DriversStats({
  activeCount,
  inactiveCount,
}: Props) {
  const stats = [
    { label: "Active", value: String(activeCount), icon: PeopleIcon },
    { label: "Inactive", value: String(inactiveCount), icon: PersonOffIcon },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
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
