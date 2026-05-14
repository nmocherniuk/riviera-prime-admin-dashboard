import { Box, Container } from "@mui/material";
import BookingsHeader from "./BookingsHeader";
import BookingStats from "./BookingStats";
import BookingsFilters from "./BookingsFilters";
import BookingsCalendar from "./BookingsCalendar/BookingsCalendar";
import BookingsTable from "./BookingsTable";
import type { Booking } from "./BookingsCalendar/data/dummyBookings";
import type { BookingsFilterState } from "../constants/filters";
import type { ComponentType } from "react";

type Stat = {
  key: string;
  label: string;
  value: string;
  icon: ComponentType<{ sx?: object }>;
};

type BookingsDesktopViewProps = {
  stats: Stat[];
  filters: BookingsFilterState;
  onFilterChange: <K extends keyof BookingsFilterState>(
    key: K,
    value: BookingsFilterState[K],
  ) => void;
  filteredBookings: Booking[];
  onNewBooking: () => void;
  activeTransfersToday: number;
};

export default function BookingsDesktopView({
  stats,
  filters,
  onFilterChange,
  filteredBookings,
  onNewBooking,
  activeTransfersToday,
}: BookingsDesktopViewProps) {
  return (
    <Container
      maxWidth={false}
      sx={{ px: { xs: 2, md: 3 }, display: { xs: "none", md: "block" } }}
    >
      <BookingsHeader
        onNewBooking={onNewBooking}
        activeTransfersToday={activeTransfersToday}
      />

      <Box sx={{ mt: 2 }}>
        <BookingStats items={stats} />
      </Box>

      <Box sx={{ mt: 2 }}>
        <BookingsFilters filters={filters} onFilterChange={onFilterChange} />
      </Box>

      {/* <Box sx={{ mt: 2 }}>
        <BookingsTable bookings={filteredBookings} />
      </Box> */}

      <Box sx={{ mt: 2 }}>
        <BookingsCalendar bookings={filteredBookings} />
      </Box>
    </Container>
  );
}
