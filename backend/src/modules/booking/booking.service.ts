import type {
  BookingStatus,
  PaymentStatus,
  Bookings,
  Drivers,
  Vehicles,
} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import {
  createBooking,
  deleteBookingById,
  findBookingById,
  listBookings,
  updateBooking,
  type CreateBookingData,
  type UpdateBookingData,
} from "./booking.repository.js";

type BookingWithRelations = Bookings & {
  driver: Drivers | null;
  vehicle: Vehicles;
};

export type PublicBookingStatus = "pending" | "assigned" | "completed" | "cancelled";
export type PublicPaymentStatus = "paid" | "unpaid";

export type PublicBooking = {
  id: string;
  clientName: string;
  vehicleId: string;
  vehicleName: string;
  driverId: string | null;
  driverName: string | null;
  bookingAt: string;
  route: string;
  durationMin: number;
  status: PublicBookingStatus;
  paymentStatus: PublicPaymentStatus;
  createdAt: string;
  updatedAt: string;
};

function toPublicStatus(value: BookingStatus): PublicBookingStatus {
  if (value === "ASSIGNED") return "assigned";
  if (value === "COMPLETED") return "completed";
  if (value === "CANCELLED") return "cancelled";
  return "pending";
}

function toDbStatus(value: PublicBookingStatus): BookingStatus {
  if (value === "assigned") return "ASSIGNED";
  if (value === "completed") return "COMPLETED";
  if (value === "cancelled") return "CANCELLED";
  return "PENDING";
}

function toPublicPaymentStatus(value: PaymentStatus): PublicPaymentStatus {
  return value === "PAID" ? "paid" : "unpaid";
}

function toDbPaymentStatus(value: PublicPaymentStatus): PaymentStatus {
  return value === "paid" ? "PAID" : "UNPAID";
}

function toPublicBooking(row: BookingWithRelations): PublicBooking {
  return {
    id: row.id,
    clientName: row.clientName,
    vehicleId: row.vehicleId,
    vehicleName: row.vehicle.vehicleName,
    driverId: row.driverId ?? null,
    driverName: row.driver?.name ?? null,
    bookingAt: row.bookingAt.toISOString(),
    route: row.route,
    durationMin: row.durationMin,
    status: toPublicStatus(row.status),
    paymentStatus: toPublicPaymentStatus(row.paymentStatus),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function validateDriverAndVehicle(input: {
  driverId?: string | null | undefined;
  vehicleId: string;
}) {
  const vehicle = await prisma.vehicles.findUnique({ where: { id: input.vehicleId } });
  if (!vehicle) throw new Error("Vehicle not found");

  if (!input.driverId) return;

  const driver = await prisma.drivers.findUnique({ where: { id: input.driverId } });
  if (!driver) throw new Error("Driver not found");
  if (
    vehicle.organizationId != null &&
    driver.organizationId !== vehicle.organizationId
  ) {
    throw new Error("Driver does not belong to vehicle organization");
  }
}

export async function listBookingsService(filters?: { driverId?: string; vehicleId?: string }) {
  const rows = await listBookings(filters);
  return rows.map(toPublicBooking);
}

export async function getBookingByIdService(id: string) {
  const row = await findBookingById(id);
  if (!row) return null;
  return toPublicBooking(row);
}

export async function createBookingService(
  input: Omit<CreateBookingData, "bookingAt" | "status" | "paymentStatus"> & {
    bookingAt: string;
    status: PublicBookingStatus;
    paymentStatus: PublicPaymentStatus;
  },
) {
  await validateDriverAndVehicle({
    vehicleId: input.vehicleId,
    driverId: input.driverId,
  });
  const created = await createBooking({
    ...input,
    bookingAt: new Date(input.bookingAt),
    status: toDbStatus(input.status),
    paymentStatus: toDbPaymentStatus(input.paymentStatus),
  });
  return toPublicBooking(created);
}

export async function updateBookingService(
  id: string,
  input: Partial<
    Omit<UpdateBookingData, "bookingAt" | "status" | "paymentStatus"> & {
      bookingAt: string;
      status: PublicBookingStatus;
      paymentStatus: PublicPaymentStatus;
    }
  >,
) {
  const existing = await findBookingById(id);
  if (!existing) return null;

  const nextVehicleId = input.vehicleId ?? existing.vehicleId;
  const nextDriverId =
    input.driverId === undefined ? existing.driverId : input.driverId;
  await validateDriverAndVehicle({ vehicleId: nextVehicleId, driverId: nextDriverId });

  const updateData: UpdateBookingData = {};
  if (input.clientName !== undefined) updateData.clientName = input.clientName;
  if (input.vehicleId !== undefined) updateData.vehicleId = input.vehicleId;
  if (input.driverId !== undefined) updateData.driverId = input.driverId;
  if (input.route !== undefined) updateData.route = input.route;
  if (input.durationMin !== undefined) updateData.durationMin = input.durationMin;
  if (input.bookingAt !== undefined) updateData.bookingAt = new Date(input.bookingAt);
  if (input.status !== undefined) updateData.status = toDbStatus(input.status);
  if (input.paymentStatus !== undefined) {
    updateData.paymentStatus = toDbPaymentStatus(input.paymentStatus);
  }

  const updated = await updateBooking(id, updateData);
  return toPublicBooking(updated);
}

export async function deleteBookingService(id: string) {
  const existing = await findBookingById(id);
  if (!existing) return null;
  await deleteBookingById(id);
  return true;
}

