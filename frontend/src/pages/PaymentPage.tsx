import { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Divider,
  Chip,
  Button,
  createTheme,
  ThemeProvider,
} from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import DirectionsCarIcon from "@mui/icons-material/DirectionsCar";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TimerIcon from "@mui/icons-material/Timer";
import axios from "axios";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#D4AF35" },
    background: { default: "#f5f5f4", paper: "#ffffff" },
  },
  typography: { fontFamily: "Manrope, sans-serif" },
});

const API = import.meta.env.VITE_API_URL ?? "http://localhost:5000/api";

const stripePromise = loadStripe(
  import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY ?? "",
);

type BookingData = {
  id: string;
  clientName: string;
  from: string;
  to: string;
  bookingAt: string;
  durationMin: number;
  vehicleName: string | null;
  vehicleClass: string | null;
  status: string;
  paymentStatus: string;
  price: number;
  totalPrice: number;
};

type PageState =
  | { kind: "loading" }
  | { kind: "ready"; booking: BookingData; clientSecret: string }
  | { kind: "already_paid"; booking: BookingData }
  | { kind: "success" }
  | { kind: "error"; message: string };

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Paris",
  });
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Europe/Paris",
  });
}

export default function PaymentPage() {
  const { token } = useParams<{ token: string }>();
  const [state, setState] = useState<PageState>({ kind: "loading" });

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("redirect_status") === "succeeded") {
      setState({ kind: "success" });
      return;
    }

    if (!token) {
      setState({ kind: "error", message: "Invalid payment link" });
      return;
    }

    (async () => {
      try {
        const { data } = await axios.get<{ booking: BookingData }>(
          `${API}/public/pay/${token}`,
        );
        const booking = data.booking;

        const { data: intentData } = await axios.post<{
          clientSecret: string;
        }>(`${API}/public/pay/${token}/create-intent`);

        setState({ kind: "ready", booking, clientSecret: intentData.clientSecret });
      } catch (err) {
        const status = (err as { response?: { status?: number; data?: { booking?: BookingData; message?: string } } })
          ?.response?.status;
        const responseData = (err as { response?: { data?: { booking?: BookingData } } })
          ?.response?.data;

        if (status === 409 && responseData?.booking) {
          setState({ kind: "already_paid", booking: responseData.booking });
        } else if (status === 403) {
          setState({
            kind: "error",
            message: "This payment link has expired or is invalid.",
          });
        } else {
          setState({
            kind: "error",
            message: "Something went wrong. Please try again later.",
          });
        }
      }
    })();
  }, [token]);

  return (
    <ThemeProvider theme={lightTheme}>
      <Box
        sx={{
          minHeight: "100vh",
          bgcolor: "#f5f5f4",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          pt: { xs: 4, md: 8 },
          px: 2,
          pb: 4,
        }}
      >
        <Box sx={{ mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontWeight: 800,
              letterSpacing: 2,
              color: "#141414",
            }}
          >
            <span style={{ color: "#D4AF35" }}>AUREVIA</span>
          </Typography>
        </Box>

        {state.kind === "loading" && (
          <Box sx={{ textAlign: "center", mt: 8 }}>
            <CircularProgress sx={{ color: "#D4AF35" }} />
            <Typography sx={{ mt: 2, color: "#888" }}>
              Verifying your payment link...
            </Typography>
          </Box>
        )}

        {state.kind === "error" && (
          <Paper
            elevation={0}
            sx={{
              maxWidth: 480,
              width: "100%",
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <ErrorOutlineIcon
              sx={{ fontSize: 56, color: "#EF4444", mb: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Access denied
            </Typography>
            <Typography sx={{ color: "#666" }}>{state.message}</Typography>
          </Paper>
        )}

        {(state.kind === "already_paid" || state.kind === "success") && (
          <Paper
            elevation={0}
            sx={{
              maxWidth: 480,
              width: "100%",
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <CheckCircleOutlineIcon
              sx={{ fontSize: 56, color: "#22C55E", mb: 2 }}
            />
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              {state.kind === "success" ? "Payment successful!" : "Already paid"}
            </Typography>
            <Typography sx={{ color: "#666" }}>
              {state.kind === "success" ? (
                "Thank you! Your trip has been confirmed."
              ) : (
                <>
                  Your trip{" "}
                  <strong>
                    {state.booking.from} → {state.booking.to}
                  </strong>{" "}
                  has been paid. Thank you!
                </>
              )}
            </Typography>
          </Paper>
        )}

        {state.kind === "ready" && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret: state.clientSecret,
              appearance: {
                theme: "stripe",
                variables: { colorPrimary: "#D4AF35" },
              },
            }}
          >
            <BookingPayment booking={state.booking} token={token!} />
          </Elements>
        )}
      </Box>
    </ThemeProvider>
  );
}

function CheckoutForm({
  booking,
  token,
}: {
  booking: BookingData;
  token: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [succeeded, setSucceeded] = useState(false);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!stripe || !elements) return;

      setProcessing(true);
      setError(null);

      const result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/pay/${token}`,
        },
        redirect: "if_required",
      });

      if (result.error) {
        setError(result.error.message ?? "Payment failed");
        setProcessing(false);
        return;
      }

      if (result.paymentIntent?.status === "succeeded") {
        setSucceeded(true);
      }
    },
    [stripe, elements, token],
  );

  if (succeeded) {
    return (
      <Box sx={{ textAlign: "center", py: 2 }}>
        <CheckCircleOutlineIcon
          sx={{ fontSize: 48, color: "#22C55E", mb: 1 }}
        />
        <Typography sx={{ fontWeight: 700 }}>Payment successful!</Typography>
        <Typography sx={{ color: "#666", mt: 0.5 }}>
          Your trip has been confirmed. Thank you!
        </Typography>
      </Box>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement />
      {error && (
        <Typography
          sx={{ color: "#EF4444", mt: 2, fontSize: 14, textAlign: "center" }}
        >
          {error}
        </Typography>
      )}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={!stripe || processing}
        sx={{
          mt: 3,
          bgcolor: "#D4AF35",
          color: "#141414",
          fontWeight: 700,
          fontSize: 16,
          py: 1.5,
          borderRadius: 2,
          "&:hover": { bgcolor: "#c5a030" },
          "&.Mui-disabled": {
            bgcolor: "#D4AF35",
            color: "#141414",
            opacity: 0.6,
          },
        }}
      >
        {processing ? "Processing…" : `Pay €${booking.totalPrice.toFixed(2)}`}
      </Button>
    </form>
  );
}

function BookingPayment({
  booking,
  token,
}: {
  booking: BookingData;
  token: string;
}) {
  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 520,
        width: "100%",
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
      <Box sx={{ bgcolor: "#141414", px: 3, py: 2.5 }}>
        <Typography
          sx={{ color: "#fff", fontWeight: 700, fontSize: 18 }}
        >
          Complete your reservation
        </Typography>
        <Typography sx={{ color: "#aaa", fontSize: 14, mt: 0.5 }}>
          Hello {booking.clientName}, please review and pay to confirm.
        </Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <InfoRow
            icon={<DirectionsCarIcon sx={{ color: "#D4AF35" }} />}
            label="Route"
            value={`${booking.from} → ${booking.to}`}
          />
          <InfoRow
            icon={<CalendarTodayIcon sx={{ color: "#D4AF35" }} />}
            label="Date & Time"
            value={`${formatDate(booking.bookingAt)} at ${formatTime(booking.bookingAt)}`}
          />
          <InfoRow
            icon={<TimerIcon sx={{ color: "#D4AF35" }} />}
            label="Duration"
            value={`${booking.durationMin} min`}
          />
          {booking.vehicleName && (
            <InfoRow
              icon={<DirectionsCarIcon sx={{ color: "#D4AF35" }} />}
              label="Vehicle"
              value={`${booking.vehicleName}${booking.vehicleClass ? ` (${booking.vehicleClass})` : ""}`}
            />
          )}
        </Box>

        <Divider sx={{ my: 3 }} />

        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography sx={{ fontWeight: 600, fontSize: 16 }}>
            Total
          </Typography>
          <Chip
            label={`€${booking.totalPrice.toFixed(2)}`}
            sx={{
              bgcolor: "#141414",
              color: "#D4AF35",
              fontWeight: 700,
              fontSize: 18,
              height: 40,
              px: 1,
            }}
          />
        </Box>

        <CheckoutForm booking={booking} token={token} />
      </Box>
    </Paper>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
      {icon}
      <Box>
        <Typography sx={{ color: "#999", fontSize: 12 }}>{label}</Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 14, color: "#333" }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}
