import { Box, Typography, Button } from "@mui/material";
import type { EventClickArg } from "@fullcalendar/core";
import { bookingRouteLabel, type Booking, type BookingStatus } from "../data/dummyBookings";
import { STATUS_LABELS } from "../constants";
import { formatEventTime } from "../utils/utils";
import { parseDurationToMinutes, addMinutesToTime } from "../../../utils/dateUtils";
import BaseModal from "../../../../../components/BaseModal";
import { bookingContent } from "../../../../../content/booking";

type BookingDetailModalProps = {
  open: boolean;
  selectedEvent?: EventClickArg | null;
  /** Альтернатива selectedEvent — показувати деталі з об'єкта Booking (наприклад з мобільного списку) */
  booking?: Booking | null;
  onClose: () => void;
};

function formatDateFromBooking(b: Booking): string {
  const [y, m, d] = b.date.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  return date.toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function BookingDetailModal({
  open,
  selectedEvent = null,
  booking: bookingProp = null,
  onClose,
}: BookingDetailModalProps) {
  const fromEvent = selectedEvent != null;
  const fromBooking = bookingProp != null;
  const hasContent = fromEvent || fromBooking;

  const content = fromEvent
    ? (() => {
      const e = selectedEvent!.event;
      const start = e.start!;
      const end = e.end!;
      const clientName = (e.extendedProps?.clientName ?? e.title) as string;
      const ep = e.extendedProps as { from?: string; to?: string };
      const route = bookingRouteLabel({
        from: typeof ep.from === "string" ? ep.from : "",
        to: typeof ep.to === "string" ? ep.to : "",
      });
      const car = (e.extendedProps?.car ?? "—") as string;
      const status = (e.extendedProps?.status ?? "assigned") as BookingStatus;
      const duration = (e.extendedProps?.duration ?? "") as string;
      const dateStr = start.toLocaleDateString("fr-FR", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
      const timeStr = `${formatEventTime(start)} – ${formatEventTime(end)}`;
      return { dateStr, timeStr, duration, clientName, route, car, status };
    })()
    : fromBooking
      ? (() => {
        const b = bookingProp!;
        const endTime = addMinutesToTime(b.startTime, parseDurationToMinutes(b.duration));
        const timeStr = `${b.startTime} – ${endTime}`;
        return {
          dateStr: formatDateFromBooking(b),
          timeStr,
          duration: b.duration,
          clientName: b.clientName,
          route: bookingRouteLabel(b),
          car: b.car || "—",
          status: (b.status ?? "assigned") as BookingStatus,
        };
      })()
      : null;

  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="sm"
      disableAutoFocus
      title={
        <Typography component="span" variant="h6" sx={{ fontWeight: 700, fontSize: 18 }}>
          {bookingContent.detailModal.title}
        </Typography>
      }
      actions={
        <Button onClick={onClose} variant="contained" color="primary">
          {bookingContent.detailModal.close}
        </Button>
      }
    >
      {hasContent && content && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {bookingContent.detailModal.date}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {content.dateStr}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {bookingContent.detailModal.time}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {content.timeStr}
            </Typography>
          </Box>
          {content.duration && (
            <Box>
              <Typography variant="caption" color="text.secondary">
                {bookingContent.detailModal.duration}
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {content.duration}
              </Typography>
            </Box>
          )}
          <Box>
            <Typography variant="caption" color="text.secondary">
              {bookingContent.detailModal.client}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {content.clientName}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {bookingContent.detailModal.route}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {content.route}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {bookingContent.detailModal.vehicle}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {content.car}
            </Typography>
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              {bookingContent.detailModal.status}
            </Typography>
            <Typography variant="body1" fontWeight={600}>
              {STATUS_LABELS[content.status] ?? content.status}
            </Typography>
          </Box>
        </Box>
      )}
    </BaseModal>
  );
}
