import { Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import BusinessIcon from "@mui/icons-material/Business";
import { useState } from "react";
import DriverOrganizationCard from "./DriverOrganizationCard";
import type { DriverOrganization } from "../data/types";
import EntityActionsMenu from "../../../../components/EntityActionsMenu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GenericTable } from "../../../../components/GenericTable";
import { driversContent } from "../../../../content/drivers";
import { commonContent } from "../../../../content/common";

const activeChip = {
  bg: "rgba(34, 197, 94, 0.2)",
  color: "#22c55e",
} as const;
const inactiveChip = {
  bg: "rgba(255,255,255,0.08)",
  color: "rgba(255,255,255,0.6)",
} as const;

type Props = {
  organizations: DriverOrganization[];
  onViewDrivers: (org: DriverOrganization) => void;
  onViewDetails: (org: DriverOrganization) => void;
  onEdit: (org: DriverOrganization) => void;
  onDelete: (org: DriverOrganization) => void;
};

export default function DriversOrganizationsTable({
  organizations,
  onViewDrivers,
  onViewDetails,
  onEdit,
  onDelete,
}: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<DriverOrganization | null>(null);

  const openMenu = (
    e: React.MouseEvent<HTMLElement>,
    org: DriverOrganization,
  ) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelected(org);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setSelected(null);
  };

  const columns = [
    {
      key: "organization",
      label: driversContent.table.columnOrganization,
      render: (org: DriverOrganization) => (
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
              flexShrink: 0,
            }}
          >
            <BusinessIcon fontSize="small" />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {org.organizationName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              {driversContent.table.idPrefix}: {org.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "contact",
      label: driversContent.table.columnContact,
      render: (org: DriverOrganization) => (
        <>
          <Typography variant="body2" sx={{ color: "text.primary" }}>
            {org.contactPerson}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            {org.email}
          </Typography>
        </>
      ),
    },
    {
      key: "serviceAreas",
      label: driversContent.table.columnServiceArea,
      render: (org: DriverOrganization) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {org.serviceAreas}
        </Typography>
      ),
    },
    {
      key: "status",
      label: driversContent.table.columnStatus,
      render: (org: DriverOrganization) => {
        const style = org.status ? activeChip : inactiveChip;
        const label = org.status
          ? commonContent.status.active
          : commonContent.status.inactive;
        return (
          <Chip
            label={label}
            size="small"
            sx={{
              bgcolor: style.bg,
              color: style.color,
              fontWeight: 700,
              fontSize: "0.7rem",
            }}
          />
        );
      },
    },
  ];

  return (
    <>
      <GenericTable
        title={driversContent.table.title}
        withPagination={{
          pageSize: 6,
        }}
        data={organizations}
        columns={columns}
        onRowClick={onViewDrivers}
        actions={openMenu}
        renderMobileCard={(org) => (
          <DriverOrganizationCard
            key={org.id}
            organization={org}
            onViewDrivers={() => onViewDrivers(org)}
            onViewDetails={() => onViewDetails(org)}
            onEdit={() => onEdit(org)}
            onDelete={() => onDelete(org)}
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
            label: driversContent.rowMenu.viewDetails,
            icon: <VisibilityIcon fontSize="small" />,
            disabled: !selected,
            onClick: () => selected && onViewDetails(selected),
          },
          {
            label: driversContent.rowMenu.edit,
            icon: <EditIcon fontSize="small" />,
            disabled: !selected,
            onClick: () => selected && onEdit(selected),
          },
          {
            label: driversContent.rowMenu.delete,
            icon: <DeleteIcon fontSize="small" />,
            disabled: !selected,
            color: "error.main",
            onClick: () => selected && onDelete(selected),
          },
        ]}
      />
    </>
  );
}
