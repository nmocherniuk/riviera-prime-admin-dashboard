import { Box } from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CardStat from "../../../../../components/CardStat";

type Props = {
  activeCount: number;
  onRideCount: number;
  offlineCount: number;
  revenue: string;
};

export default function DriversStats({
  activeCount,
  onRideCount,
  offlineCount,
  revenue,
}: Props) {
  const stats = [
    { label: "Active Now", value: String(activeCount), icon: PeopleIcon },
    { label: "On Ride", value: String(onRideCount), icon: DirectionsCarIcon },
    { label: "Offline", value: String(offlineCount), icon: PersonOffIcon },
    { label: "Revenue MTD", value: revenue, icon: AttachMoneyIcon },
  ];

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
