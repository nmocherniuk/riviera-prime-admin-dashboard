import { Box, Container, Stack, Typography } from "@mui/material";
import BookingsHeader from "./components/BookingsHeader";
import WeekStrip from "./components/WeekStrip";
import { useBookingsDate } from "./BookingsDateContext";
import { useMemo, useState, useRef, useCallback } from "react";
import BookingStats from "./components/BookingStats";
import BookingsFilters from "./components/BookingsFilters";
import BookingsCalendar from "./components/BookingsCalendar";
import { toDateKey, getWeekStart, getDateLabel } from "./utils/dateUtils";
import {
  useBookingsList,
  useScrollSyncWeekStrip,
  useInfiniteScrollWeeks,
} from "./hooks";

export type BookingsViewMode = "day" | "week" | "month";

const INITIAL_WEEKS_AFTER = 4;

export default function BookingsPage() {
  const { selectedDate, setSelectedDate } = useBookingsDate();
  const [view, setView] = useState<BookingsViewMode>("week");
  const [weeksToShow, setWeeksToShow] = useState(INITIAL_WEEKS_AFTER);
  const [listAnchor, setListAnchor] = useState<Date>(() =>
    getWeekStart(new Date()),
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement>>({});

  const handleStripDateChange = useCallback(
    (date: Date) => {
      setSelectedDate(date);
      setListAnchor(getWeekStart(date));
    },
    [setSelectedDate],
  );

  const { allDates, bookingsByDate, todayKey } = useBookingsList({
    listAnchor,
    weeksToShow,
  });

  useScrollSyncWeekStrip({
    scrollRef,
    sectionRefs,
    allDates,
    selectedDate,
    setSelectedDate,
  });

  const loadMoreRef = useInfiniteScrollWeeks({
    scrollRef,
    setWeeksToShow,
    weeksToShow,
  });

  const stats = useMemo(
    () => [
      { label: "Total Bookings", value: "1,284" },
      { label: "Revenue (MTD)", value: "$84,250" },
      { label: "Pending", value: "42" },
      { label: "Active Drivers", value: "18 / 24" },
    ],
    [],
  );

  return (
    <Box sx={{ minHeight: "100%", pb: { xs: 2, md: 3 } }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 2, md: 3 }, display: { xs: "none", md: "block" } }}
      >
        <BookingsHeader />

        <Box sx={{ mt: 2 }}>
          <BookingStats items={stats} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <BookingsFilters />
        </Box>

        <Box sx={{ mt: 2 }}>
          <BookingsCalendar view={view} />
        </Box>
      </Container>

      <Box
        ref={scrollRef}
        sx={{
          overflowY: "auto",
          maxHeight: { xs: "calc(100vh - 180px)", md: "calc(100vh - 220px)" },
          px: { xs: 2, md: 3 },
          mt: 2,
          display: { xs: "block", md: "none" },
        }}
      >
        <Container maxWidth={false} sx={{ px: 0 }}>
          <Stack spacing={3}>
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
                        color: isToday ? "primary.main" : "background.paper",
                      }}
                    >
                      {shortDate}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      sx={{
                        color: isToday ? "primary.main" : "background.paper",
                        lineHeight: 2,
                      }}
                    >
                      {dayLabel}
                    </Typography>
                  </Stack>
                  {bookings.length === 0 ? (
                    <Typography variant="body2" sx={{ pl: 0.5 }}>
                      No bookings scheduled
                    </Typography>
                  ) : (
                    <Stack spacing={2}>
                      {bookings.map((b) => (
                        <Stack
                          key={b.id}
                          direction="row"
                          spacing={2}
                          alignItems="stretch"
                        >
                          <Stack
                            direction="column"
                            alignItems="flex-start"
                            justifyContent="center"
                            sx={{ minWidth: 60, flexShrink: 0 }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                fontWeight: 600,
                                color: "background.paper",
                              }}
                            >
                              {b.startTime}
                            </Typography>
                            <Typography variant="caption">
                              {b.duration}
                            </Typography>
                          </Stack>
                          <Box
                            sx={{
                              width: 2,
                              flexShrink: 0,
                              bgcolor: "primary.main",
                              borderRadius: 999,
                            }}
                          />
                          <Stack
                            direction="column"
                            spacing={0.5}
                            sx={{ flex: 1, minWidth: 0 }}
                          >
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, mb: 0.5 }}
                            >
                              {b.clientName}
                            </Typography>
                            <Typography variant="caption">{b.route}</Typography>
                          </Stack>
                        </Stack>
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
    </Box>
  );
}
