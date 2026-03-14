import { Box, IconButton, Paper, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import type { FleetVehicle, FleetClass, FleetStatus } from "../data/dummyFleet";

const classColors: Record<FleetClass, { bg: string; color: string }> = {
  Comfort: { bg: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" },
  Business: { bg: "rgba(212,175,53,0.2)", color: "#D4AF35" },
  Van: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
};

const statusColors: Record<FleetStatus, { bg: string; color: string }> = {
  AVAILABLE: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  "ON TRIP": { bg: "rgba(249, 115, 22, 0.2)", color: "#f97316" },
};

type Props = {
  vehicle: FleetVehicle;
  onClick?: () => void;
};

export default function FleetCard({ vehicle: v, onClick }: Props) {
  const classStyle = classColors[v.class];
  const statusStyle = statusColors[v.status];
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        cursor: onClick ? "pointer" : undefined,
        textAlign: "left",
        width: "100%",
      }}
      onClick={onClick}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            <DirectionsCarIcon fontSize="small" />
          </Box>
          <Box minWidth={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {v.vehicleName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {v.yearColor}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              ID: {v.id}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          sx={{ color: "text.secondary", flexShrink: 0 }}
          aria-label="actions"
          onClick={(e) => {
            e.stopPropagation();
            onClick?.();
          }}
        >
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
          label={v.class}
          size="small"
          sx={{
            bgcolor: classStyle.bg,
            color: classStyle.color,
            fontWeight: 700,
            fontSize: "0.7rem",
          }}
        />
        <Chip
          label={v.status}
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
          {v.licensePlate}
        </Typography>
        <Typography variant="caption" sx={{ color: "text.primary", fontWeight: 600 }}>
          Next: {v.nextService}
        </Typography>
      </Box>
    </Paper>
  );
}
