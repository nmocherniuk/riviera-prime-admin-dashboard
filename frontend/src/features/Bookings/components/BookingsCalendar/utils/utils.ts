import { alpha, type SxProps } from "@mui/material/styles";
import { theme } from "../../../../../theme/theme";
import type { Booking } from "../data/dummyBookings";
import {
  parseDurationToMinutes,
  addMinutesToTime,
} from "../../../utils/dateUtils";

export function formatEventTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function bookingToCalendarEvent(b: Booking) {
  const minutes = parseDurationToMinutes(b.duration);
  const endTime = addMinutesToTime(b.startTime, minutes);
  const start = `${b.date}T${b.startTime}:00`;
  const end = `${b.date}T${endTime}:00`;
  return {
    id: b.id,
    title: `${b.clientName} · ${b.route}`,
    start,
    end,
    extendedProps: {
      clientName: b.clientName,
      route: b.route,
      car: b.car,
      status: b.status ?? "assigned",
      duration: b.duration,
    },
  };
}

export function getCalendarSx(): SxProps {
  return {
    "& .fc": {
      fontFamily: "Manrope, sans-serif",
      "--fc-border-color": "rgba(255,255,255,0.08)",
    },
    "& .fc .fc-toolbar": {
      p: 2,
      m: 0,
    },
    "& .fc .fc-col-header ": {
      bgcolor: "background.paper",
    },
    "& .fc .fc-col-header-cell-cushion": {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 0.5,
      color: theme.palette.text.primary,
      fontWeight: 300,
      py: 1,
      width: "100%",
      flexGrow: 1,
    },
    "& .fc .fc-scrollgrid-section-sticky > *": {
      backgroundColor: "rgba(255,255,255,0.04)",
    },
    "& .fc .fc-day-header-weekday": {
      fontSize: 12,
      fontWeight: 700,
      color: theme.palette.text.secondary,
    },
    "& .fc .fc-day-header-day": {
      fontSize: 16,
      fontWeight: 800,
      color: theme.palette.text.primary,
    },
    "& .fc .fc-scrollgrid-shrink-cushion": {
      width: "70px",
      textAlign: "center",
      color: theme.palette.text.secondary,
      fontSize: 12,
      fontWeight: 700,
    },
    "& .fc .fc-toolbar-title": {
      fontSize: 14,
      fontWeight: 800,
      color: theme.palette.text.primary,
    },
    "& .fc .fc-button": {
      border: 0,
      boxShadow: "none",
      backgroundColor: "rgba(255,255,255,0.08)",
      color: theme.palette.text.primary,
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
      borderRight: "1px solid rgba(255,255,255,0.2)",
      borderBottom: "1px solid rgba(255,255,255,0.08)",
    },
    "& .fc .fc-col-header-cell:last-of-type": {
      borderRight: 0,
    },
    "& .fc .fc-timegrid-col": {
      borderRight: "1px solid rgba(255,255,255,0.2)",
    },
    "& .fc .fc-timegrid-col:last-of-type": {
      borderRight: 0,
    },
    "& .fc .fc-timegrid-axis": {
      borderRight: "1px solid rgba(255,255,255,0.08)",
    },
    "& .fc .fc-event": {
      border: 0,
      outline: "none",
      boxShadow: "none",
      borderRadius: 2,
      padding: 0,
      backgroundColor: "transparent",
      overflow: "visible",
    },
    "& .fc .fc-event:focus": {
      outline: "none",
      boxShadow: "none",
    },
    "& .fc .fc-event.fc-event-selected": {
      outline: "none",
      boxShadow: "none",
    },
    "& .fc .fc-event *": {
      outline: "none",
    },
    "& .fc .fc-event .fc-event-main": {
      overflow: "visible",
      height: "100%",
      minHeight: "100%",
    },
    "& .fc .fc-timegrid-event-harness": {
      minHeight: 120,
    },
    "& .fc .fc-timegrid-col.fc-day-today ": {
      backgroundColor: alpha(theme.palette.primary.main, 0.07),
    },
    "& .fc .fc-daygrid-day.fc-day-today": {
      backgroundColor: alpha(theme.palette.primary.main, 0.07),
    }
  };
}
