import { Avatar, Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import { useCallback, useState } from "react";
import type { Driver, DriverStatus } from "../../data/dummyDrivers";
import { GenericTable } from "../../../../../components/GenericTable";
import EntityActionsMenu from "../../../../../components/EntityActionsMenu";
import DriverCard from "./DriverCard";

const statusColors: Record<DriverStatus, { bg: string; color: string }> = {
  AVAILABLE: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  "ON RIDE": { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
  OFFLINE: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

type Props = {
  drivers: Driver[];
  onDriverView?: (driver: Driver) => void;
  onDriverEdit?: (driver: Driver) => void;
  onDriverDelete?: (driver: Driver) => void;
};

export default function DriversTable({
  drivers,
  onDriverView,
  onDriverEdit,
  onDriverDelete,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Driver | null>(null);

  const openMenu = useCallback(
    (e: React.MouseEvent<HTMLElement>, d: Driver) => {
      e.stopPropagation();
      setMenuAnchor(e.currentTarget);
      setSelected(d);
    },
    [],
  );

  const closeMenu = useCallback(() => {
    setMenuAnchor(null);
    setSelected(null);
  }, []);

  const columns = [
    {
      key: "name",
      label: "Driver Name",
      render: (d: Driver) => (
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
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {d.name}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              ID: {d.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "vehicle",
      label: "Vehicle",
      render: (d: Driver) => (
        <>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {d.vehicle}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {d.vehicleColor} · {d.vehiclePlate}
          </Typography>
        </>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (d: Driver) => (
        <Chip
          label={d.status}
          size="small"
          sx={{
            bgcolor: statusColors[d.status].bg,
            color: statusColors[d.status].color,
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: 0.5,
          }}
        />
      ),
    },
    {
      key: "rides",
      label: "Rides",
      render: (d: Driver) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {d.rides}
        </Typography>
      ),
    },
    {
      key: "earning",
      label: "Earning",
      render: (d: Driver) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {d.earning}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <GenericTable
        title="Drivers"
        withPagination={{
          pageSize: 6,
        }}
        data={drivers}
        columns={columns}
        onRowClick={onDriverView}
        actions={openMenu}
        renderMobileCard={(driver) => (
          <DriverCard
            key={driver.id}
            driver={driver}
            onView={onDriverView ? () => onDriverView(driver) : undefined}
            onEdit={onDriverEdit ? () => onDriverEdit(driver) : undefined}
            onDelete={onDriverDelete ? () => onDriverDelete(driver) : undefined}
          />
        )}
      />
      <EntityActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        menuPaperSx={{ sx: { minWidth: 160, borderRadius: 2 } }}
        actions={[
          {
            label: "Edit",
            icon: <EditIcon fontSize="small" />,
            onClick: () => {
              if (selected) onDriverEdit?.(selected);
              closeMenu();
            },
          },
          {
            label: "Delete",
            color: "error.main",
            icon: <DeleteIcon fontSize="small" />,
            onClick: () => {
              if (selected) onDriverDelete?.(selected);
              closeMenu();
            },
          },
        ]}
      />
    </>
  );
}
