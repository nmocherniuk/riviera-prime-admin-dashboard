import { Box, Typography } from "@mui/material";
import { bookingRouteLabel, type Booking, type BookingStatus } from "./BookingsCalendar/data/dummyBookings";
import {
  STATUS_STYLES,
  DEFAULT_STATUS_STYLE,
  STATUS_LABELS,
} from "./BookingsCalendar/constants";
import { colors } from "../../../theme/colors";

type BookingListCardProps = {
  booking: Booking;
  onClick?: () => void;
};

export default function BookingListCard({ booking, onClick }: BookingListCardProps) {
  const status = (booking.status ?? "assigned") as BookingStatus;
  const style = status && STATUS_STYLES[status] ? STATUS_STYLES[status] : DEFAULT_STATUS_STYLE;
  const statusLabel = STATUS_LABELS[status] ?? status;

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
