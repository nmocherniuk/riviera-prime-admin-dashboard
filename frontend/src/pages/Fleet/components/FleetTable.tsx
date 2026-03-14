import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import type { FleetVehicle, FleetClass, FleetStatus } from "../data/dummyFleet";
import FleetCard from "./FleetCard";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";

const ROWS_PER_PAGE = 4;
const TOTAL_FLEET = 28;

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
  vehicles: FleetVehicle[];
  page: number;
  onPageChange: (page: number) => void;
  onVehicleClick?: (vehicle: FleetVehicle) => void;
};

export default function FleetTable({
  vehicles,
  page,
  onPageChange,
  onVehicleClick,
}: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const from = (page - 1) * ROWS_PER_PAGE + 1;
  const to = (page - 1) * ROWS_PER_PAGE + vehicles.length;
  const hasNext = page * ROWS_PER_PAGE < TOTAL_FLEET;
  const hasPrev = page > 1;

  const paginationBar = (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        px: { xs: 1.5, md: 2 },
        py: 1.5,
        borderTop: 1,
        borderColor: "divider",
      }}
    >
      <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 600 }}>
        SHOWING {from}-{to} OF {TOTAL_FLEET} FLEET
      </Typography>
      <Box sx={{ display: "flex", gap: 0.5 }}>
        <IconButton
          size="small"
          disabled={!hasPrev}
          onClick={() => onPageChange(page - 1)}
          sx={{
            bgcolor: "rgba(255,255,255,0.06)",
            color: "text.primary",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            "&.Mui-disabled": { color: "text.secondary" },
          }}
        >
          <ArrowLeftIcon />
        </IconButton>
        <IconButton
          size="small"
          disabled={!hasNext}
          onClick={() => onPageChange(page + 1)}
          sx={{
            bgcolor: "rgba(255,255,255,0.06)",
            color: "text.primary",
            "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
            "&.Mui-disabled": { color: "text.secondary" },
          }}
        >
          <ArrowRightIcon />
        </IconButton>
      </Box>
    </Box>
  );

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
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 1.5, md: 2 },
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
            Fleet
          </Typography>
        </Box>
        <Box sx={{ px: { xs: 1.5, md: 2 }, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {vehicles.map((v) => (
            <FleetCard
              key={v.id}
              vehicle={v}
              {...(onVehicleClick ? { onClick: () => onVehicleClick(v) } : {})}
            />
          ))}
        </Box>
        {paginationBar}
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
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
          Fleet
        </Typography>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="medium" sx={{ minWidth: 720 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(255,255,255,0.04)" }}>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
                Vehicle
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
                License Plate
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
                Class
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
                Status
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
                Next Service
              </TableCell>
              <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5, width: 56 }}>
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {vehicles.map((v) => {
              const classStyle = classColors[v.class];
              const statusStyle = statusColors[v.status];
              return (
                <TableRow
                  key={v.id}
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
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {v.licensePlate}
                    </Typography>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {v.nextService}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <IconButton
                      size="small"
                      sx={{ color: "text.secondary" }}
                      aria-label="actions"
                      onClick={() => onVehicleClick?.(v)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      {paginationBar}
    </Paper>
  );
}
