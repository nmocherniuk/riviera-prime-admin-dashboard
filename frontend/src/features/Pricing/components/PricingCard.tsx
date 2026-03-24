import { Box, IconButton, Paper, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import type { VehiclePricing } from "../data/pricingData";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import type { FleetClass } from "../../Fleet/data/dummyFleet";

const classColors: Record<FleetClass, { bg: string; color: string }> = {
  Comfort: { bg: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" },
  Business: { bg: "rgba(212,175,53,0.2)", color: "#D4AF35" },
  Van: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
};

type Props = {
  row: VehiclePricing;
  onEditRow: (row: VehiclePricing) => void;
};

export default function PricingCard({ row, onEditRow }: Props) {
  const classStyle = classColors[row.vehicle.class];
  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,0.02)",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 1.5,
          mb: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
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
          <Box>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {row.vehicle.vehicleName}
            </Typography>
            <Chip
              label={row.vehicle.class}
              size="small"
              sx={{
                mt: 0.5,
                bgcolor: classStyle.bg,
                color: classStyle.color,
                fontWeight: 600,
                fontSize: "0.7rem",
              }}
            />
          </Box>
        </Box>
        {onEditRow ? (
          <IconButton
            size="small"
            sx={{ color: "text.secondary" }}
            aria-label="actions"
            onClick={() => onEditRow(row)}
          >
            <MoreVertIcon />
          </IconButton>
        ) : null}
      </Box>
      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Per hour: <strong style={{ color: "inherit" }}>{row.perHour}</strong>
        </Typography>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          Per KM: <strong style={{ color: "inherit" }}>{row.perKm}</strong>
        </Typography>
      </Box>
    </Paper>
  );
}
