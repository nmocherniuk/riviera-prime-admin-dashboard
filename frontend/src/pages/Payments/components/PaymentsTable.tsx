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
import CreditCardIcon from "@mui/icons-material/CreditCard";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PaymentCard from "./PaymentCard";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import LinkIcon from "@mui/icons-material/Link";
import type { Payment, PaymentStatus } from "../data/dummyPayments";

const statusColors: Record<PaymentStatus, { bg: string; color: string }> = {
  pending: { bg: "rgba(245, 158, 11, 0.2)", color: "#F59E0B" },
  authorized: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
  paid: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  failed: { bg: "rgba(239, 68, 68, 0.2)", color: "#EF4444" },
  refunded: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" },
};

const headerCellSx = {
  fontWeight: 700,
  color: "text.secondary",
  textTransform: "uppercase" as const,
  letterSpacing: 0.8,
  py: 1.5,
};

type Props = {
  payments: Payment[];
  onPaymentClick?: (payment: Payment) => void;
  onCapture?: (payment: Payment) => void;
  onRefund?: (payment: Payment) => void;
  onResendLink?: (payment: Payment) => void;
};

export default function PaymentsTable({
  payments,
  onPaymentClick,
  onCapture,
  onRefund,
  onResendLink,
}: Props) {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const openMenu = (e: React.MouseEvent<HTMLElement>, payment: Payment) => {
    e.stopPropagation();
    setMenuAnchor(e.currentTarget);
    setSelectedPayment(payment);
  };
  const closeMenu = () => {
    setMenuAnchor(null);
    setSelectedPayment(null);
  };
  const handleViewDetails = () => {
    if (selectedPayment) onPaymentClick?.(selectedPayment);
    closeMenu();
  };
  const handleCapture = () => {
    if (selectedPayment) onCapture?.(selectedPayment);
    closeMenu();
  };
  const handleRefund = () => {
    if (selectedPayment) onRefund?.(selectedPayment);
    closeMenu();
  };
  const handleResendLink = () => {
    if (selectedPayment) onResendLink?.(selectedPayment);
    closeMenu();
  };

  if (!isDesktop) {
    return (
      <>
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
              px: { xs: 1.5, md: 2 },
              py: 1.5,
              borderBottom: 1,
              borderColor: "divider",
            }}
          >
            <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
              Payments
            </Typography>
          </Box>
          <Box sx={{ px: { xs: 1.5, md: 2 }, py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
            {payments.map((p) => (
              <PaymentCard
                key={p.id}
                payment={p}
                onView={onPaymentClick ? () => onPaymentClick(p) : undefined}
                onOpenMenu={(e) => openMenu(e, p)}
              />
            ))}
          </Box>
        </Paper>
        <Menu
          anchorEl={menuAnchor}
          open={Boolean(menuAnchor)}
          onClose={closeMenu}
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          slotProps={{ paper: { sx: { minWidth: 200, borderRadius: 2 } } }}
        >
          <MenuItem onClick={handleViewDetails}>
            <ListItemIcon>
              <VisibilityIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>View details</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleCapture} disabled={selectedPayment?.paymentStatus !== "authorized"}>
            <ListItemIcon>
              <CreditCardIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Capture payment</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleRefund} disabled={selectedPayment?.paymentStatus !== "paid"}>
            <ListItemIcon>
              <MoneyOffIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Refund payment</ListItemText>
          </MenuItem>
          <MenuItem onClick={handleResendLink} disabled={selectedPayment?.paymentStatus !== "pending"}>
            <ListItemIcon>
              <LinkIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Resend payment link</ListItemText>
          </MenuItem>
        </Menu>
      </>
    );
  }

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
          px: { xs: 1.5, md: 2 },
          py: 1.5,
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "text.primary" }}>
          Payments
        </Typography>
      </Box>
      <Box sx={{ overflowX: "auto" }}>
        <Table size="medium" sx={{ minWidth: 800 }}>
          <TableHead>
            <TableRow sx={{ bgcolor: "rgba(255,255,255,0.04)" }}>
              <TableCell sx={headerCellSx}>Booking ID</TableCell>
              <TableCell sx={headerCellSx}>Client</TableCell>
              <TableCell sx={headerCellSx}>Route</TableCell>
              <TableCell sx={headerCellSx}>Amount</TableCell>
              <TableCell sx={headerCellSx}>Payment Status</TableCell>
              <TableCell sx={headerCellSx}>Payment Method</TableCell>
              <TableCell sx={headerCellSx}>Date</TableCell>
              <TableCell sx={{ ...headerCellSx, width: 56 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {payments.map((p) => {
              const statusStyle = statusColors[p.paymentStatus];
              return (
                <TableRow
                  key={p.id}
                  onClick={() => onPaymentClick?.(p)}
                  sx={{
                    cursor: onPaymentClick ? "pointer" : "default",
                    "&:hover": { bgcolor: "rgba(255,255,255,0.03)" },
                  }}
                >
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                      {p.bookingId}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {p.clientName}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {p.route}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
                      £{p.amount.toFixed(2)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={p.paymentStatus}
                      size="small"
                      sx={{
                        bgcolor: statusStyle.bg,
                        color: statusStyle.color,
                        fontWeight: 700,
                        fontSize: "0.7rem",
                        textTransform: "capitalize",
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.primary" }}>
                      {p.paymentMethod}
                      {p.cardLast4 ? ` ****${p.cardLast4}` : ""}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ color: "text.secondary" }}>
                      {p.date}
                    </Typography>
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <IconButton
                      size="small"
                      sx={{ color: "text.secondary" }}
                      aria-label="actions"
                      onClick={(e) => openMenu(e, p)}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Box>
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { minWidth: 200, borderRadius: 2 } } }}
      >
        <MenuItem onClick={handleViewDetails}>
          <ListItemIcon>
            <VisibilityIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>View details</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleCapture} disabled={selectedPayment?.paymentStatus !== "authorized"}>
          <ListItemIcon>
            <CreditCardIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Capture payment</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleRefund} disabled={selectedPayment?.paymentStatus !== "paid"}>
          <ListItemIcon>
            <MoneyOffIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Refund payment</ListItemText>
        </MenuItem>
        <MenuItem onClick={handleResendLink} disabled={selectedPayment?.paymentStatus !== "pending"}>
          <ListItemIcon>
            <LinkIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>Resend payment link</ListItemText>
        </MenuItem>
      </Menu>
    </Paper>
  );
}
