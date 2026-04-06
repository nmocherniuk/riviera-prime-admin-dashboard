import type {
  BookingStatus,
  PaymentStatus,
  VehicleClass,
} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

/**
 * Scalar + relations needed for API — omits `whatsappPaidTemplateSentAt` so INSERT/RETURNING
 * works when that migration has not been applied yet.
 */
export const bookingPayloadSelect = {
  id: true,
  clientName: true,
  clientEmail: true,
  clientPhone: true,
  tripType: true,
  notesForDriver: true,
  vehicleClass: true,
  vehicleId: true,
  driverId: true,
  bookingAt: true,
  from: true,
  to: true,
  durationMin: true,
  status: true,
  paymentStatus: true,
  createdAt: true,
  updatedAt: true,
  driver: { select: { id: true, name: true } },
  vehicle: { select: { id: true, vehicleName: true } },
} as const;

export type CreateBookingData = {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  tripType: string;
  notesForDriver: string;
  vehicleId: string | null;
  vehicleClass: VehicleClass | null;
  driverId?: string | null;
  bookingAt: Date;
  from: string;
  to: string;
  durationMin: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
};

export type UpdateBookingData = Partial<CreateBookingData>;

export async function listBookings(filters?: { driverId?: string; vehicleId?: string }) {
  const where: { driverId?: string; vehicleId?: string } = {};
  if (filters?.driverId !== undefined) where.driverId = filters.driverId;
  if (filters?.vehicleId !== undefined) where.vehicleId = filters.vehicleId;

  return prisma.bookings.findMany({
    where,
    select: bookingPayloadSelect,
    orderBy: { bookingAt: "asc" },
  });
}

export async function findBookingById(id: string) {
  return prisma.bookings.findUnique({
    where: { id },
    select: bookingPayloadSelect,
  });
}

export async function createBooking(data: CreateBookingData) {
  return prisma.bookings.create({
    data,
    select: bookingPayloadSelect,
  });
}

export async function updateBooking(id: string, data: UpdateBookingData) {
  return prisma.bookings.update({
    where: { id },
    data,
    select: bookingPayloadSelect,
  });
}

export async function deleteBookingById(id: string) {
  return prisma.bookings.delete({
    where: { id },
    select: { id: true },
  });
}

export async function countBookings() {
  return prisma.bookings.count();
}
