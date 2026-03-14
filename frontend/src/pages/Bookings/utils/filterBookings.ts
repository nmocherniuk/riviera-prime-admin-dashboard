import type { Booking } from "../components/BookingsCalendar/data/dummyBookings";
import type { BookingsFilterState } from "../constants/filters";
import { FILTER_ALL } from "../constants/filters";

const VEHICLE_VALUE_TO_MATCH: Record<string, string> = {
  bmw: "BMW 7 Series",
  mercedes: "Mercedes S-Class",
  audi: "Audi A8",
  range: "Range Rover",
};

function matchesSearch(b: Booking, search: string): boolean {
  if (!search.trim()) return true;
  const q = search.trim().toLowerCase();
  return (
    b.id.toLowerCase().includes(q) ||
    b.clientName.toLowerCase().includes(q) ||
    b.route.toLowerCase().includes(q)
  );
}

export function filterBookings(
  bookings: Booking[],
  filters: BookingsFilterState
): Booking[] {
  return bookings.filter((b) => {
    if (filters.status !== FILTER_ALL && (b.status ?? "") !== filters.status)
      return false;
    if (
      filters.driver !== FILTER_ALL &&
      (b.driverId ?? "") !== filters.driver
    )
      return false;
    if (filters.vehicle !== FILTER_ALL) {
      const matchCar = VEHICLE_VALUE_TO_MATCH[filters.vehicle];
      if (!matchCar || b.car !== matchCar) return false;
    }
    if (
      filters.payment !== FILTER_ALL &&
      (b.paymentStatus ?? "") !== filters.payment
    )
      return false;
    if (!matchesSearch(b, filters.search)) return false;
    return true;
  });
}
