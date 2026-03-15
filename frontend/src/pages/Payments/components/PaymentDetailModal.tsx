import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CloseIcon from "@mui/icons-material/Close";
import type { Payment } from "../data/dummyPayments";

type Props = {
  open: boolean;
  onClose: () => void;
  payment: Payment | null;
};

const sectionLabelSx = {
  fontWeight: 700,
  fontSize: "0.75rem",
  letterSpacing: 1,
  color: "text.secondary",
  textTransform: "uppercase" as const,
  mb: 1.5,
  mt: 2,
};

const valueBoxSx = {
  fontWeight: 600,
  color: "text.primary",
  py: 1.25,
  px: 1.5,
  borderRadius: 2,
  border: 1,
  borderColor: "divider",
  bgcolor: "rgba(255,255,255,0.04)",
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
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
          py: 1.5,
          px: { xs: 2, sm: 3 },
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AttachMoneyIcon sx={{ color: "text.secondary", fontSize: 20 }} />
          <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
            Payment — {payment.bookingId}
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ color: "text.secondary", "&:hover": { color: "text.primary" } }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 3 }, py: 2, overflowY: "auto" }}>
        <Typography sx={sectionLabelSx}>Client</Typography>
        <Typography variant="body1" sx={valueBoxSx}>
          {payment.clientName}
        </Typography>

        <Typography sx={sectionLabelSx}>Booking</Typography>
        <Typography variant="body1" sx={valueBoxSx}>
          {payment.bookingId}
        </Typography>

        <Typography sx={sectionLabelSx}>Trip route</Typography>
        <Typography variant="body1" sx={valueBoxSx}>
          {payment.route}
        </Typography>

        <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mt: 0 }}>
          <Box>
            <Typography sx={sectionLabelSx}>Vehicle</Typography>
            <Typography variant="body1" sx={valueBoxSx}>
              {payment.vehicle ?? "—"}
            </Typography>
          </Box>
          <Box>
            <Typography sx={sectionLabelSx}>Driver</Typography>
            <Typography variant="body1" sx={valueBoxSx}>
              {payment.driverName ?? "—"}
            </Typography>
          </Box>
        </Box>

        <Typography sx={sectionLabelSx}>Amount</Typography>
        <Typography variant="body1" sx={valueBoxSx}>
          £{payment.amount.toFixed(2)}
        </Typography>

        <Typography sx={sectionLabelSx}>Stripe payment status</Typography>
        <Typography variant="body1" sx={valueBoxSx}>
          {payment.stripeStatus ?? payment.paymentStatus}
        </Typography>

        <Typography sx={sectionLabelSx}>Payment method</Typography>
        <Typography variant="body1" sx={valueBoxSx}>
          {payment.paymentMethod}
          {payment.cardLast4 ? ` •••• ${payment.cardLast4}` : ""}
        </Typography>

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
