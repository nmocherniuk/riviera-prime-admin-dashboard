import { Box, Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import type { EventClickArg } from "@fullcalendar/core";
import type { Booking, BookingStatus } from "../data/dummyBookings";
import { STATUS_LABELS } from "../constants";
import { formatEventTime } from "../utils/utils";
import { parseDurationToMinutes, addMinutesToTime } from "../../../utils/dateUtils";

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
  return date.toLocaleDateString("uk-UA", {
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
        const route = (e.extendedProps?.route ?? "—") as string;
        const car = (e.extendedProps?.car ?? "—") as string;
        const status = (e.extendedProps?.status ?? "assigned") as BookingStatus;
        const duration = (e.extendedProps?.duration ?? "") as string;
        const dateStr = start.toLocaleDateString("uk-UA", {
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
            route: b.route || "—",
            car: b.car || "—",
            status: (b.status ?? "assigned") as BookingStatus,
          };
        })()
      : null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      disableAutoFocus
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          bgcolor: "background.paper",
          border: 1,
          borderColor: "divider",
        },
      }}
    >
      <DialogTitle sx={{ fontWeight: 700, fontSize: 18 }}>
        Деталі поїздки
      </DialogTitle>
      <DialogContent sx={{ "& > * + *": { mt: 2 } }}>
        {hasContent && content && (
          <>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Дата
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {content.dateStr}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Час
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {content.timeStr}
              </Typography>
            </Box>
            {content.duration && (
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Тривалість
                </Typography>
                <Typography variant="body1" fontWeight={600}>
                  {content.duration}
                </Typography>
              </Box>
            )}
            <Box>
              <Typography variant="caption" color="text.secondary">
                Клієнт
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {content.clientName}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Маршрут
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {content.route}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Авто
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {content.car}
              </Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">
                Статус
              </Typography>
              <Typography variant="body1" fontWeight={600}>
                {STATUS_LABELS[content.status] ?? content.status}
              </Typography>
            </Box>
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="contained" color="primary">
          Закрити
        </Button>
      </DialogActions>
    </Dialog>
  );
}
