import { useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SecurityIcon from "@mui/icons-material/Security";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EntityActionsMenu from "../../../../components/EntityActionsMenu";
import SecurityOrganizationCard from "./SecurityOrganizationCard";
import { GenericTable } from "../../../../components/GenericTable";
import type { SecurityOrganization, SecurityOrganizationStatus } from "../data/types";

const statusColors: Record<SecurityOrganizationStatus, { bg: string; color: string }> = {
  active: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  inactive: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};


type Props = {
  organizations: SecurityOrganization[];
  onOrganizationView?: (organization: SecurityOrganization) => void;
  onOrganizationEdit?: (organization: SecurityOrganization) => void;
  onOrganizationDelete?: (organization: SecurityOrganization) => void;
  onViewBodyguards?: (partner: SecurityOrganization) => void;
};


export default function SecurityOrganizationTable({
  organizations,
  onOrganizationView,
  onOrganizationEdit,
  onOrganizationDelete,
  onViewBodyguards,
}: Props) {

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedOrganization, setSelectedOrganization] = useState<SecurityOrganization | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, organization: SecurityOrganization) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedOrganization(organization);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedOrganization(null);
  };

  const columns = [
    {
      key: "companyName",
      label: "Company",
      render: (o: SecurityOrganization) => (
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
            <SecurityIcon fontSize="small" />
          </Box>
          <Box>
            <Typography
              variant="body2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {o.organizationName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              ID: {o.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "contactPerson",
      label: "Contact",
      render: (o: SecurityOrganization) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {o.contactPerson}
        </Typography>
      ),
    },
    {
      key: "emailPhone",
      label: "Email/Phone",
      render: (o: SecurityOrganization) => (
        <>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {o.email}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            {o.phone}
          </Typography>
        </>
      ),
    },
    {
      key: "locationServiceArea",
      label: "Service area",
      render: (o: SecurityOrganization) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {o.serviceAreas}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (o: SecurityOrganization) => (
        <Chip
          label={o.status ? "active" : "inactive"}
          size="small"
          sx={{
            bgcolor: statusColors[o.status ? "active" : "inactive"].bg,
            color: statusColors[o.status ? "active" : "inactive"].color,
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
        data={organizations}
        columns={columns}
        withPagination={{
          pageSize: 6,
        }}
        onRowClick={onViewBodyguards}
        actions={openMenu}
        renderMobileCard={(o) => <SecurityOrganizationCard key={o.id} organization={o} />}
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
            disabled: !selectedOrganization || !onOrganizationView,
            onClick: () => selectedOrganization && onOrganizationView?.(selectedOrganization),
          },
          {
            label: "Edit",
            icon: <EditIcon fontSize="small" />,
            disabled: !selectedOrganization || !onOrganizationEdit,
            onClick: () => selectedOrganization && onOrganizationEdit?.(selectedOrganization),
          },
          {
            label: "Delete",
            icon: <DeleteIcon fontSize="small" />,
            disabled: !selectedOrganization || !onOrganizationDelete,
            color: "error.main",
            onClick: () =>
              selectedOrganization && onOrganizationDelete?.(selectedOrganization),
          },
        ]}
      />
    </>
  );
}
