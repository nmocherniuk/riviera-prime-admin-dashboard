import { useState } from "react";
import {
  Avatar,
  Box,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
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
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import type { Driver, DriverStatus } from "../data/dummyDrivers";
import DriverCard from "./DriverCard";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";


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
  onDriverView?: (driver: Driver) => void;
  onDriverEdit?: (driver: Driver) => void;
  onDriverDelete?: (driver: Driver) => void;
};

export default function DriversTable({
  drivers,
  page,
  onPageChange,
  onDriverView,
  onDriverEdit,
  onDriverDelete,
}: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedDriver, setSelectedDriver] = useState<Driver | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, driver: Driver) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedDriver(driver);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedDriver(null);
  };
  const handleEdit = () => {
    if (selectedDriver) onDriverEdit?.(selectedDriver);
    closeMenu();
  };
  const handleDelete = () => {
    if (selectedDriver) onDriverDelete?.(selectedDriver);
    closeMenu();
  };
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
            Drivers
          </Typography>
        </Box>
        <Box sx={{ px: { xs: 1.5, md: 2 }, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {drivers.map((d) => (
            <DriverCard
              key={d.id}
              driver={d}
              onView={onDriverView ? () => onDriverView(d) : undefined}
              onEdit={onDriverEdit ? () => onDriverEdit(d) : undefined}
              onDelete={onDriverDelete ? () => onDriverDelete(d) : undefined}
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
          Drivers
        </Typography>
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
                  onClick={() => onDriverView?.(d)}
                  sx={{
                    cursor: onDriverView ? "pointer" : "default",
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
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      sx={{ color: "text.secondary" }}
                      aria-label="actions"
                      onClick={(e) => openMenu(e, d)}
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
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 160, borderRadius: 2 } } }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleDelete} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}>
            <DeleteIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
