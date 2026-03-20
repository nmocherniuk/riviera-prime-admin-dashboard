import { useState } from "react";
import {
  Box,
  IconButton,
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
import SecurityIcon from "@mui/icons-material/Security";
import ArrowLeftIcon from "@mui/icons-material/ArrowLeft";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EntityActionsMenu from "../../../../components/EntityActionsMenu";
import useTablePaginationRange from "../../../../hooks/useTablePaginationRange";
import type { Partner, PartnerStatus } from "../data/types";
import PartnerCard from "./PartnerCard";
import { GenericTable } from "../../../../components/GenericTable";

const statusColors: Record<PartnerStatus, { bg: string; color: string }> = {
  active: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  inactive: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.6)" },
};

const headerCellSx = {
  fontWeight: 700,
  color: "text.secondary",
  textTransform: "uppercase" as const,
  letterSpacing: 0.8,
  py: 1.5,
};

type Props = {
  partners: Partner[];
  page: number;
  totalCount: number;
  onPageChange: (page: number) => void;
  onPartnerView?: (partner: Partner) => void;
  onPartnerEdit?: (partner: Partner) => void;
  onPartnerDelete?: (partner: Partner) => void;
  onViewBodyguards?: (partner: Partner) => void;
};

const ROWS_PER_PAGE = 4;

export default function PartnersTable({
  partners,
  page,
  totalCount,
  onPageChange,
  onPartnerView,
  onPartnerEdit,
  onPartnerDelete,
  onViewBodyguards,
}: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, partner: Partner) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedPartner(partner);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedPartner(null);
  };

  if (!isDesktop) {
    return (
      <Paper
        elevation={0}
        sx={{
          borderRadius: { xs: 2, md: 3 },
          border: 1,
          borderColor: "divider",
          bgcolor: "background.paper",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: { xs: 1.5, md: 2 },
            py: 1.5,
            borderBottom: 1,
            borderColor: "divider",
          }}
        >
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            Partners
          </Typography>
        </Box>
        <Box
          sx={{
            px: { xs: 1.5, md: 2 },
            py: 2,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {partners.map((p) => (
            <PartnerCard
              key={p.id}
              partner={p}
              onView={onPartnerView ? () => onPartnerView(p) : undefined}
              onEdit={onPartnerEdit ? () => onPartnerEdit(p) : undefined}
              onDelete={onPartnerDelete ? () => onPartnerDelete(p) : undefined}
              onViewBodyguards={
                onViewBodyguards ? () => onViewBodyguards(p) : undefined
              }
            />
          ))}
        </Box>
      </Paper>
    );
  }

  const columns = [
    {
      key: "companyName",
      label: "Company",
      render: (p: Partner) => (
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
              {p.companyName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              ID: {p.id}
            </Typography>
          </Box>
        </Box>
      ),
    },
    {
      key: "contactPerson",
      label: "Contact",
      render: (p: Partner) => (
        <Typography variant="body2" sx={{ color: "text.primary" }}>
          {p.contactPerson}
        </Typography>
      ),
    },
    {
      key: "emailPhone",
      label: "Email/Phone",
      render: (p: Partner) => (
        <>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {p.email}
          </Typography>
          <Typography
            variant="caption"
            sx={{ color: "text.secondary", display: "block" }}
          >
            {p.phone}
          </Typography>
        </>
      ),
    },
    {
      key: "locationServiceArea",
      label: "Service area",
      render: (p: Partner) => (
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {p.locationServiceArea}
        </Typography>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (p: Partner) => (
        <Chip
          label={p.status}
          size="small"
          sx={{
            bgcolor: statusColors[p.status].bg,
            color: statusColors[p.status].color,
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
        data={partners}
        columns={columns}
        onRowClick={onPartnerView}
        actions={openMenu}
        renderMobileCard={(p) => <PartnerCard key={p.id} partner={p} />}
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
            disabled: !selectedPartner || !onPartnerView,
            onClick: () => selectedPartner && onPartnerView?.(selectedPartner),
          },
          {
            label: "Edit",
            icon: <EditIcon fontSize="small" />,
            disabled: !selectedPartner || !onPartnerEdit,
            onClick: () => selectedPartner && onPartnerEdit?.(selectedPartner),
          },
          {
            label: "Delete",
            icon: <DeleteIcon fontSize="small" />,
            disabled: !selectedPartner || !onPartnerDelete,
            color: "error.main",
            onClick: () =>
              selectedPartner && onPartnerDelete?.(selectedPartner),
          },
        ]}
      />
    </>
  );
}
