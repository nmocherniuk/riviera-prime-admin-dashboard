import { useState } from "react";
import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import type { SecurityAgent } from "./ModalManagement/securityAgentForm.types";
import { securityAgentContent } from "../../../../../content/securityAgent";
import { commonContent } from "../../../../../content/common";


const statusStyle = (active: boolean) =>
  active
    ? {
        bg: "rgba(34, 197, 94, 0.2)" as const,
        color: "#22c55e" as const,
        label: commonContent.status.active,
      }
    : {
        bg: "rgba(255,255,255,0.08)" as const,
        color: "rgba(255,255,255,0.6)" as const,
        label: commonContent.status.inactive,
      };


function displayLanguages(a: SecurityAgent): string {
  const raw = a.languages as unknown;
  if (raw == null) return "";
  return Array.isArray(raw) ? raw.join(", ") : String(raw);
}

function displayName(a: SecurityAgent): string {
  const n = `${a.firstName ?? ""} ${a.lastName ?? ""}`.trim();
  return n || "—";
}


function displayLicense(a: SecurityAgent): string {
  const parts = [a.professionalCardNumber, a.cnapsNumber].filter(Boolean);
  return parts.length ? parts.join(" · ") : "—";
}

function displayExperienceYears(a: SecurityAgent): string {
  const y = a.experienceYears;
  if (y === null || y === undefined || y === "") return "";
  return `${y}${securityAgentContent.table.experienceYearsSuffix}`;
}



type Props = {
  securityAgent: SecurityAgent;
  onView: (a: SecurityAgent) => void;
  onEdit: (a: SecurityAgent) => void;
  onDelete: (a: SecurityAgent) => void;
};



export default function SecurityAgentCard({ securityAgent: a, onView, onEdit, onDelete }: Props) {
  const chip = statusStyle(a.status ?? true);
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const exp = displayExperienceYears(a);
  const langs = displayLanguages(a);

  return (
    <Paper
      elevation={0}
      onClick={() => onView(a)}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "left",
        width: "100%",
        cursor: "pointer",
        "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
      }}

    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
            <PersonIcon fontSize="small" />
          </Box>
          <Box minWidth={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>{displayName(a)}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>{displayLicense(a)}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              {exp || "—"}{langs ? ` • ${langs}` : ""}
            </Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: "text.secondary", flexShrink: 0 }} aria-label={commonContent.dataTable.actionsColumn} onClick={(e) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); }}>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { minWidth: 160, borderRadius: 2 } } }}>
        <MenuItem onClick={() => { onView(a); setMenuAnchor(null); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{securityAgentContent.rowMenu.viewDetails}</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onEdit(a); setMenuAnchor(null); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{securityAgentContent.rowMenu.edit}</ListItemText>
        </MenuItem>

        <MenuItem onClick={() => { onDelete(a); setMenuAnchor(null); }} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>{securityAgentContent.rowMenu.delete}</ListItemText>
        </MenuItem>
      </Menu>

      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 1.5, pt: 1.5, borderTop: 1, borderColor: "divider" }}>
        <Chip label={chip.label} size="small" sx={{ bgcolor: chip.bg, color: chip.color, fontWeight: 700, fontSize: "0.7rem" }} />
        {a.notes && <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>{a.notes}</Typography>}
      </Box>
    </Paper>
  );
}

