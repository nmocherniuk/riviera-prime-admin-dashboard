import {
  Box,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import type { Payment, PaymentStatus } from "../../../api/payments";
import { formatMoney } from "../utils/formatMoney";
import { paymentStatusChipLabel } from "../../../content/payments";
import { commonContent } from "../../../content/common";

const statusColors: Record<PaymentStatus, { bg: string; color: string }> = {
  unpaid: { bg: "rgba(251, 191, 36, 0.25)", color: "#EAB308" },
  paid: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
};

type Props = {
  payment: Payment;
  onView?: () => void;
  onOpenMenu: (e: React.MouseEvent<HTMLElement>) => void;
};

export default function PaymentCard({ payment: p, onView, onOpenMenu }: Props) {
  const statusStyle = statusColors[p.paymentStatus];

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
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0, flex: 1 }}>
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
            <AttachMoneyIcon fontSize="small" />
          </Box>
          <Box sx={{ minWidth: 0 }}>
            <Typography variant="body2" sx={{ fontWeight: 700, color: "text.primary" }}>
              {p.bookingId}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.primary" }}>
              {p.clientName}
            </Typography>
            <Typography variant="caption" sx={{ color: "text.secondary", display: "block" }}>
              {p.route}
            </Typography>
          </Box>
        </Box>
        <IconButton
          size="small"
          sx={{ color: "text.secondary", flexShrink: 0 }}
          aria-label={commonContent.dataTable.actionsColumn}
          onClick={(e) => {
            e.stopPropagation();
            onOpenMenu(e);
          }}
        >
          <MoreVertIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          mt: 1.5,
          pt: 1.5,
          borderTop: 1,
          borderColor: "divider",
          display: "flex",
          flexWrap: "wrap",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
          {formatMoney(p.amount, p.currency)}
        </Typography>
        <Chip
          label={paymentStatusChipLabel(p.paymentStatus)}
          size="small"
          sx={{
            bgcolor: statusStyle.bg,
            color: statusStyle.color,
            fontWeight: 700,
            fontSize: "0.7rem",
            textTransform: "capitalize",
          }}
        />
        <Typography variant="caption" sx={{ color: "text.secondary", ml: "auto" }}>
          {p.date}
        </Typography>
      </Box>
    </Paper>
  );
}
