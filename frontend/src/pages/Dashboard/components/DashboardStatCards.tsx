import { Box, Paper, Typography } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import PeopleIcon from "@mui/icons-material/People";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";

type StatCard = {
  label: string;
  value: string;
  change: string;
  changeColor: "error" | "success" | "grey";
  icon: React.ComponentType<{ sx?: object }>;
};

const stats: StatCard[] = [
  {
    label: "Today's Rides",
    value: "42",
    change: "-12% VS YESTERDAY",
    changeColor: "error",
    icon: DirectionsCarIcon,
  },
  {
    label: "Today's Revenue",
    value: "€12,450",
    change: "+8% VS YESTERDAY",
    changeColor: "success",
    icon: AttachMoneyIcon,
  },
  {
    label: "Active Drivers",
    value: "18",
    change: "-0% VS YESTERDAY",
    changeColor: "grey",
    icon: PeopleIcon,
  },
  {
    label: "Pending Confirmations",
    value: "5",
    change: "-2% VS YESTERDAY",
    changeColor: "error",
    icon: NotificationsActiveIcon,
  },
];

const changeColorMap = {
  error: "#ef4444",
  success: "#22c55e",
  grey: "text.secondary",
} as const;

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
      {stats.map(({ label, value, change, changeColor, icon: Icon }) => (
        <Paper
          key={label}
          elevation={0}
          sx={{
            p: 2,
            borderRadius: 3,
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: 12,
              right: 12,
              color: "primary.main",
              opacity: 0.9,
            }}
          >
            <Icon sx={{ fontSize: 28 }} />
          </Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h4"
            sx={{
              mt: 0.5,
              fontWeight: 800,
              color: "text.primary",
              fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            }}
          >
            {value}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              mt: 0.5,
              fontWeight: 600,
              fontSize: "0.7rem",
              letterSpacing: 0.5,
              color:
                changeColor === "grey"
                  ? "text.secondary"
                  : changeColorMap[changeColor],
            }}
          >
            {change}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
