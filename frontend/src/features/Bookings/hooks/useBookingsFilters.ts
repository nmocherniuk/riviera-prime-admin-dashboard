import { useState, useCallback } from "react";
import type { BookingsFilterState } from "../constants/filters";
import { DEFAULT_BOOKINGS_FILTERS } from "../constants/filters";

export type UseBookingsFiltersResult = {
  filters: BookingsFilterState;
  setFilter: <K extends keyof BookingsFilterState>(
    key: K,
    value: BookingsFilterState[K]
  ) => void;
  setFilters: (state: Partial<BookingsFilterState>) => void;
  resetFilters: () => void;
};

export function useBookingsFilters(): UseBookingsFiltersResult {
  const [filters, setFiltersState] = useState<BookingsFilterState>(
    DEFAULT_BOOKINGS_FILTERS
  );

  const setFilter = useCallback(
    <K extends keyof BookingsFilterState>(
      key: K,
      value: BookingsFilterState[K]
    ) => {
      setFiltersState((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const setFilters = useCallback((next: Partial<BookingsFilterState>) => {
    setFiltersState((prev) => ({ ...prev, ...next }));
  }, []);

  const resetFilters = useCallback(() => {
    setFiltersState(DEFAULT_BOOKINGS_FILTERS);
  }, []);

  return { filters, setFilter, setFilters, resetFilters };
}
