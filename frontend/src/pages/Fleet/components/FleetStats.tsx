import { Box, Paper, Typography } from "@mui/material";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import LocalTaxiIcon from "@mui/icons-material/LocalTaxi";
import OfflineBoltIcon from "@mui/icons-material/OfflineBolt";

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
      {stats.map(({ label, value, icon: Icon }) => (
        <Paper
          key={label}
          elevation={0}
          sx={{
            p: { xs: 1.5, sm: 2 },
            borderRadius: { xs: 2, md: 3 },
            border: 1,
            borderColor: "divider",
            bgcolor: "background.paper",
          }}
        >
          <Icon
            sx={{
              color: "primary.main",
              fontSize: { xs: 24, md: 28 },
              mb: 1,
              opacity: 0.9,
            }}
          />
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: "text.secondary",
              textTransform: "uppercase",
              letterSpacing: 0.8,
              fontWeight: 700,
              fontSize: { xs: "0.7rem", md: "inherit" },
            }}
          >
            {label}
          </Typography>
          <Typography
            variant="h5"
            sx={{
              mt: 0.5,
              fontWeight: 800,
              color: "text.primary",
              fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
            }}
          >
            {value}
          </Typography>
        </Paper>
      ))}
    </Box>
  );
}
