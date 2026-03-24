import { useState } from "react";
import { Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import type { FleetClass } from "../../Fleet/data/dummyFleet";
import type { VehiclePricing } from "../data/pricingData";
import { GenericTable } from "../../../components/GenericTable";
import EntityActionsMenu from "../../../components/EntityActionsMenu";
import PricingCard from "./PricingCard";

const classColors: Record<FleetClass, { bg: string; color: string }> = {
  Comfort: { bg: "rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.9)" },
  Business: { bg: "rgba(212,175,53,0.2)", color: "#D4AF35" },
  Van: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
};

type Props = {
  rows: VehiclePricing[];
  onEditRow: (row: VehiclePricing) => void;
};

export default function PricingTable({ rows, onEditRow }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<VehiclePricing | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, row: VehiclePricing) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelected(row);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setSelected(null);
  };

  const columns = [
    {
      key: "vehicle",
      label: "Vehicle",
      render: (row: VehiclePricing) => (
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
              variant="body2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {row.vehicle.vehicleName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {row.vehicle.licensePlate}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "class",
      label: "Class",
      render: (row: VehiclePricing) => (
        <Chip
          label={row.vehicle.class}
          size="small"
          sx={{
            bgcolor: classColors[row.vehicle.class].bg,
            color: classColors[row.vehicle.class].color,
            fontWeight: 600,
            fontSize: "0.75rem",
          }}
        />
      ),
    },
    {
      key: "perHour",
      label: "Price per hour",
      render: (row: VehiclePricing) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {row.perHour}
        </Typography>
      ),
    },
    {
      key: "perKm",
      label: "Price per KM",
      render: (row: VehiclePricing) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {row.perKm}
        </Typography>
      ),
    },
  ];

  return (
    <>
      <GenericTable
        title="Vehicle pricing"
        columns={columns}
        data={rows}
        actions={openMenu}
        withPagination={{ pageSize: 6 }}
        renderMobileCard={(row: VehiclePricing) => (
          <PricingCard row={row} onEditRow={onEditRow} />
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
            disabled: !selected,
            onClick: () => selected && onEditRow(selected),
          },
        ]}
      />
    </>
  );
}
