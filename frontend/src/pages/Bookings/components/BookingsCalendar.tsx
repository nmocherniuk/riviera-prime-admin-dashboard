import { Box, Paper } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { BookingsViewMode } from "../BookingsPage";
import { useMemo } from "react";
import { DUMMY_BOOKINGS } from "../data/dummyBookings";
import type { Booking } from "../data/dummyBookings";
import {
  parseDurationToMinutes,
  addMinutesToTime,
} from "../utils/dateUtils";

type Props = {
  view: BookingsViewMode;
};

function bookingToCalendarEvent(b: Booking) {
  const minutes = parseDurationToMinutes(b.duration);
  const endTime = addMinutesToTime(b.startTime, minutes);
  const start = `${b.date}T${b.startTime}:00`;
  const end = `${b.date}T${endTime}:00`;
  return {
    id: b.id,
    title: `${b.clientName} · ${b.route}`,
    start,
    end,
  };
}

export default function BookingsCalendar({ view }: Props) {
  const initialView = useMemo(() => {
    if (view === "day") return "timeGridDay";
    if (view === "month") return "dayGridMonth";
    return "timeGridWeek";
  }, [view]);

  const events = useMemo(
    () => DUMMY_BOOKINGS.map(bookingToCalendarEvent),
    []
  );

  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
      }}
    >
      <Box
        sx={{
          "& .fc": {
            fontFamily: "Manrope, sans-serif",
          },
          "& .fc .fc-toolbar": {
            p: 2,
            m: 0,
          },
          "& .fc .fc-toolbar-title": {
            fontSize: 14,
            fontWeight: 800,
            color: "rgba(255,255,255,0.9)",
          },
          "& .fc .fc-button": {
            border: 0,
            boxShadow: "none",
            backgroundColor: "rgba(255,255,255,0.08)",
            color: "rgba(255,255,255,0.9)",
            borderRadius: 10,
          },
          "& .fc .fc-button:hover": {
            backgroundColor: "rgba(255,255,255,0.12)",
          },
          "& .fc .fc-button-primary:not(:disabled).fc-button-active": {
            backgroundColor: "#D4AF35",
            color: "#141414",
          },
          "& .fc .fc-scrollgrid": {
            borderColor: "rgba(255,255,255,0.08)",
          },
          "& .fc .fc-col-header-cell": {
            backgroundColor: "rgba(255,255,255,0.04)",
          },
          "& .fc .fc-timegrid-slot": {
            borderColor: "rgba(255,255,255,0.06)",
          },
          "& .fc .fc-event": {
            border: 0,
            borderRadius: 12,
            padding: "2px 6px",
            backgroundColor: "rgba(212,175,53,0.25)",
            color: "rgba(255,255,255,0.95)",
          },
        }}
      >
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView={initialView}
          initialDate="2025-03-12"
          headerToolbar={{
            left: "prev,next today",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth",
          }}
          height="auto"
          nowIndicator
          editable
          selectable
          events={events}
        />
      </Box>
    </Paper>
  );
}
