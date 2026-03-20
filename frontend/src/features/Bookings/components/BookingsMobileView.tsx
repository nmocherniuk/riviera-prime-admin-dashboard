import { Box, Container, Stack, Typography } from "@mui/material";
import BookingsHeader from "./BookingsHeader";
import BookingStats from "./BookingStats";
import BookingsFilters from "./BookingsFilters";
import BookingListCard from "./BookingListCard";
import { toDateKey, getDateLabel } from "../utils/dateUtils";
import type { Booking } from "./BookingsCalendar/data/dummyBookings";
import type { BookingsFilterState } from "../constants/filters";
import { colors } from "../../../theme/colors";

type Stat = { label: string; value: string };

type BookingsMobileViewProps = {
  scrollRef: React.RefObject<HTMLDivElement | null>;
  sectionRefs: React.MutableRefObject<Record<string, HTMLElement>>;
  loadMoreRef: React.RefObject<HTMLDivElement | null>;
  allDates: Date[];
  bookingsByDate: Record<string, Booking[]>;
  todayKey: string;
  stats: Stat[];
  filters: BookingsFilterState;
  onFilterChange: <K extends keyof BookingsFilterState>(
    key: K,
    value: BookingsFilterState[K]
  ) => void;
  onNewBooking: () => void;
  onBookingClick: (booking: Booking) => void;
};

export default function BookingsMobileView({
  scrollRef,
  sectionRefs,
  loadMoreRef,
  allDates,
  bookingsByDate,
  todayKey,
  stats,
  filters,
  onFilterChange,
  onNewBooking,
  onBookingClick,
}: BookingsMobileViewProps) {
  return (
    <Box
      ref={scrollRef}
      sx={{
        overflowY: "auto",
        WebkitOverflowScrolling: "touch",
        height: { xs: "calc(100vh - 120px)", md: "auto" },
        minHeight: { xs: 0, md: "auto" },
        px: { xs: 2, md: 3 },
        display: { xs: "block", md: "none" },
      }}
    >
      <Container maxWidth={false} sx={{ px: 0, pb: 3 }}>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <BookingsHeader onNewBooking={onNewBooking} />
          <BookingStats items={stats} />
          <BookingsFilters filters={filters} onFilterChange={onFilterChange} />
        </Stack>
        <Stack spacing={3} sx={{ mt: 2.5 }}>
          {allDates.map((date) => {
            const key = toDateKey(date);
            const bookings = bookingsByDate[key] ?? [];
            const shortDate = date.toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
            });
            const dayLabel = getDateLabel(date, todayKey);
            const isToday = key === todayKey;

            return (
              <Box
                key={key}
                ref={(el) => {
                  if (el) sectionRefs.current[key] = el as HTMLElement;
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{
                    mb: 1.5,
                    ...(isToday && { color: "primary.main" }),
                  }}
                >
                  <Typography
                    variant="h6"
                    component="h3"
                    sx={{
                      fontWeight: 700,
                      color: isToday ? "primary.main" : colors.black,
                    }}
                  >
                    {shortDate}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    sx={{
                      color: isToday ? "primary.main" : "text.secondary",
                      lineHeight: 2,
                    }}
                  >
                    {dayLabel}
                  </Typography>
                </Stack>
                {bookings.length === 0 ? (
                  <Typography variant="body2" color="text.secondary" sx={{ pl: 0.5 }}>
                    Немає бронювань
                  </Typography>
                ) : (
                  <Stack spacing={1.5}>
                    {bookings.map((b) => (
                      <BookingListCard
                        key={b.id}
                        booking={b}
                        onClick={() => onBookingClick(b)}
                      />
                    ))}
                  </Stack>
                )}
              </Box>
            );
          })}
          <Box
            ref={loadMoreRef}
            sx={{ height: 1, minHeight: 24 }}
            aria-hidden
          />
        </Stack>
      </Container>
    </Box>
  );
}
