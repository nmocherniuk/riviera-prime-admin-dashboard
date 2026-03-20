import { Box, IconButton, Paper, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import BusinessIcon from "@mui/icons-material/Business";
import type {
  DriverOrganization,
  DriverOrganizationStatus,
} from "../data/types";
import { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import GroupIcon from "@mui/icons-material/Group";
import EntityActionsMenu from "../../../../components/EntityActionsMenu";

const statusColors: Record<
  DriverOrganizationStatus,
  { bg: string; color: string }
> = {
  active: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  inactive: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

type Props = {
  organization: DriverOrganization;
  onViewDrivers?: () => void;
  onViewDetails?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function DriverOrganizationCard({
  organization: o,
  onViewDrivers,
  onViewDetails,
  onEdit,
  onDelete,
}: Props) {
  const statusStyle = statusColors[o.status];
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
  };
  const closeMenu = () => setMenuAnchor(null);

  return (
    <Paper
      elevation={0}
      onClick={onViewDrivers}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "left",
        width: "100%",
        cursor: onViewDrivers ? "pointer" : undefined,
        "&:hover": onViewDrivers
          ? { bgcolor: "rgba(255,255,255,0.03)" }
          : undefined,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 1,
        }}
      >
        <Box
          sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}
        >
          <Box
            sx={{
              width: 44,
              height: 44,
              flexShrink: 0,
              borderRadius: 2,
              bgcolor: "rgba(255,255,255,0.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "text.secondary",
            }}
          >
            <BusinessIcon fontSize="small" />
          </Box>
          <Box minWidth={0}>
            <Typography
              variant="subtitle2"
              sx={{ fontWeight: 700, color: "text.primary" }}
            >
              {o.organizationName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Contact: {o.contactPerson}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary", display: "block" }}
            >
              ID: {o.id}
            </Typography>
          </Box>
        </Box>

        <IconButton
          size="small"
          sx={{ color: "text.secondary", flexShrink: 0 }}
          aria-label="actions"
          onClick={openMenu}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>

      <EntityActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        menuPaperSx={{ minWidth: 200, borderRadius: 2 }}
        actions={[
          {
            label: "View details",
            icon: <VisibilityIcon fontSize="small" />,
            disabled: !onViewDetails,
            onClick: () => onViewDetails?.(),
          },
          {
            label: "Edit",
            icon: <EditIcon fontSize="small" />,
            disabled: !onEdit,
            onClick: () => onEdit?.(),
          },
          {
            label: "Delete",
            icon: <DeleteIcon fontSize="small" />,
            disabled: !onDelete,
            color: "error.main",
            onClick: () => onDelete?.(),
          },
          {
            label: "View drivers",
            icon: <GroupIcon fontSize="small" />,
            disabled: !onViewDrivers,
            onClick: () => onViewDrivers?.(),
          },
        ]}
      />

      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1.5,
          mt: 1.5,
          pt: 1.5,
          borderTop: 1,
          borderColor: "divider",
        }}
      >
        <Chip
          label={o.status}
          size="small"
          sx={{
            bgcolor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 700,
            fontSize: "0.7rem",
            textTransform: "capitalize",
          }}
        />
        <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>
          {o.serviceArea}
        </Typography>
      </Box>
    </Paper>
  );
}
