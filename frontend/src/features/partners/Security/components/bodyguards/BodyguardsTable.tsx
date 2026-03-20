import { useState } from "react";
import {
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import type { Bodyguard, BodyguardAvailabilityStatus } from "../../data/types";
import BodyguardCard from "./BodyguardCard";

const statusColors: Record<BodyguardAvailabilityStatus, { bg: string; color: string }> = {
  available: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  on_assignment: { bg: "rgba(249, 115, 22, 0.2)", color: "#f97316" },
  off_duty: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

const headerCellSx = { fontWeight: 700, color: "text.secondary", textTransform: "uppercase" as const, letterSpacing: 0.8, py: 1.5 };

type Props = {
  bodyguards: Bodyguard[];
  onBodyguardView?: (b: Bodyguard) => void;
  onBodyguardEdit?: (b: Bodyguard) => void;
  onBodyguardDelete?: (b: Bodyguard) => void;
};

export default function BodyguardsTable({ bodyguards, onBodyguardView, onBodyguardEdit, onBodyguardDelete }: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Bodyguard | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, b: Bodyguard) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelected(b);
  };
  const closeMenu = () => { setMenuAnchor(null); setSelected(null); };

  if (!isDesktop) {
    return (
      <Paper elevation={0} sx={{ borderRadius: { xs: 2, md: 3 }, border: 1, borderColor: "divider", bgcolor: "background.paper", overflow: "hidden" }}>
        <Box sx={{ px: { xs: 1.5, md: 2 }, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>Bodyguards</Typography>
        </Box>
        <Box sx={{ px: { xs: 1.5, md: 2 }, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          {bodyguards.map((b) => (
            <BodyguardCard
              key={b.id}
              bodyguard={b}
              onView={onBodyguardView ? () => onBodyguardView(b) : undefined}
              onEdit={onBodyguardEdit ? () => onBodyguardEdit(b) : undefined}
              onDelete={onBodyguardDelete ? () => onBodyguardDelete(b) : undefined}
            />
          ))}
        </Box>
      </Paper>
    );
  }

  return (
    <>
      <Paper elevation={0} sx={{ borderRadius: 3, border: 1, borderColor: "divider", bgcolor: "background.paper", overflow: "hidden" }}>
        <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>Bodyguards</Typography>
        </Box>
        <Box sx={{ overflowX: "auto" }}>
          <Table size="medium" sx={{ minWidth: 640 }}>
            <TableHead>
              <TableRow sx={{ bgcolor: "rgba(255,255,255,0.04)" }}>
                <TableCell sx={headerCellSx}>Name</TableCell>
                <TableCell sx={headerCellSx}>License / certification</TableCell>
                <TableCell sx={headerCellSx}>Experience</TableCell>
                <TableCell sx={headerCellSx}>Languages</TableCell>
                <TableCell sx={headerCellSx}>Availability</TableCell>
                <TableCell sx={{ ...headerCellSx, width: 56 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bodyguards.map((b) => {
                const statusStyle = statusColors[b.availabilityStatus];
                return (
                  <TableRow
                    key={b.id}
                    onClick={() => onBodyguardView?.(b)}
                    sx={{
                      cursor: onBodyguardView ? "pointer" : "default",
                      "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                    }}
                  >
                    <TableCell sx={{ py: 2 }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
                          <PersonIcon fontSize="small" />
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{b.name}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{b.licenseCertification}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{b.experience}</Typography></TableCell>
                    <TableCell><Typography variant="body2" sx={{ color: "text.secondary" }}>{b.languages}</Typography></TableCell>
                    <TableCell>
                      <Chip label={b.availabilityStatus.replace("_", " ")} size="small" sx={{ bgcolor: statusStyle.bg, color: statusStyle.color, fontWeight: 700, fontSize: "0.7rem" }} />
                    </TableCell>
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <IconButton size="small" sx={{ color: "text.secondary" }} aria-label="actions" onClick={(e) => openMenu(e, b)}>
                        <MoreVertIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Box>
      </Paper>
      <Menu anchorEl={menuAnchor} open={Boolean(menuAnchor)} onClose={closeMenu} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }} slotProps={{ paper: { sx: { minWidth: 160, borderRadius: 2 } } }}>
        <MenuItem onClick={() => { selected && onBodyguardView?.(selected); closeMenu(); }}>
          <ListItemIcon><VisibilityIcon fontSize="small" /></ListItemIcon>
          <ListItemText>View details</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { selected && onBodyguardEdit?.(selected); closeMenu(); }}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Edit</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => { selected && onBodyguardDelete?.(selected); closeMenu(); }} sx={{ color: "error.main" }}>
          <ListItemIcon sx={{ color: "error.main" }}><DeleteIcon fontSize="small" /></ListItemIcon>
          <ListItemText>Delete</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}
