import { Typography, Box } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import type { Payment } from "../../../api/payments";
import { formatMoney } from "../utils/formatMoney";
import { sectionLabelSx } from "../../../components/ui/modalStyles";
import DetailField from "../../../components/DetailField";
import BaseModal from "../../../components/BaseModal";
import { paymentsContent } from "../../../content/payments";

const dm = paymentsContent.detailModal;

type Props = {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
};

export default function PaymentDetailModal({
  open,
  onClose,
  payment,
}: Props) {
  if (!payment) return null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      title={
        <>
          <AttachMoneyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography
            component="span"
            variant="h6"
            sx={{ fontWeight: 700, color: "text.primary" }}
          >
            {dm.titlePrefix}
            {payment.bookingId}
          </Typography>
        </>
      }
    >
      <DetailField
        label={dm.client}
        value={payment.clientName}
        emptyAsDash={false}
      />
      <DetailField
        label={dm.booking}
        value={payment.bookingId}
        emptyAsDash={false}
      />
      <DetailField
        label={dm.tripRoute}
        value={payment.route}
        emptyAsDash={false}
      />

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 0 }}>
        <DetailField label={dm.vehicle} value={payment.vehicle} />
        <DetailField label={dm.driver} value={payment.driverName} />
      </Box>

      <DetailField
        label={dm.amountCharged}
        value={formatMoney(payment.amount, payment.currency)}
        emptyAsDash={false}
      />
      {payment.customerPrice != null ? (
        <DetailField
          label={dm.customerPriceSnapshot}
          value={formatMoney(payment.customerPrice, payment.currency)}
        />
      ) : null}
      {payment.partnerPayout != null ? (
        <DetailField
          label={dm.partnerPayoutSnapshot}
          value={formatMoney(payment.partnerPayout, payment.currency)}
        />
      ) : null}
      {payment.platformMargin != null ? (
        <DetailField
          label={dm.platformMarginSnapshot}
          value={formatMoney(payment.platformMargin, payment.currency)}
        />
      ) : null}
      <DetailField
        label={dm.stripePaymentIntent}
        value={payment.stripePaymentIntentId ?? "—"}
        emptyAsDash={false}
      />
      <DetailField
        label={dm.stripePaymentStatus}
        value={payment.stripeStatus ?? payment.paymentStatus}
        emptyAsDash={false}
      />
      <DetailField
        label={dm.paymentMethod}
        value={`${payment.paymentMethod}${payment.cardLast4 ? ` •••• ${payment.cardLast4}` : ""}`}
        emptyAsDash={false}
      />

      {payment.timeline && payment.timeline.length > 0 && (
        <>
          <Typography sx={sectionLabelSx}>{dm.timeline}</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            {payment.timeline.map((item, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  py: 1,
                  px: 1.5,
                  borderRadius: 2,
                  border: 1,
                  borderColor: "divider",
                  bgcolor: "rgba(255,255,255,0.02)",
                }}
              >
                <Typography variant="body2" sx={{ color: "text.primary" }}>
                  {item.label}
                </Typography>
                <Typography variant="caption" sx={{ color: "text.secondary" }}>
                  {new Date(item.date).toLocaleString()}
                </Typography>
              </Box>
            ))}
          </Box>
        </>
      )}
    </BaseModal>
  );
}
