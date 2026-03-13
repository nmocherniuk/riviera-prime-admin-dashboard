import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

type BookingsDateContextValue = {
  selectedDate: Date;
  setSelectedDate: (date: Date | ((prev: Date) => Date)) => void;
};

const BookingsDateContext = createContext<BookingsDateContextValue | null>(null);

export function BookingsDateProvider({ children }: { children: ReactNode }) {
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  return (
    <BookingsDateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </BookingsDateContext.Provider>
  );
}

export function useBookingsDate(): BookingsDateContextValue {
  const ctx = useContext(BookingsDateContext);
  if (!ctx) throw new Error("useBookingsDate must be used within BookingsDateProvider");
  return ctx;
}
