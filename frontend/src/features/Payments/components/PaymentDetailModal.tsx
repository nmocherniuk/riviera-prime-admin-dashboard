import {
  Dialog,
  DialogContent,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import type { Payment } from "../data/dummyPayments";
import { sectionLabelSx } from "../../../components/ui/modalStyles";
import DetailField from "../../../components/DetailField";
import ModalTitleBar from "../../../components/ModalTitleBar";

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
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("sm"));

  if (!payment) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullScreen={fullScreen}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        sx: {
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
          borderRadius: fullScreen ? 0 : 3,
          maxHeight: fullScreen ? "100%" : "90vh",
        },
      }}
    >
      <ModalTitleBar
        title={
          <>
            <AttachMoneyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
              Payment — {payment.bookingId}
            </Typography>
          </>
        }
        onClose={onClose}
      />

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2, overflowY: "auto" }}>
        <DetailField label="Client" value={payment.clientName} emptyAsDash={false} />
        <DetailField label="Booking" value={payment.bookingId} emptyAsDash={false} />
        <DetailField label="Trip route" value={payment.route} emptyAsDash={false} />

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 0 }}>
          <DetailField label="Vehicle" value={payment.vehicle} />
          <DetailField label="Driver" value={payment.driverName} />
        </Box>

        <DetailField label="Amount" value={`£${payment.amount.toFixed(2)}`} emptyAsDash={false} />
        <DetailField label="Stripe payment status" value={payment.stripeStatus ?? payment.paymentStatus} emptyAsDash={false} />
        <DetailField
          label="Payment method"
          value={`${payment.paymentMethod}${payment.cardLast4 ? ` •••• ${payment.cardLast4}` : ""}`}
          emptyAsDash={false}
        />

        {payment.timeline && payment.timeline.length > 0 && (
          <>
            <Typography sx={sectionLabelSx}>Payment timeline</Typography>
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
      </DialogContent>
    </Dialog>
  );
}
