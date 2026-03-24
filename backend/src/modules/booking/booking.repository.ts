import type { BookingStatus, PaymentStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";

export type CreateBookingData = {
  clientName: string;
  vehicleId: string;
  driverId?: string | null;
  bookingAt: Date;
  route: string;
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
    include: {
      driver: true,
      vehicle: true,
    },
    orderBy: { bookingAt: "asc" },
  });
}

export async function findBookingById(id: string) {
  return prisma.bookings.findUnique({
    where: { id },
    include: {
      driver: true,
      vehicle: true,
    },
  });
}

export async function createBooking(data: CreateBookingData) {
  return prisma.bookings.create({
    data,
    include: {
      driver: true,
      vehicle: true,
    },
  });
}

export async function updateBooking(id: string, data: UpdateBookingData) {
  return prisma.bookings.update({
    where: { id },
    data,
    include: {
      driver: true,
      vehicle: true,
    },
  });
}

export async function deleteBookingById(id: string) {
  return prisma.bookings.delete({ where: { id } });
}

export async function countBookings() {
  return prisma.bookings.count();
}

