import {
  Avatar,
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PersonIcon from "@mui/icons-material/Person";
import type { Driver, DriverStatus } from "../data/dummyDrivers";

const statusColors: Record<
  DriverStatus,
  { bg: string; color: string }
> = {
  AVAILABLE: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  "ON RIDE": { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
  OFFLINE: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

type Props = { driver: Driver };

export default function DriverCard({ driver: d }: Props) {
  const statusStyle = statusColors[d.status];
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Avatar
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              bgcolor: "rgba(255,255,255,0.1)",
              color: "text.secondary",
            }}
          >
            <PersonIcon fontSize="small" />
          </Avatar>
          <Box minWidth={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {d.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              ID: {d.id}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary", mt: 0.5 }}>
              {d.vehicle}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {d.vehicleColor} · {d.vehiclePlate}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: "text.secondary", flexShrink: 0 }} aria-label="actions">
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          mt: 1.5,
          pt: 1.5,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Chip
          label={d.status}
          size="small"
          sx={{
            bgcolor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: 0.5,
          }}
        />
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          Rides: {d.rides}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          {d.earning}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600 }}>
          {d.todayShift}
        </Typography>
      </Box>
    </Paper>
  );
}
