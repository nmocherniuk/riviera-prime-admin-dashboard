export type Booking = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: string;
  clientName: string;
  route: string;
};

export const DUMMY_BOOKINGS: Booking[] = [
  { id: "1", date: "2025-03-12", startTime: "09:00", duration: "1hr", clientName: "Marcus Vane", route: "LHR → Mayfair" },
  { id: "2", date: "2025-03-12", startTime: "14:00", duration: "1hr 30min", clientName: "Alexandre Dubois", route: "Hotel → City" },
  { id: "3", date: "2025-03-13", startTime: "08:30", duration: "45min", clientName: "Sarah Chen", route: "Heathrow → Knightsbridge" },
  { id: "4", date: "2025-03-13", startTime: "12:00", duration: "2hr", clientName: "James Wilson", route: "Gatwick → Canary Wharf" },
  { id: "5", date: "2025-03-14", startTime: "10:00", duration: "1hr", clientName: "Elena Petrova", route: "St Pancras → Westminster" },
  { id: "6", date: "2025-03-15", startTime: "11:30", duration: "1hr 15min", clientName: "Michael Brown", route: "LHR → Shoreditch" },
  { id: "7", date: "2025-03-16", startTime: "09:00", duration: "1hr", clientName: "Marcus Vane", route: "LHR → Mayfair" },
  { id: "8", date: "2025-03-16", startTime: "15:00", duration: "1hr 30min", clientName: "Alexandre Dubois", route: "Hotel → City" },
  { id: "9", date: "2025-03-16", startTime: "18:30", duration: "45min", clientName: "Olivia Green", route: "Paddington → Chelsea" },
  { id: "10", date: "2025-03-17", startTime: "08:00", duration: "2hr", clientName: "David Lee", route: "City → Stratford" },
  { id: "11", date: "2025-03-17", startTime: "12:00", duration: "1hr", clientName: "Emma Taylor", route: "Heathrow → Kensington" },
  { id: "12", date: "2025-03-18", startTime: "10:30", duration: "50min", clientName: "Robert Kim", route: "Luton → Mayfair" },
];
