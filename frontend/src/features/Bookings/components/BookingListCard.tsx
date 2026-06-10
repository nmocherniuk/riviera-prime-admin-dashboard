import { Box, Typography } from "@mui/material";
import { bookingRouteLabel, type Booking } from "./BookingsCalendar/data/dummyBookings";
import { colors } from "../../../theme/colors";
import { bookingContent } from "../../../content/booking";

type BookingListCardProps = {
  booking: Booking;
  onClick?: () => void;
};

export default function BookingListCard({ booking, onClick }: BookingListCardProps) {
  const isPending = booking.status === "pending";
  const isAssignedPaid = booking.status === "assigned" && booking.paymentStatus === "paid";
  const isAssignedUnpaid =
    booking.status === "assigned" && booking.paymentStatus !== "paid";
  const style = isAssignedPaid
    ? { borderColor: "#22C55E", accentColor: "#22C55E", bgColor: "rgba(34, 197, 94, 0.08)" }
    : isAssignedUnpaid
      ? { borderColor: "#F59E0B", accentColor: "#F59E0B", bgColor: "rgba(245, 158, 11, 0.08)" }
      : isPending
        ? { borderColor: "#9CA3AF", accentColor: "#9CA3AF", bgColor: "rgba(156, 163, 175, 0.08)" }
        : { borderColor: "#3B82F6", accentColor: "#3B82F6", bgColor: "rgba(59, 130, 246, 0.08)" };
  const statusLabel = isAssignedPaid
    ? bookingContent.tripState.confirmed
    : isAssignedUnpaid
      ? bookingContent.tripState.waitingForPayment
      : isPending
        ? bookingContent.tripState.awaitingDriverAction
        : booking.status ?? bookingContent.tripState.unknown;

  return (
    <Box
      component="button"
      type="button"
      onClick={onClick}
      sx={{
        width: "100%",
        textAlign: "left",
        border: "none",
        cursor: onClick ? "pointer" : "default",
        p: 0,
        m: 0,
        font: "inherit",
        color: "inherit",
        background: "none",
        display: "block",
        borderRadius: 2,
        overflow: "hidden",
        borderLeft: "3px solid",
        borderLeftColor: style.borderColor,
        bgcolor: style.bgColor,
        "&:hover": onClick ? { bgcolor: "rgba(255,255,255,0.1)" } : {},
      }}
    >
      <Box sx={{ p: 1.5, pl: 1.75, display: "flex", flexDirection: "column", gap: 0.5 }}>
        <Typography
          variant="caption"
          sx={{
            fontWeight: 700,
            color: "text.secondary",
            fontSize: "0.75rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {booking.car || "—"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            fontWeight: 700,
            color: colors.black,
            fontSize: "0.875rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {booking.clientName}
        </Typography>
        <Typography
          variant="caption"
          sx={{
            color: style.accentColor,
            fontSize: "0.7rem",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {bookingRouteLabel(booking)}
        </Typography>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            mt: 0.75,
            flexWrap: "wrap",
          }}
        >
          <Box
            sx={{
              px: 0.75,
              py: 0.25,
              borderRadius: 1,
              bgcolor: "rgba(255,255,255,0.08)",
              border: "1px solid",
              borderColor: style.borderColor,
            }}
          >
            <Typography
              variant="caption"
              sx={{
                fontSize: "0.65rem",
                fontWeight: 600,
                color: style.accentColor,
                textTransform: "uppercase",
                letterSpacing: "0.02em",
              }}
            >
              {statusLabel}
            </Typography>
          </Box>
          <Typography
            variant="caption"
            sx={{ fontWeight: 600, color: "text.secondary", fontSize: "0.75rem" }}
          >
            {booking.startTime} · {booking.duration}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
