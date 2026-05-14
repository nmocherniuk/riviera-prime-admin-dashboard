import { useState } from "react";
import {
  Typography,
} from "@mui/material";
import Chip from "@mui/material/Chip";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import PaymentCard from "./PaymentCard";
import MoneyOffIcon from "@mui/icons-material/MoneyOff";
import LinkIcon from "@mui/icons-material/Link";
import type { Payment, PaymentStatus } from "../../../api/payments";
import { formatMoney } from "../utils/formatMoney";
import EntityActionsMenu from "../../../components/EntityActionsMenu";
import { GenericTable } from "../../../components/GenericTable";
import { paymentStatusChipLabel, paymentsContent } from "../../../content/payments";

const statusColors: Record<PaymentStatus, { bg: string; color: string }> = {
  unpaid: { bg: "rgba(251, 191, 36, 0.25)", color: "#EAB308" },
  paid: { bg: "rgba(34, 197, 94, 0.2)", color: "#22c55e" },
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
      label: paymentsContent.table.columnBookingId,
      render: (p: Payment) => <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
        {p.bookingId}
      </Typography>,
    },
    {
      key: "clientName",
      label: paymentsContent.table.columnClient,
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.primary" }}>
        {p.clientName}
      </Typography>
    },
    {
      key: "route",
      label: paymentsContent.table.columnRoute,
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {p.route}
      </Typography>
    },
    {
      key: "amount",
      label: paymentsContent.table.columnAmount,
      render: (p: Payment) => <Typography variant="body2" sx={{ fontWeight: 600, color: "text.primary" }}>
        {formatMoney(p.amount, p.currency)}
      </Typography>
    },
    {
      key: "paymentStatus",
      label: paymentsContent.table.columnPaymentStatus,
      render: (p: Payment) => <Chip
        label={paymentStatusChipLabel(p.paymentStatus)}
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
      label: paymentsContent.table.columnPaymentMethod,
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.primary" }}>
        {p.paymentMethod}
        {p.paymentStatus === "paid" && p.cardLast4
          ? ` ****${p.cardLast4}`
          : ""}
      </Typography>
    },
    {
      key: "date",
      label: paymentsContent.table.columnDate,
      render: (p: Payment) => <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {p.date}
      </Typography>
    },


  ];

  return (
    <>

      <GenericTable
        title={paymentsContent.table.title}
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
            label: paymentsContent.rowMenu.capture,
            icon: <CreditCardIcon fontSize="small" />,
            disabled: selectedPayment?.stripeStatus !== "requires_capture",
            onClick: () => handleCapture(),
          },
          {
            label: paymentsContent.rowMenu.refund,
            icon: <MoneyOffIcon fontSize="small" />,
            disabled: selectedPayment?.paymentStatus !== "paid",
            onClick: () => handleRefund(),
          },
          {
            label: paymentsContent.rowMenu.resendLink,
            icon: <LinkIcon fontSize="small" />,
            disabled: selectedPayment?.paymentStatus !== "unpaid",
            onClick: () => handleResendLink(),
          },
        ]}
      />
    </>
  );
}
