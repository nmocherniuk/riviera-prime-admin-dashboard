import { Box, Paper } from "@mui/material";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import type { EventClickArg } from "@fullcalendar/core";
import { useMemo, useState, useRef, useEffect } from "react";
import { DUMMY_BOOKINGS } from "./data/dummyBookings";
import type { Booking } from "./data/dummyBookings";
import { CustomEventCard } from "./components/CustomEventCard";
import { DayHeaderContent } from "./components/DayHeaderContent";
import { BookingDetailModal } from "./components/BookingDetailModal";
import { bookingToCalendarEvent, getCalendarSx } from "./utils/utils";
import { commonContent } from "../../../../content/common";
import { bookingContent } from "../../../../content/booking";

type Props = {
  bookings?: Booking[];
};

export default function BookingsCalendar({ bookings: bookingsProp }: Props) {
  const [selectedEvent, setSelectedEvent] = useState<EventClickArg | null>(null);
  const scrollPositionRef = useRef({ x: 0, y: 0 });


  const initialDate = useMemo(() => new Date(), []);

  const events = useMemo(
    () => (bookingsProp ?? DUMMY_BOOKINGS).map(bookingToCalendarEvent),
    [bookingsProp]
  );

  const handleEventClick = (arg: EventClickArg) => {
    arg.jsEvent.preventDefault();
    scrollPositionRef.current = {
      x: window.scrollX,
      y: window.scrollY,
    };
    setSelectedEvent(arg);
  };

  const restoreScroll = () => {
    const { x, y } = scrollPositionRef.current;
    window.scrollTo(x, y);
  };

  useEffect(() => {
    if (selectedEvent) {
      requestAnimationFrame(restoreScroll);
      const t = setTimeout(restoreScroll, 0);
      return () => clearTimeout(t);
    }
  }, [selectedEvent]);

  const handleCloseDetailModal = () => {
    setSelectedEvent(null);
    requestAnimationFrame(restoreScroll);
    setTimeout(restoreScroll, 0);
  };

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
      <Box sx={getCalendarSx()}>
        <FullCalendar
          plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          initialDate={initialDate}
          headerToolbar={{
            left: "prev,next",
            center: "title",
            right: "timeGridDay,timeGridWeek,dayGridMonth",
          }}
          buttonText={{
            today: commonContent.calendar.today,
            day: bookingContent.calendarToolbar.day,
            week: bookingContent.calendarToolbar.week,
            month: bookingContent.calendarToolbar.month,
          }}
          titleFormat={{
            month: "long",
            day: "numeric",
            year: "numeric",
          }}
          titleRangeSeparator=" – "
          views={{
            timeGridWeek: {
              titleFormat: { month: "long", day: "numeric", year: "numeric" },
            },
            timeGridDay: {
              titleFormat: {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
              },
            },
            dayGridMonth: {
              titleFormat: { month: "long", year: "numeric" },
            },
          }}
          height="auto"
          allDaySlot={false}
          slotLabelFormat={{
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
            meridiem: "short",
          }}
          dayHeaderContent={(arg) => (
            <DayHeaderContent date={arg.date} isToday={!!arg.isToday} />
          )}
          dayHeaderClassNames={(arg) => (arg.isToday ? "fc-day-today" : "")}
          slotEventOverlap={false}
          eventMinHeight={110}
          eventClick={handleEventClick}
          eventContent={(arg) => <CustomEventCard arg={arg} />}
          nowIndicator
          editable={false}
          selectable
          events={events}
        />
      </Box>

      <BookingDetailModal
        open={!!selectedEvent}
        selectedEvent={selectedEvent}
        onClose={handleCloseDetailModal}
      />
    </Paper>
  );
}
