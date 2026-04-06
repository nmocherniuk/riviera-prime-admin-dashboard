import type {
  BookingStatus,
  PaymentStatus,
  Bookings,
  VehicleClass,
} from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import {
  createBooking,
  deleteBookingById,
  findBookingById,
  listBookings,
  updateBooking,
  type UpdateBookingData,
} from "./booking.repository.js";
import { notifyDriverBookingPaidIfNeeded } from "../whatsapp/whatsapp.bookingPaid.js";
import {
  toDbVehicleClass,
  toPublicVehicleClass,
  type PublicVehicleClass,
} from "./booking.vehicleClass.js";

export type { PublicVehicleClass };

/** Repository payloads omit `whatsappPaidTemplateSentAt` in SELECT for DBs without that migration. */
type BookingWithRelations = Omit<
  Bookings,
  "driver" | "vehicle" | "whatsappPaidTemplateSentAt"
> & {
  driver: { id: string; name: string } | null;
  vehicle: { id: string; vehicleName: string } | null;
};

export type PublicBookingStatus =
  | "pending"
  | "assigned"
  | "completed"
  | "cancelled";
export type PublicPaymentStatus = "paid" | "unpaid";

export type PublicBooking = {
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
  bookingAt: Date;
  from: string;
  to: string;
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
    clientEmail: row.clientEmail,
    clientPhone: row.clientPhone,
    tripType: row.tripType,
    notesForDriver: row.notesForDriver,
    vehicleId: row.vehicleId ?? null,
    vehicleName: row.vehicle?.vehicleName ?? null,
    vehicleClass: toPublicVehicleClass(row.vehicleClass),
    driverId: row.driverId ?? null,
    driverName: row.driver?.name ?? null,
    bookingAt: row.bookingAt,
    from: row.from,
    to: row.to,
    durationMin: row.durationMin,
    status: toPublicStatus(row.status),
    paymentStatus: toPublicPaymentStatus(row.paymentStatus),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

async function validateDriverAndVehicle(input: {
  driverId?: string | null | undefined;
  vehicleId: string | null;
}) {
  if (!input.vehicleId) return;

  const vehicle = await prisma.vehicles.findUnique({
    where: { id: input.vehicleId },
    select: { id: true, organizationId: true },
  });
  if (!vehicle) throw new Error("Vehicle not found");

  if (!input.driverId) return;

  const driver = await prisma.drivers.findUnique({
    where: { id: input.driverId },
    select: { id: true, organizationId: true },
  });
  if (!driver) throw new Error("Driver not found");
  if (
    vehicle.organizationId != null &&
    driver.organizationId !== vehicle.organizationId
  ) {
    throw new Error("Driver does not belong to vehicle organization");
  }
}

function assertVehicleOrClass(
  vehicleId: string | null,
  vehicleClass: VehicleClass | null,
) {
  if (!vehicleId && vehicleClass == null) {
    throw new Error("Provide vehicleId or vehicleClass");
  }
}

export async function listBookingsService(filters?: {
  driverId?: string;
  vehicleId?: string;
}) {
  const rows = await listBookings(filters);
  return rows.map(toPublicBooking);
}

export async function getBookingByIdService(id: string) {
  const row = await findBookingById(id);
  if (!row) return null;
  return toPublicBooking(row);
}

/**
 * Public landing: always pending, no driver — ops assign in dashboard.
 * Reuses WhatsApp paid notification when paymentStatus is paid.
 */
export async function createPublicBookingService(body: {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  tripType?: string;
  notesForDriver?: string;
  vehicleId?: string | null;
  vehicleClass?: PublicVehicleClass | null;
  bookingAt: string;
  from: string;
  to: string;
  durationMin: number;
  paymentStatus: PublicPaymentStatus;
}) {
  return createBookingService({
    clientName: body.clientName,
    clientEmail: body.clientEmail ?? "",
    clientPhone: body.clientPhone ?? "",
    tripType: body.tripType ?? "one-way",
    notesForDriver: body.notesForDriver ?? "",
    vehicleId: body.vehicleId ?? null,
    vehicleClass: body.vehicleClass ?? null,
    driverId: null,
    bookingAt: body.bookingAt,
    from: body.from,
    to: body.to,
    durationMin: body.durationMin,
    status: "pending",
    paymentStatus: body.paymentStatus,
  });
}

export type CreateBookingServiceInput = {
  clientName: string;
  clientEmail?: string;
  clientPhone?: string;
  tripType?: string;
  notesForDriver?: string;
  vehicleId?: string | null;
  vehicleClass?: PublicVehicleClass | null;
  driverId?: string | null;
  bookingAt: string;
  from: string;
  to: string;
  durationMin: number;
  status: PublicBookingStatus;
  paymentStatus: PublicPaymentStatus;
};

export async function createBookingService(input: CreateBookingServiceInput) {
  const vehicleId = input.vehicleId ?? null;
  const vehicleClassDb =
    input.vehicleClass != null ? toDbVehicleClass(input.vehicleClass) : null;
  assertVehicleOrClass(vehicleId, vehicleClassDb);

  await validateDriverAndVehicle({
    vehicleId,
    driverId: input.driverId,
  });

  const created = await createBooking({
    clientName: input.clientName,
    clientEmail: input.clientEmail ?? "",
    clientPhone: input.clientPhone ?? "",
    tripType: input.tripType ?? "one-way",
    notesForDriver: input.notesForDriver ?? "",
    vehicleId,
    vehicleClass: vehicleClassDb,
    driverId: input.driverId ?? null,
    bookingAt: new Date(input.bookingAt),
    from: input.from,
    to: input.to,
    durationMin: input.durationMin,
    status: toDbStatus(input.status),
    paymentStatus: toDbPaymentStatus(input.paymentStatus),
  });
  void notifyDriverBookingPaidIfNeeded(
    created.id,
    "UNPAID",
    created.paymentStatus,
  );
  return toPublicBooking(created);
}

export async function updateBookingService(
  id: string,
  input: Partial<
    Omit<
      UpdateBookingData,
      "bookingAt" | "status" | "paymentStatus" | "vehicleClass"
    > & {
      bookingAt: string;
      status: PublicBookingStatus;
      paymentStatus: PublicPaymentStatus;
      vehicleClass?: PublicVehicleClass | null;
    }
  >,
) {
  const existing = await findBookingById(id);
  if (!existing) return null;

  const nextVehicleId =
    input.vehicleId !== undefined ? input.vehicleId : existing.vehicleId;
  let nextVehicleClass: VehicleClass | null = existing.vehicleClass;
  if (input.vehicleClass !== undefined) {
    nextVehicleClass =
      input.vehicleClass === null ? null : toDbVehicleClass(input.vehicleClass);
  }

  assertVehicleOrClass(nextVehicleId, nextVehicleClass);

  const nextDriverId =
    input.driverId === undefined ? existing.driverId : input.driverId;
  await validateDriverAndVehicle({
    vehicleId: nextVehicleId,
    driverId: nextDriverId,
  });

  const updateData: UpdateBookingData = {};
  if (input.clientName !== undefined) updateData.clientName = input.clientName;
  if (input.clientEmail !== undefined) updateData.clientEmail = input.clientEmail;
  if (input.clientPhone !== undefined) updateData.clientPhone = input.clientPhone;
  if (input.tripType !== undefined) updateData.tripType = input.tripType;
  if (input.notesForDriver !== undefined)
    updateData.notesForDriver = input.notesForDriver;
  if (input.vehicleId !== undefined) updateData.vehicleId = input.vehicleId;
  if (input.vehicleClass !== undefined) {
    updateData.vehicleClass =
      input.vehicleClass === null ? null : toDbVehicleClass(input.vehicleClass);
  }
  if (input.driverId !== undefined) updateData.driverId = input.driverId;
  if (input.from !== undefined) updateData.from = input.from;
  if (input.to !== undefined) updateData.to = input.to;
  if (input.durationMin !== undefined)
    updateData.durationMin = input.durationMin;
  if (input.bookingAt !== undefined)
    updateData.bookingAt = new Date(input.bookingAt);
  if (input.status !== undefined) updateData.status = toDbStatus(input.status);
  if (input.paymentStatus !== undefined) {
    updateData.paymentStatus = toDbPaymentStatus(input.paymentStatus);
  }

  const previousPayment = existing.paymentStatus;
  const updated = await updateBooking(id, updateData);
  void notifyDriverBookingPaidIfNeeded(
    id,
    previousPayment,
    updated.paymentStatus,
  );
  return toPublicBooking(updated);
}

export async function deleteBookingService(id: string) {
  const existing = await findBookingById(id);
  if (!existing) return null;
  await deleteBookingById(id);
  return true;
}
