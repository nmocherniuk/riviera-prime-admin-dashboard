import { useState } from "react";
import { Box, IconButton, ListItemIcon, ListItemText, Menu, MenuItem, Paper, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import type { Bodyguard, BodyguardAvailabilityStatus } from "../../data/types";

const statusColors: Record<BodyguardAvailabilityStatus, { bg: string; color: string }> = {
  available: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  on_assignment: { bg: "rgba(249, 115, 22, 0.2)", color: "#f97316" },
  off_duty: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

type Props = {
  bodyguard: Bodyguard;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

export default function BodyguardCard({ bodyguard: b, onView, onEdit, onDelete }: Props) {
  const statusStyle = statusColors[b.availabilityStatus];
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);

  return (
    <Paper
      elevation={0}
      onClick={onView}
      sx={{
        p: 2,
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        textAlign: "left",
        width: "100%",
        cursor: onView ? "pointer" : undefined,
        "&:hover": onView ? { bgcolor: "rgba(255,255,255,0.03)" } : undefined,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
          <Box sx={{ width: 44, height: 44, flexShrink: 0, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
            <PersonIcon fontSize="small" />
          </Box>
          <Box minWidth={0}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, color: "text.primary" }}>{b.name}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>{b.licenseCertification}</Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>{b.experience} • {b.languages}</Typography>
          </Box>
        </Box>
        <IconButton size="small" sx={{ color: "text.secondary", flexShrink: 0 }} aria-label="actions" onClick={(e) => { e.stopPropagation(); setMenuAnchor(e.currentTarget); }}>
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={() => setMenuAnchor(null)} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { minWidth: 160, borderRadius: 2 } } }}>
        <MenuItem onClick={() => { onView?.(); setMenuAnchor(null); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onEdit?.(); setMenuAnchor(null); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { onDelete?.(); setMenuAnchor(null); }} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
      <Box sx={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 1, mt: 1.5, pt: 1.5, borderTop: 1, borderColor: "divider" }}>
        <Chip label={b.availabilityStatus.replace("_", " ")} size="small" sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 700, fontSize: "0.7rem" }} />
        {b.notes && <Typography variant="caption" sx={{ color: "text.secondary" }} noWrap>{b.notes}</Typography>}
      </Box>
    </Paper>
  );
}
