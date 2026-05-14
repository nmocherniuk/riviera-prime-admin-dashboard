import { useState } from "react";
import {
  Box,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";
import SecurityAgentCard from "./SecurityAgentCard";
import { GenericTable } from "../../../../../components/GenericTable";
import EntityActionsMenu from "../../../../../components/EntityActionsMenu";
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
  securityAgents: SecurityAgent[];
  onSecurityAgentView: (b: SecurityAgent) => void;
  onSecurityAgentEdit: (b: SecurityAgent) => void;
  onSecurityAgentDelete: (b: SecurityAgent) => void;
};



export default function SecurityAgentsTable({ securityAgents, onSecurityAgentView, onSecurityAgentEdit, onSecurityAgentDelete }: Props) {
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selected, setSelected] = useState<SecurityAgent | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, b: SecurityAgent) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelected(b);
  };
  const closeMenu = () => { setMenuAnchor(null); setSelected(null); };

  const columns = [
    {
      key: "name",
      label: securityAgentContent.table.columnName,
      render: (a: SecurityAgent) => <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
        <Box sx={{ width: 40, height: 40, borderRadius: 2, bgcolor: "rgba(255,255,255,0.08)", display: "flex", alignItems: "center", justifyContent: "center", color: "text.secondary" }}>
          <PersonIcon fontSize="small" />
        </Box>
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>{displayName(a)}</Typography>
      </Box>,
    },
    {
      key: "licenseCertification",
      label: securityAgentContent.table.columnLicenseCertification,
      render: (a: SecurityAgent) => <Typography variant="body2" sx={{ color: "text.secondary" }}>{displayLicense(a)}</Typography>,
    },
    {
      key: "experience",
      label: securityAgentContent.table.columnExperience,
      render: (a: SecurityAgent) => <Typography variant="body2" sx={{ color: "text.secondary" }}>{displayExperienceYears(a)}</Typography>,
    },
    {
      key: "languages",
      label: securityAgentContent.table.columnLanguages,
      render: (a: SecurityAgent) => <Typography variant="body2" sx={{ color: "text.secondary" }}>{displayLanguages(a)}</Typography>,
    },
    {
      key: "status",
      label: securityAgentContent.table.columnStatus,
      render: (a: SecurityAgent) => {
        const s = statusStyle(a.status ?? true);
        return (
          <Chip
            label={s.label}
            size="small"
            sx={{ bgcolor: s.bg, color: s.color, fontWeight: 700, fontSize: "0.7rem" }}
          />
        );
      },
    },
  ];

  return (
    <>
      <GenericTable
        title={securityAgentContent.table.title}
        columns={columns}
        data={securityAgents}
        actions={openMenu}
        withPagination={{
          pageSize: 6,
        }}
        onRowClick={onSecurityAgentView}
        renderMobileCard={(b) => <SecurityAgentCard key={b.id} securityAgent={b} onView={onSecurityAgentView} onEdit={onSecurityAgentEdit} onDelete={onSecurityAgentDelete} />}
      />
      <EntityActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        menuPaperSx={{ minWidth: 200, borderRadius: 2 }}
        actions={[
          {
            label: securityAgentContent.rowMenu.edit,
            icon: <EditIcon fontSize="small" />,
            disabled: !selected,
            onClick: () => selected && onSecurityAgentEdit(selected),
          },
          {
            label: securityAgentContent.rowMenu.delete,
            icon: <DeleteIcon fontSize="small" />,
            disabled: !selected,
            color: "error.main",
            onClick: () => selected && onSecurityAgentDelete(selected),
          },
        ]}
      />
    </>
  );
}

