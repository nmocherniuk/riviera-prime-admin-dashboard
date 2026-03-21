import { useState } from "react";
import {
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentCard from "./PaymentCard";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import LinkIcon from "@mui/icons-material/Link";
import type { Payment, PaymentStatus } from "../data/dummyPayments";
import EntityActionsMenu from "../../../components/EntityActionsMenu";
import { GenericTable } from "../../../components/GenericTable";

const statusColors: Record<PaymentStatus, { bg: string; color: string }> = {
  pending: { bg: "rgba(245, 158, 11, 0.2)", color: "#F59E0B" },
  authorized: { bg: "rgba(59, 130, 246, 0.2)", color: "#3b82f6" },
  paid: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
  failed: { bg: "rgba(239, 68, 68, 0.2)", color: "#EF4444" },
  refunded: { bg: "rgba(255,255,255,0.08)", color: "rgba(255,255,255,0.7)" },
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


  const columns = [
    {
      key: "bookingId",
      label: "Booking ID",
      render: (p: Payment) => <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
        {p.bookingId}
      </Typography>,
    },
    {
      key: "clientName",
      label: "Client",
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.primary" }}>
        {p.clientName}
      </Typography>
    },
    {
      key: "route",
      label: "Route",
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {p.route}
      </Typography>
    },
    {
      key: "amount",
      label: "Amount",
      render: (p: Payment) => <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
        £{p.amount.toFixed(2)}
      </Typography>
    },
    {
      key: "paymentStatus",
      label: "Payment Status",
      render: (p: Payment) => <Chip
        label={p.paymentStatus}
        size="small"
        sx={{
          bgcolor: statusColors[p.paymentStatus].bg,
          color: statusColors[p.paymentStatus].color,
          fontWeight: 700,
          fontSize: "0.7rem",
          textTransform: "capitalize",
        }}
      />
    },
    {
      key: "paymentMethod",
      label: "Payment Method",
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.primary" }}>
        {p.paymentMethod}
        {p.cardLast4 ? ` ****${p.cardLast4}` : ""}
      </Typography>
    },
    {
      key: "date",
      label: "Date",
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {p.date}
      </Typography>
    },


  ];

  return (
    <>

      <GenericTable
        title="Payments"
        columns={columns}
        data={payments}
        actions={openMenu}
        onRowClick={onPaymentClick}
        withPagination={{
          pageSize: 6,
        }}
        renderMobileCard={(p) => (
          <PaymentCard
            key={p.id}
            payment={p}
            onView={onPaymentClick ? () => onPaymentClick(p) : undefined}
            onOpenMenu={(e) => openMenu(e, p)}
          />
        )}
      />
      <EntityActionsMenu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
        menuPaperSx={{ minWidth: 200, borderRadius: 2 }}
        actions={[
          {
            label: "Capture payment",
            icon: <CreditCardIcon fontSize="small" />,
            disabled: selectedPayment?.paymentStatus !== "authorized",
            onClick: () => handleCapture(),
          },
          {
            label: "Refund payment",
            icon: <MoneyOffIcon fontSize="small" />,
            disabled: selectedPayment?.paymentStatus !== "paid",
            onClick: () => handleRefund(),
          },
          {
            label: "Resend payment link",
            icon: <LinkIcon fontSize="small" />,
            disabled: selectedPayment?.paymentStatus !== "pending",
            onClick: () => handleResendLink(),
          },
        ]}
      />
    </>
  );
}
