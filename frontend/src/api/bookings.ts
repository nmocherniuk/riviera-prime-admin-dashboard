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

function vehicleClassLabel(c: PublicVehicleClass): string {
  const m: Record<PublicVehicleClass, string> = {
    comfort: "Comfort",
    business: "Business",
    van: "Van",
  };
  return m[c];
}

export function dtoToBooking(dto: BookingDto): Booking {
  const dateObj = new Date(dto.bookingAt);
  const date = dateObj.toISOString().slice(0, 10);
  const startTime = dateObj.toISOString().slice(11, 16);

  const carFromClass =
    dto.vehicleClass != null
      ? `${vehicleClassLabel(dto.vehicleClass)} (class)`
      : undefined;

  return {
    id: dto.id,
    date,
    startTime,
    duration: minutesToDurationLabel(dto.durationMin),
    clientName: dto.clientName,
    from: dto.from ?? "",
    to: dto.to ?? "",
    car: dto.vehicleName ?? carFromClass,
    vehicleId: dto.vehicleId ?? undefined,
    vehicleClass: dto.vehicleClass ?? undefined,
    status: dto.status,
    driverId: dto.driverId ?? undefined,
    driverName: dto.driverName ?? undefined,
    paymentStatus: dto.paymentStatus,
    driverResponseDeadline: dto.driverResponseDeadline ?? undefined,
  };
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

