import { Box, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import BusinessIcon from "@mui/icons-material/Business";
import { useState } from "react";
import DriverOrganizationCard from "./DriverOrganizationCard";
import type {
  DriverOrganization,
  DriverOrganizationStatus,
} from "../data/types";
import EntityActionsMenu from "../../../../components/EntityActionsMenu";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { GenericTable } from "../../../../components/GenericTable";

const statusColors: Record<
  DriverOrganizationStatus,
  { bg: string; color: string }
> = {
  active: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  inactive: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

type Props = {
  organizations: DriverOrganization[];
  page: number;
  totalCount: number;
  onPageChange: (page: number) => void;
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
      label: "Organization",
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
              ID: {org.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "contact",
      label: "Contact",
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
      key: "serviceArea",
      label: "Service area",
      render: (org: DriverOrganization) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {org.serviceArea}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (org: DriverOrganization) => (
        <Chip
          label={org.status}
          size="small"
          sx={{
            bgcolor: statusColors[org.status].bg,
            color: statusColors[org.status].color,
            fontWeight: 700,
            fontSize: "0.7rem",
            textTransform: "capitalize",
          }}
        />
      ),
    },
  ];

  return (
    <>
      <GenericTable
        title="Organizations"
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
            label: "View details",
            icon: <VisibilityIcon fontSize="small" />,
            disabled: !selected,
            onClick: () => selected && onViewDetails(selected),
          },
          {
            label: "Edit",
            icon: <EditIcon fontSize="small" />,
            disabled: !selected,
            onClick: () => selected && onEdit(selected),
          },
          {
            label: "Delete",
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
