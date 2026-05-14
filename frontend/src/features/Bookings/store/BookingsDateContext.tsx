import { createContext, useContext, useState, useRef, useCallback, type ReactNode } from "react";

type BookingsDateContextValue = {
  selectedDate: Date;
  setSelectedDate: (date: Date | ((prev: Date) => Date)) => void;
  registerScrollToDate: (fn: (date: Date) => void) => void;
  scrollToDate: (date: Date) => void;
};

const BookingsDateContext = createContext<BookingsDateContextValue | null>(null);

export function BookingsDateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const scrollToDateRef = useRef<((date: Date) => void) | null>(null);

  const registerScrollToDate = useCallback((fn: (date: Date) => void) => {
    scrollToDateRef.current = fn;
  }, []);

  const scrollToDate = useCallback((date: Date) => {
    scrollToDateRef.current?.(date);
  }, []);

  return (
    <BookingsDateContext.Provider
      value={{ selectedDate, setSelectedDate, registerScrollToDate, scrollToDate }}
    >
      {children}
    </BookingsDateContext.Provider>
  );
}

export function useBookingsDate(): BookingsDateContextValue {
  const ctx = useContext(BookingsDateContext);
  if (!ctx) throw new Error("useBookingsDate must be used within BookingsDateProvider");
  return ctx;
}
