import { useState } from "react";
import {
  Box,

  Typography,

} from "@mui/material";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";


import { GenericTable } from "../../../components/GenericTable";
import EntityActionsMenu from "../../../components/EntityActionsMenu";
import FleetCard from "./FleetCard";
import type { FleetVehicle } from "./ModalManagement/fleetManagementForm.types";
import { FLEET_STATUS_LABELS, type FleetClass, type FleetStatus } from "../data/dummyFleet";
import { classColors, statusColors } from "./ModalManagement/constants";

type Props = {
  vehicles: FleetVehicle[];
  onVehicleView: (vehicle: FleetVehicle) => void;
  onVehicleEdit: (vehicle: FleetVehicle) => void;
  onVehicleDelete: (vehicle: FleetVehicle) => void;
};

export default function FleetTable({
  vehicles,
  onVehicleView,
  onVehicleEdit,
  onVehicleDelete,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, vehicle: FleetVehicle) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedVehicle(vehicle);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedVehicle(null);
  };

  const columns = [
    {
      key: "vehicle",
      label: "Vehicle",
      render: (v: FleetVehicle) => (
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
              {v.year}
              {v.color ? ` · ${v.color}` : ""}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              ID: {v.id}
            </Typography>
          </Box>
        </Box>
      )
    },
    {
      key: "licensePlate",
      label: "License Plate",
      render: (v: FleetVehicle) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {v.licensePlate}
        </Typography>
      )
    },
    {
      key: "class",
      label: "Class",
      render: (v: FleetVehicle) => (
        <Chip
          label={v.class}
          size="small"
          sx={{
            bgcolor: classColors[v.class as FleetClass].bg,
            color: classColors[v.class as FleetClass].color,
            fontWeight: 700,
            fontSize: "0.7rem",
          }}
        />
      )
    },
    {
      key: "status",
      label: "Status",
      render: (v: FleetVehicle) => (
        <Chip
          label={FLEET_STATUS_LABELS[v.status as FleetStatus]}
          size="small"
          sx={{
            bgcolor: statusColors[v.status as FleetStatus].bg,
            color: statusColors[v.status as FleetStatus].color,
            fontWeight: 700,
            fontSize: "0.7rem",
            letterSpacing: 0.5,
          }}
        />
      )
    },
    {
      key: "color",
      label: "Color",
      render: (v: FleetVehicle) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {v.color || "—"}
        </Typography>
      )
    }
  ]

  return (
    <>
      <GenericTable
        title="Fleet"
        withPagination={{
          pageSize: 6,
        }}
        columns={columns}
        data={vehicles}
        onRowClick={onVehicleView}
        actions={openMenu}
        renderMobileCard={(v) => (
          <FleetCard
            key={v.id}
            vehicle={v}
            onView={() => onVehicleView(v)}
            onEdit={() => onVehicleEdit(v)}
            onDelete={() => onVehicleDelete(v)}
          />
        )}
      />
      <EntityActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        menuPaperSx={{ minWidth: 200, borderRadius: 2 }}
        actions={[
          {
            label: "Edit",
            icon: <EditIcon fontSize="small" />,
            disabled: !selectedVehicle,
            onClick: () =>
              selectedVehicle && onVehicleEdit?.(selectedVehicle),
          },
          {
            label: "Delete",
            icon: <DeleteIcon fontSize="small" />,
            disabled: !selectedVehicle,
            color: "error.main",
            onClick: () =>
              selectedVehicle && onVehicleDelete?.(selectedVehicle),
          },
        ]}
      />
    </>
  );
}
