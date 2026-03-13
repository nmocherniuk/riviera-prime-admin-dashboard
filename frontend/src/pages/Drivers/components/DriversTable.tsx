import {
  Avatar,
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
import PersonIcon from "@mui/icons-material/Person";
import type { Driver, DriverStatus } from "../data/dummyDrivers";
import DriverCard from "./DriverCard";

const ROWS_PER_PAGE = 4;
const TOTAL_DRIVERS = 28;

const statusColors: Record<
  DriverStatus,
  { bg: string; color: string }
> = {
  AVAILABLE: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  "ON RIDE": { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
  OFFLINE: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

type Props = {
  drivers: Driver[];
  page: number;
  onPageChange: (page: number) => void;
  onDriverClick?: (driver: Driver) => void;
};

export default function DriversTable({
  drivers,
  page,
  onPageChange,
  onDriverClick,
}: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const from = (page - 1) * ROWS_PER_PAGE + 1;
  const to = (page - 1) * ROWS_PER_PAGE + drivers.length;
  const hasNext = page * ROWS_PER_PAGE < TOTAL_DRIVERS;
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
        SHOWING {from}-{to} OF {TOTAL_DRIVERS} DRIVERS
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
          ‹
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
          ›
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
            Drivers
          </Typography>
        </Box>
        <Box sx={{ px: { xs: 1.5, md: 2 }, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {drivers.map((d) => (
            <DriverCard key={d.id} driver={d} onClick={() => onDriverClick?.(d)} />
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
          Drivers
        </Typography>
        <IconButton size="small" sx={{ color: "text.secondary" }} aria-label="table options">
          <Box component="span" sx={{ display: "flex", alignItems: "center", gap: 0.25 }}>
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "currentColor" }} />
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "currentColor" }} />
            <Box sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: "currentColor" }} />
          </Box>
        </IconButton>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="medium" sx={{ minWidth: 720 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "rgba(255,255,255,0.04)" }}>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
              Driver Name
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
              Vehicle
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
              Status
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
              Rides
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
              Earning
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5 }}>
              Today Shift
            </TableCell>
            <TableCell sx={{ fontWeight: 700, color: "text.secondary", textTransform: "uppercase", letterSpacing: 0.8, py: 1.5, width: 56 }}>
              Actions
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {drivers.map((d) => {
            const statusStyle = statusColors[d.status];
            return (
              <TableRow
                key={d.id}
                onClick={() => onDriverClick?.(d)}
                sx={{
                  cursor: onDriverClick ? "pointer" : "default",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                }}
              >
                <TableCell sx={{ py: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Avatar
                      sx={{
                        width: 40,
                        height: 40,
                        bgcolor: "rgba(255,255,255,0.1)",
                        color: "text.secondary",
                      }}
                    >
                      <PersonIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
                        {d.name}
                      </Typography>
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        ID: {d.id}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {d.vehicle}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "text.secondary" }}>
                    {d.vehicleColor} · {d.vehiclePlate}
                  </Typography>
                </TableCell>
                <TableCell>
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
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {d.rides}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {d.earning}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: "text.primary" }}>
                    {d.todayShift}
                  </Typography>
                </TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <IconButton
                    size="small"
                    sx={{ color: "text.secondary" }}
                    aria-label="actions"
                    onClick={() => onDriverClick?.(d)}
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
