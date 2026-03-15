import { Box } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ScheduleIcon from "@mui/icons-material/Schedule";
import PeopleIcon from "@mui/icons-material/People";
import { useBookingsDate } from "./store/BookingsDateContext";
import { useMemo, useState, useRef, useEffect } from "react";
import BookingManagementModal from "./components/BookingManagementModal";
import BookingsDesktopView from "./components/BookingsDesktopView";
import BookingsMobileView from "./components/BookingsMobileView";
import { BookingDetailModal } from "./components/BookingsCalendar/components/BookingDetailModal";
import { toDateKey, getWeekStart } from "./utils/dateUtils";
import { filterBookings } from "./utils/filterBookings";
import type { Booking } from "./components/BookingsCalendar/data/dummyBookings";
import { DUMMY_BOOKINGS } from "./components/BookingsCalendar/data/dummyBookings";
import {
  useBookingsList,
  useBookingsFilters,
  useScrollSyncWeekStrip,
  useInfiniteScrollWeeks,
} from "./hooks";

export type BookingsViewMode = "day" | "week" | "month";

const INITIAL_WEEKS_AFTER = 4;

export default function BookingsPage() {
  const { selectedDate, setSelectedDate, registerScrollToDate } = useBookingsDate();
  const [bookingModal, setBookingModal] = useState<{ open: boolean; booking: Booking | null }>({
    open: false,
    booking: null,
  });
  const [selectedBookingDetail, setSelectedBookingDetail] = useState<Booking | null>(null);
  const [weeksToShow, setWeeksToShow] = useState(INITIAL_WEEKS_AFTER);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});


  const { filters, setFilter } = useBookingsFilters();
  const filteredBookings = useMemo(
    () => filterBookings(DUMMY_BOOKINGS, filters),
    [filters],
  );

  const { allDates, bookingsByDate, todayKey } = useBookingsList({
    listAnchor: getWeekStart(new Date()),
    weeksToShow,
    bookings: filteredBookings,
  });

  useScrollSyncWeekStrip({
    scrollRef,
    sectionRefs,
    allDates,
    selectedDate,
    setSelectedDate,
  });

  useEffect(() => {
    registerScrollToDate((date: Date) => {
      const key = toDateKey(date);
      const el = sectionRefs.current[key];
      const container = scrollRef.current;
      if (!el || !container) return;
      const elRect = el.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const offsetFromContentTop = elRect.top - containerRect.top + container.scrollTop;
      container.scrollTo({ top: offsetFromContentTop - 23, behavior: "smooth" });
    });
  }, [registerScrollToDate]);

  const loadMoreRef = useInfiniteScrollWeeks({
    scrollRef,
    setWeeksToShow,
    weeksToShow,
  });

  const stats = useMemo(
    () => [
      { label: "Total Bookings", value: "1,284", icon: EventIcon },
      { label: "Pending", value: "42", icon: ScheduleIcon },
      { label: "Active Drivers", value: "18 / 24", icon: PeopleIcon },
    ],
    [],
  );

  return (
    <Box sx={{ minHeight: "100%", pb: { xs: 2, md: 3 } }}>
      <BookingsDesktopView
        stats={stats}
        filters={filters}
        onFilterChange={setFilter}
        filteredBookings={filteredBookings}
        onNewBooking={() => setBookingModal({ open: true, booking: null })}
      />

      <BookingsMobileView
        scrollRef={scrollRef}
        sectionRefs={sectionRefs}
        loadMoreRef={loadMoreRef}
        allDates={allDates}
        bookingsByDate={bookingsByDate}
        todayKey={todayKey}
        stats={stats}
        filters={filters}
        onFilterChange={setFilter}
        onNewBooking={() => setBookingModal({ open: true, booking: null })}
        onBookingClick={setSelectedBookingDetail}
      />

      <BookingDetailModal
        open={!!selectedBookingDetail}
        booking={selectedBookingDetail}
        onClose={() => setSelectedBookingDetail(null)}
      />
      <BookingManagementModal
        open={bookingModal.open}
        onClose={() => setBookingModal({ open: false, booking: null })}
        booking={bookingModal.booking}
      />
    </Box>
  );
}
