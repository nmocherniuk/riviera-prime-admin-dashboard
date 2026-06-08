import { api } from "./api";
import type {
  Booking,
  BookingStatus,
  PaymentStatus,
} from "../features/Bookings/components/BookingsCalendar/data/dummyBookings";

export type PublicVehicleClass = "comfort" | "business" | "van";

export type BookingDto = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  tripType: string;
  notesForDriver: string;
  vehicleId: string | null;
  vehicleName: string | null;
  vehicleClass: PublicVehicleClass | null;
  driverId: string | null;
  driverName: string | null;
  bookingAt: string;
  from: string;
  to: string;
  durationMin: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  driverResponseDeadline: string | null;
  totalPrice: number | null;
  createdAt: string;
  updatedAt: string;
};

export type DriverBookingsGroupedDto = {
  paid: BookingDto[];
  unpaid: BookingDto[];
  pending: BookingDto[];
};

export type CreateBookingBody = {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  tripType?: string;
  notesForDriver?: string;
  vehicleId?: string | null;
  vehicleClass?: PublicVehicleClass | null;
  driverId?: string | null;
  bookingAt: string;
  from?: string;
  to?: string;
  durationMin?: number;
  status?: BookingStatus;
  paymentStatus?: PaymentStatus;
};

export type UpdateBookingBody = Partial<CreateBookingBody>;

function minutesToDurationLabel(minutes: number): string {
  if (minutes <= 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (!mins) return `${hours}hr`;
  return `${hours}hr ${mins}min`;
}

const VEHICLE_CLASS_LABELS_FR: Record<PublicVehicleClass, string> = {
  comfort: "Confort",
  business: "Affaires",
  van: "Van",
};

const PARIS_TZ = "Europe/Paris";

function formatBookingAtParis(iso: string): { date: string; startTime: string } {
  const dateObj = new Date(iso);
  const date = new Intl.DateTimeFormat("en-CA", {
    timeZone: PARIS_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(dateObj);
  const startTime = new Intl.DateTimeFormat("en-GB", {
    timeZone: PARIS_TZ,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(dateObj);
  return { date, startTime };
}

export function dtoToBooking(dto: BookingDto): Booking {
  const { date, startTime } = formatBookingAtParis(dto.bookingAt);

  return {
    id: dto.id,
    date,
    startTime,
    duration: minutesToDurationLabel(dto.durationMin),
    durationMin: dto.durationMin,
    tripType: dto.tripType,
    clientName: dto.clientName,
    clientEmail: dto.clientEmail || undefined,
    clientPhone: dto.clientPhone || undefined,
    notesForDriver: dto.notesForDriver || undefined,
    from: dto.from ?? "",
    to: dto.to ?? "",
    car: dto.vehicleName ?? undefined,
    vehicleId: dto.vehicleId ?? undefined,
    vehicleClass: dto.vehicleClass ?? undefined,
    totalPrice: dto.totalPrice,
    status: dto.status,
    driverId: dto.driverId ?? undefined,
    driverName: dto.driverName ?? undefined,
    paymentStatus: dto.paymentStatus,
    driverResponseDeadline: dto.driverResponseDeadline ?? undefined,
  };
}

export function vehicleClassLabelFr(c: PublicVehicleClass): string {
  return VEHICLE_CLASS_LABELS_FR[c];
}

export async function listBookings(filters?: { driverId?: string; vehicleId?: string }) {
  const { data } = await api.get<{ bookings: BookingDto[] }>("/bookings", {
    params: filters ?? {},
  });
  return data.bookings;
}

export async function createBooking(body: CreateBookingBody) {
  const { data } = await api.post<{ booking: BookingDto }>("/bookings", body);
  return data.booking;
}

export async function listDriverBookingsGrouped(driverId: string) {
  const { data } = await api.get<DriverBookingsGroupedDto>("/bookings/driver/bookings", {
    params: { driverId },
  });
  return data;
}

export async function updateBooking(id: string, body: UpdateBookingBody) {
  const { data } = await api.patch<{ booking: BookingDto }>(`/bookings/${id}`, body);
  return data.booking;
}

export async function deleteBooking(id: string) {
  await api.delete(`/bookings/${id}`);
}

