import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import type { FleetClass } from "../../Fleet/data/dummyFleet";
import type { VehiclePricing } from "../data/pricingData";

const classColors: Record<FleetClass, { bg: string; color: string }> = {
  Comfort: { bg: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" },
  Business: { bg: "rgba(212,175,53,0.2)", color: "#D4AF35" },
  Van: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.04)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
    "&.Mui-focused": { bgcolor: "rgba(255,255,255,0.06)" },
  },
};

type Props = {
  rows: VehiclePricing[];
  onPerHourChange: (vehicleId: string, value: string) => void;
  onPerKmChange: (vehicleId: string, value: string) => void;
};

export default function PricingTable({
  rows,
  onPerHourChange,
  onPerKmChange,
}: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  if (!isDesktop) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: 2, md: 3 },
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            px: { xs: 1.5, md: 2 },
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
            Vehicle pricing
          </Typography>
        </Box>
        <Box sx={{ px: { xs: 1.5, md: 2 }, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {rows.map((row) => {
            const classStyle = classColors[row.vehicle.class];
            return (
              <Paper
                key={row.vehicle.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "rgba(255,255,255,0.02)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 1.5 }}>
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
                    <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>
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
                <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <TextField
                    fullWidth
                    size="small"
                    label="Per hour"
                    placeholder="0"
                    type="number"
                    value={row.perHour}
                    onChange={(e) => onPerHourChange(row.vehicle.id, e.target.value)}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    sx={textFieldSx}
                  />
                  <TextField
                    fullWidth
                    size="small"
                    label="Per KM"
                    placeholder="0"
                    type="number"
                    value={row.perKm}
                    onChange={(e) => onPerKmChange(row.vehicle.id, e.target.value)}
                    InputProps={{ inputProps: { min: 0, step: 0.01 } }}
                    sx={textFieldSx}
                  />
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    );
  }

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
          Vehicle pricing
        </Typography>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="medium" sx={{ minWidth: 640 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(255,255,255,0.04)" }}>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  py: 1.5,
                }}
              >
                Vehicle
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  py: 1.5,
                }}
              >
                Class
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  py: 1.5,
                }}
              >
                Price per hour
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 700,
                  color: "text.secondary",
                  textTransform: "uppercase",
                  letterSpacing: 0.8,
                  py: 1.5,
                }}
              >
                Price per KM
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const classStyle = classColors[row.vehicle.class];
              return (
                <TableRow
                  key={row.vehicle.id}
                  sx={{ "&:hover": { bgcolor: "rgba(255,255,255,0.03)" } }}
                >
                  <TableCell sx={{ py: 2 }}>
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
                        <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                          {row.vehicle.vehicleName}
                        </Typography>
                        <Typography variant="caption" sx={{ color: "text.secondary" }}>
                          {row.vehicle.licensePlate}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={row.vehicle.class}
                      size="small"
                      sx={{
                        bgcolor: classStyle.bg,
                        color: classStyle.color,
                        fontWeight: 600,
                        fontSize: "0.75rem",
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <TextField
                      size="small"
                      placeholder="0"
                      type="number"
                      value={row.perHour}
                      onChange={(e) => onPerHourChange(row.vehicle.id, e.target.value)}
                      InputProps={{
                        inputProps: { min: 0, step: 0.01 },
                        sx: { width: 120 },
                      }}
                      sx={textFieldSx}
                    />
                  </TableCell>
                  <TableCell sx={{ py: 1.5 }}>
                    <TextField
                      size="small"
                      placeholder="0"
                      type="number"
                      value={row.perKm}
                      onChange={(e) => onPerKmChange(row.vehicle.id, e.target.value)}
                      InputProps={{
                        inputProps: { min: 0, step: 0.01 },
                        sx: { width: 120 },
                      }}
                      sx={textFieldSx}
                    />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
    </Paper>
  );
}
