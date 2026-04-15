import type {
  BookingStatus,
  PaymentStatus,
  Prisma,
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
  candidateDriverIds: true,
  vehicleClass: true,
  vehicleId: true,
  driverId: true,
  bookingAt: true,
  from: true,
  to: true,
  durationMin: true,
  status: true,
  paymentStatus: true,
  stripePaymentIntentId: true,
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
  candidateDriverIds?: Prisma.InputJsonValue;
};

export type UpdateBookingData = Partial<CreateBookingData>;

/** Parses stored JSON for WhatsApp / notifications (driverId + status per entry). */
export function parseCandidateDriverIdsJson(
  value: Prisma.JsonValue | null | undefined,
): { driverId: string; status: string }[] {
  if (value == null || !Array.isArray(value)) return [];
  const out: { driverId: string; status: string }[] = [];
  for (const item of value) {
    if (typeof item !== "object" || item === null || !("driverId" in item))
      continue;
    const o = item as Record<string, unknown>;
    const driverId = String(o.driverId ?? "");
    if (!driverId) continue;
    out.push({ driverId, status: String(o.status ?? "pending") });
  }
  return out;
}

export async function listBookings(filters?: {
  driverId?: string;
  vehicleId?: string;
}) {
  const where: { driverId?: string; vehicleId?: string } = {};
  if (filters?.driverId !== undefined) where.driverId = filters.driverId;
  if (filters?.vehicleId !== undefined) where.vehicleId = filters.vehicleId;

  return prisma.bookings.findMany({
    where,
    select: bookingPayloadSelect,
    orderBy: { bookingAt: "asc" },
  });
}

export async function listCompletedBookings(driverId: string, take = 6) {
  return prisma.bookings.findMany({
    where: { driverId, status: "COMPLETED" },
    select: bookingPayloadSelect,
    orderBy: { bookingAt: "desc" },
    take,
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
