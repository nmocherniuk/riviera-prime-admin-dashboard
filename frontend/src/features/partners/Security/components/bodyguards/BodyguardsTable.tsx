import { useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import type { Bodyguard, BodyguardAvailabilityStatus } from "../../data/types";
import BodyguardCard from "./BodyguardCard";
import { GenericTable } from "../../../../../components/GenericTable";
import EntityActionsMenu from "../../../../../components/EntityActionsMenu";

const statusColors: Record<BodyguardAvailabilityStatus, { bg: string; color: string }> = {
  available: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  on_assignment: { bg: "rgba(249, 115, 22, 0.2)", color: "#f97316" },
  off_duty: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

type Props = {
  bodyguards: Bodyguard[];
  onBodyguardView: (b: Bodyguard) => void;
  onBodyguardEdit: (b: Bodyguard) => void;
  onBodyguardDelete: (b: Bodyguard) => void;
};

export default function BodyguardsTable({ bodyguards, onBodyguardView, onBodyguardEdit, onBodyguardDelete }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<Bodyguard | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, b: Bodyguard) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelected(b);
  };
  const closeMenu = () => { setMenuAnchor(null); setSelected(null); };


  const columns = [
    {
      key: "name",
      label: "Name",
      render: (b: Bodyguard) => <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
          <PersonIcon fontSize="small" />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{b.name}</Typography>
      </Box>,
    },
    {
      key: "licenseCertification",
      label: "License / certification",
      render: (b: Bodyguard) => <Typography variant="body2" sx={{ color: "text.secondary" }}>{b.licenseCertification}</Typography>,
    },
    {
      key: "experience",
      label: "Experience",
      render: (b: Bodyguard) => <Typography variant="body2" sx={{ color: "text.secondary" }}>{b.experience}</Typography>,
    },
    {
      key: "languages",
      label: "Languages",
      render: (b: Bodyguard) => <Typography variant="body2" sx={{ color: "text.secondary" }}>{b.languages}</Typography>,
    },
    {
      key: "availabilityStatus",
      label: "Availability",
      render: (b: Bodyguard) => <Chip label={b.availabilityStatus.replace("_", " ")} size="small" sx={{ bgcolor: statusColors[b.availabilityStatus].bg, color: statusColors[b.availabilityStatus].color, fontWeight: 700, fontSize: "0.7rem" }} />
    },
  ];

  return (
    <>
      <GenericTable
        title="Bodyguards"
        columns={columns}
        data={bodyguards}
        actions={openMenu}
        withPagination={{
          pageSize: 6,
        }}
        onRowClick={onBodyguardView}
        renderMobileCard={(b) => <BodyguardCard key={b.id} bodyguard={b} onView={onBodyguardView} onEdit={onBodyguardEdit} onDelete={onBodyguardDelete} />}
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
            onClick: () => selected && onBodyguardEdit(selected),
          },
          {
            label: "Delete",
            icon: <DeleteIcon fontSize="small" />,
            disabled: !selected,
            color: "error.main",
            onClick: () => selected && onBodyguardDelete(selected),
          },
        ]}
      />
    </>
  );
}
