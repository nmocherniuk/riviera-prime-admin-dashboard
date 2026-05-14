import { useMemo } from "react";
import { toDateKey, getWeekStart, getWeekdayIndex } from "../utils/dateUtils";
import { DUMMY_BOOKINGS } from "../components/BookingsCalendar/data/dummyBookings";
import type { Booking } from "../components/BookingsCalendar/data/dummyBookings";

const WEEKS_BEFORE = 2;

export type UseBookingsListParams = {
  listAnchor: Date;
  weeksToShow: number;
  /** Якщо передано, використовується замість DUMMY_BOOKINGS (наприклад відфільтровані букінги) */
  bookings?: Booking[];
};

export type UseBookingsListResult = {
  allDates: Date[];
  bookingsByDate: Record<string, Booking[]>;
  todayKey: string;
};

export function useBookingsList({
  listAnchor,
  weeksToShow,
  bookings: bookingsSource,
}: UseBookingsListParams): UseBookingsListResult {
  return useMemo(() => {
    const source = bookingsSource ?? DUMMY_BOOKINGS;
    const weekStart = getWeekStart(listAnchor);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tKey = toDateKey(today);
    const startAnchor = new Date(weekStart);
    startAnchor.setDate(weekStart.getDate() - WEEKS_BEFORE * 7);
    const totalDays = (WEEKS_BEFORE + weeksToShow) * 7;
    const dates: Date[] = [];
    for (let i = 0; i < totalDays; i++) {
      const d = new Date(startAnchor);
      d.setDate(startAnchor.getDate() + i);
      dates.push(d);
    }

    const anchorWeekDays: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(weekStart);
      d.setDate(weekStart.getDate() + i);
      anchorWeekDays.push(d);
    }

    const bookingsForRange: Booking[] = source.map((b) => {
      const [y, m, day] = b.date.split("-").map(Number);
      const origDate = new Date(y, m - 1, day);
      const wd = getWeekdayIndex(origDate);
      const targetDate = anchorWeekDays[wd];
      const dateKey = toDateKey(targetDate);
      return { ...b, date: dateKey, id: `${b.id}-${dateKey}` };
    });

    const byDate: Record<string, Booking[]> = {};
    for (const d of dates) {
      const dateKey = toDateKey(d);
      const onThisDate = bookingsForRange
        .filter((b) => b.date === dateKey)
        .slice()
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
      byDate[dateKey] = onThisDate;
    }
    return { allDates: dates, bookingsByDate: byDate, todayKey: tKey };
  }, [listAnchor, weeksToShow, bookingsSource]);
}
