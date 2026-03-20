export type BookingStatus = "pending" | "assigned" | "completed" | "cancelled";

export type PaymentStatus = "paid" | "unpaid";

export type Booking = {
  id: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: string;
  clientName: string;
  route: string;
  car?: string;
  status?: BookingStatus;
  driverId?: string;
  paymentStatus?: PaymentStatus;
};

export const DUMMY_BOOKINGS: Booking[] = [
  { id: "1", date: "2026-03-12", startTime: "09:00", duration: "1hr", clientName: "Marcus Vane", route: "LHR → Mayfair", car: "BMW 7 Series", status: "assigned", driverId: "marcus", paymentStatus: "paid" },
  { id: "2", date: "2026-03-12", startTime: "14:00", duration: "1hr 30min", clientName: "Alexandre Dubois", route: "Hotel → City", car: "Mercedes S-Class", status: "pending", driverId: "clara", paymentStatus: "unpaid" },
  { id: "3", date: "2026-03-13", startTime: "08:30", duration: "45min", clientName: "Sarah Chen", route: "Heathrow → Knightsbridge", car: "Audi A8", status: "completed", driverId: "clara", paymentStatus: "paid" },
  { id: "4", date: "2026-03-13", startTime: "12:00", duration: "2hr", clientName: "James Wilson", route: "Gatwick → Canary Wharf", car: "Range Rover", status: "cancelled", driverId: "marcus", paymentStatus: "unpaid" },
  { id: "5", date: "2026-03-14", startTime: "10:00", duration: "1hr", clientName: "Elena Petrova", route: "St Pancras → Westminster", car: "BMW 7 Series", status: "assigned", driverId: "marcus", paymentStatus: "paid" },
  { id: "6", date: "2026-03-15", startTime: "11:30", duration: "1hr 15min", clientName: "Michael Brown", route: "LHR → Shoreditch", status: "pending", driverId: "clara", paymentStatus: "unpaid" },
  { id: "7", date: "2026-03-16", startTime: "09:00", duration: "1hr", clientName: "Marcus Vane", route: "LHR → Mayfair", car: "Mercedes S-Class", status: "completed", driverId: "marcus", paymentStatus: "paid" },
  { id: "8", date: "2026-03-16", startTime: "15:00", duration: "1hr 30min", clientName: "Alexandre Dubois", route: "Hotel → City", car: "Audi A8", status: "assigned", driverId: "clara", paymentStatus: "paid" },
  { id: "9", date: "2026-03-16", startTime: "18:30", duration: "45min", clientName: "Olivia Green", route: "Paddington → Chelsea", status: "pending", paymentStatus: "unpaid" },
  { id: "10", date: "2026-03-17", startTime: "08:00", duration: "2hr", clientName: "David Lee", route: "City → Stratford", car: "BMW 7 Series", status: "completed", driverId: "marcus", paymentStatus: "paid" },
  { id: "11", date: "2026-03-17", startTime: "12:00", duration: "1hr", clientName: "Emma Taylor", route: "Heathrow → Kensington", car: "Range Rover", status: "assigned", driverId: "clara", paymentStatus: "unpaid" },
  { id: "12", date: "2026-03-18", startTime: "10:30", duration: "50min", clientName: "Robert Kim", route: "Luton → Mayfair", status: "cancelled", paymentStatus: "unpaid" },
];
