import { api } from "./api";
import type {
  Booking,
  BookingStatus,
  PaymentStatus,
} from "../features/Bookings/components/BookingsCalendar/data/dummyBookings";

export type BookingDto = {
  id: string;
  clientName: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string | null;
  driverName: string | null;
  bookingAt: string;
  route: string;
  durationMin: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateBookingBody = {
  clientName: string;
  vehicleId: string;
  driverId?: string | null;
  bookingAt: string;
  route?: string;
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

export function dtoToBooking(dto: BookingDto): Booking {
  const dateObj = new Date(dto.bookingAt);
  const date = dateObj.toISOString().slice(0, 10);
  const startTime = dateObj.toISOString().slice(11, 16);

  return {
    id: dto.id,
    date,
    startTime,
    duration: minutesToDurationLabel(dto.durationMin),
    clientName: dto.clientName,
    route: dto.route ?? "",
    car: dto.vehicleName,
    vehicleId: dto.vehicleId,
    status: dto.status,
    driverId: dto.driverId ?? undefined,
    driverName: dto.driverName ?? undefined,
    paymentStatus: dto.paymentStatus,
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

export async function updateBooking(id: string, body: UpdateBookingBody) {
  const { data } = await api.patch<{ booking: BookingDto }>(`/bookings/${id}`, body);
  return data.booking;
}

export async function deleteBooking(id: string) {
  await api.delete(`/bookings/${id}`);
}

