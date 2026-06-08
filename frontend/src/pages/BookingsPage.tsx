import { Box, CircularProgress } from "@mui/material";
import EventIcon from "@mui/icons-material/Event";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PeopleIcon from "@mui/icons-material/People";
import { useBookingsDate } from "../features/Bookings/store/BookingsDateContext";
import { useMemo, useState, useRef, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Alert from "@mui/material/Alert";
import BookingManagementModal from "../features/Bookings/components/BookingManagementModal";
import BookingsDesktopView from "../features/Bookings/components/BookingsDesktopView";
import BookingsMobileView from "../features/Bookings/components/BookingsMobileView";
import { BookingDetailModal } from "../features/Bookings/components/BookingsCalendar/components/BookingDetailModal";
import { toDateKey, getWeekStart } from "../features/Bookings/utils/dateUtils";
import { filterBookings } from "../features/Bookings/utils/filterBookings";
import type { Booking } from "../features/Bookings/components/BookingsCalendar/data/dummyBookings";
import {
  createBooking,
  deleteBooking,
  dtoToBooking,
  listBookings,
  updateBooking,
  type BookingDto,
  type CreateBookingBody,
  type PublicVehicleClass,
} from "../api/bookings";
import { queryKeys } from "../api/queryKeys";
import { bookingContent } from "../content/booking";
import type { BookingFormValues } from "../features/Bookings/components/BookingManagementModal";
import {
  useBookingsList,
  useBookingsFilters,
  useScrollSyncWeekStrip,
  useInfiniteScrollWeeks,
} from "../features/Bookings/hooks";
import { useToast } from "../providers/ToastProvider";
import { useModalFormErrors } from "../hooks/useModalFormErrors";

export type BookingsViewMode = "day" | "week" | "month";

const INITIAL_WEEKS_AFTER = 4;

export default function BookingsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();
  const {
    fieldErrors,
    clearFieldError,
    clearAllFieldErrors,
    applySubmitError,
  } = useModalFormErrors();
  const { selectedDate, setSelectedDate, registerScrollToDate } =
    useBookingsDate();
  const [bookingModal, setBookingModal] = useState<{
    open: boolean;
    booking: Booking | null;
  }>({
    open: false,
    booking: null,
  });
  const [selectedBookingDetail, setSelectedBookingDetail] =
    useState<Booking | null>(null);
  const [cancellingBookingId, setCancellingBookingId] = useState<string | null>(
    null,
  );
  const [weeksToShow, setWeeksToShow] = useState(INITIAL_WEEKS_AFTER);

  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  const {
    data: bookingRows = [],
    error: bookingsError,
    isPending: bookingsPending,
  } = useQuery<BookingDto[]>({
    queryKey: queryKeys.bookings.list(),
    queryFn: () => listBookings(),
  });

  const bookings = useMemo(() => bookingRows.map(dtoToBooking), [bookingRows]);

  const error =
    bookingsError instanceof Error
      ? bookingsError.message
      : bookingsError
        ? bookingContent.errors.loadBookings
        : null;

  const { filters, setFilter } = useBookingsFilters();
  const filteredBookings = useMemo(
    () => filterBookings(bookings, filters),
    [bookings, filters],
  );
  const sortedBookings = useMemo(() => {
    const rank = (b: Booking): number => {
      if (b.status === "assigned" && b.paymentStatus === "paid") return 0;
      if (b.status === "assigned" && b.paymentStatus === "unpaid") return 1;
      if (b.status === "pending") return 2;
      return 3;
    };
    return [...filteredBookings].sort((a, b) => rank(a) - rank(b));
  }, [filteredBookings]);

  const { allDates, bookingsByDate, todayKey } = useBookingsList({
    listAnchor: getWeekStart(new Date()),
    weeksToShow,
    bookings: sortedBookings,
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
      const offsetFromContentTop =
        elRect.top - containerRect.top + container.scrollTop;
      container.scrollTo({
        top: offsetFromContentTop - 23,
        behavior: "smooth",
      });
    });
  }, [registerScrollToDate]);

  const loadMoreRef = useInfiniteScrollWeeks({
    scrollRef,
    setWeeksToShow,
    weeksToShow,
  });

  const activeTransfersToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return bookings.filter(
      (booking: Booking) =>
        booking.date === today &&
        (booking.status === "pending" || booking.status === "assigned"),
    ).length;
  }, [bookings]);

  const stats = useMemo(
    () => [
      {
        key: "todaysBookings",
        label: bookingContent.stats.todaysBookings,
        value: String(
          bookings.filter(
            (booking: Booking) =>
              booking.date === new Date().toISOString().slice(0, 10),
          ).length,
        ),
        icon: EventIcon,
      },
      {
        key: "pending",
        label: bookingContent.stats.pending,
        value: String(
          bookings.filter((booking: Booking) => booking.status === "pending")
            .length,
        ),
        icon: ScheduleIcon,
      },
      {
        key: "completedToday",
        label: bookingContent.stats.completedToday,
        value: String(
          bookings.filter(
            (booking: Booking) =>
              booking.status === "completed" &&
              booking.date === new Date().toISOString().slice(0, 10),
          ).length,
        ),
        icon: CheckCircleIcon,
      },
      {
        key: "assignedDrivers",
        label: bookingContent.stats.assignedDrivers,
        value: String(
          bookings.filter((booking: Booking) => Boolean(booking.driverId))
            .length,
        ),
        icon: PeopleIcon,
      },
    ],
    [bookings],
  );

  const parseDurationToMinutes = (duration: string): number => {
    const source = duration.toLowerCase();
    const hoursMatch = source.match(/(\d+)\s*hr/);
    const minutesMatch = source.match(/(\d+)\s*min/);
    const hours = hoursMatch ? Number(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? Number(minutesMatch[1]) : 0;
    const total = hours * 60 + minutes;
    return total > 0 ? total : 60;
  };

  const handleCancelBooking = async (booking: Booking) => {
    try {
      setCancellingBookingId(booking.id);
      await deleteBooking(booking.id);
      await queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
      setSelectedBookingDetail(null);
      showToast({
        message: bookingContent.detailModal.cancelSuccess,
        severity: "success",
      });
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : bookingContent.detailModal.cancelError;
      showToast({ message: msg, severity: "error" });
      throw e;
    } finally {
      setCancellingBookingId(null);
    }
  };

  const handleSaveBooking = async (
    bookingId: string | null,
    values: BookingFormValues,
  ) => {
    try {
      clearAllFieldErrors();
    const bookingAt = new Date(
      `${values.date}T${values.startTime}:00`,
    ).toISOString();
    const vehicleId = values.vehicleId.trim();
    const vehicleClassRaw = values.vehicleClass.trim();
    const vehicleClass =
      vehicleClassRaw === "comfort" ||
      vehicleClassRaw === "business" ||
      vehicleClassRaw === "van"
        ? (vehicleClassRaw as PublicVehicleClass)
        : null;

    const body: CreateBookingBody = {
      clientName: values.clientName.trim(),
      driverId: values.driverId.trim() || null,
      bookingAt,
      from: values.from.trim(),
      to: values.to.trim(),
      durationMin: parseDurationToMinutes(values.duration),
      status: "pending" as const,
      paymentStatus: "unpaid" as const,
    };
    if (vehicleId) {
      body.vehicleId = vehicleId;
    } else if (vehicleClass) {
      body.vehicleClass = vehicleClass;
    }

    if (bookingId) {
      await updateBooking(bookingId, body);
    } else {
      await createBooking(body);
    }
    await queryClient.invalidateQueries({ queryKey: queryKeys.bookings.all });
    setBookingModal({ open: false, booking: null });
    } catch (e) {
      const msg = applySubmitError(e, bookingContent.errors.save);
      showToast({ message: msg, severity: "error" });
      throw e;
    }
  };

  return (
    <Box sx={{ minHeight: "100%", pb: { xs: 2, md: 3 } }}>
      {error ? (
        <Alert severity="error" sx={{ mx: { xs: 2, md: 3 }, mb: 2 }}>
          {error}
        </Alert>
      ) : null}
      {bookingsPending && bookingRows.length === 0 && !error ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            py: 4,
          }}
        >
          <CircularProgress />
        </Box>
      ) : null}
      <BookingsDesktopView
        stats={stats}
        filters={filters}
        onFilterChange={setFilter}
        filteredBookings={sortedBookings}
        onNewBooking={() => {
          clearAllFieldErrors();
          setBookingModal({ open: true, booking: null });
        }}
        onCancelBooking={handleCancelBooking}
        cancellingBookingId={cancellingBookingId}
        activeTransfersToday={activeTransfersToday}
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
        onNewBooking={() => {
          clearAllFieldErrors();
          setBookingModal({ open: true, booking: null });
        }}
        onBookingClick={setSelectedBookingDetail}
        activeTransfersToday={activeTransfersToday}
      />

      <BookingDetailModal
        open={!!selectedBookingDetail}
        booking={selectedBookingDetail}
        onClose={() => setSelectedBookingDetail(null)}
        onCancel={handleCancelBooking}
        cancelling={Boolean(
          selectedBookingDetail &&
            cancellingBookingId === selectedBookingDetail.id,
        )}
      />
      <BookingManagementModal
        open={bookingModal.open}
        onClose={() => {
          clearAllFieldErrors();
          setBookingModal({ open: false, booking: null });
        }}
        booking={bookingModal.booking}
        fieldErrors={fieldErrors}
        onClearFieldError={clearFieldError}
        onSave={handleSaveBooking}
      />
    </Box>
  );
}
