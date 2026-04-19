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
  parseCandidateDriverIdsJson,
  updateBooking,
  type UpdateBookingData,
} from "./booking.repository.js";
import {
  notifyDriversNewBooking,
  notifyDriverBookingPaidIfNeeded,
} from "../whatsapp/whatsapp.bookingPaid.js";
import { sendBookingPendingEmail } from "./booking.emails.js";
import {
  toDbVehicleClass,
  toPublicVehicleClass,
  type PublicVehicleClass,
} from "./booking.vehicleClass.js";
import { getDriversByVehicleId } from "../driver/driver.service.js";

export type { PublicVehicleClass };

/** Repository payloads omit `whatsappPaidTemplateSentAt` in SELECT for DBs without that migration. */
export type BookingPricingRow = Omit<
  Bookings,
  "driver" | "vehicle" | "whatsappPaidTemplateSentAt"
> & {
  driver: { id: string; name: string } | null;
  vehicle: { id: string; vehicleName: string } | null;
};

export type PublicBookingStatus =
  | "pending"
  | "assigned"
  | "in_progress"
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
  driverResponseDeadline: Date | null;
  createdAt: string;
  updatedAt: string;
};

function toPublicStatus(value: BookingStatus): PublicBookingStatus {
  if (value === "ASSIGNED") return "assigned";
  if (value === "IN_PROGRESS") return "in_progress";
  if (value === "COMPLETED") return "completed";
  if (value === "CANCELLED") return "cancelled";
  return "pending";
}

function toDbStatus(value: PublicBookingStatus): BookingStatus {
  if (value === "assigned") return "ASSIGNED";
  if (value === "in_progress") return "IN_PROGRESS";
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

function toPublicBooking(row: BookingPricingRow): PublicBooking {
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
    driverResponseDeadline: row.driverResponseDeadline ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function endOfDay(d: Date): Date {
  const e = new Date(d);
  e.setHours(23, 59, 59, 999);
  return e;
}

/**
 * Dynamic deadline for driver response.
 * Keeps backward-compatible statuses by applying logic on PENDING offers.
 */
export function computeDriverResponseDeadline(bookingAt: Date): Date {
  const now = new Date();
  const minBufferMs = 5 * 60_000;
  const minAllowed = new Date(now.getTime() + minBufferMs);
  const diffMs = bookingAt.getTime() - now.getTime();
  const diffHours = diffMs / 3_600_000;

  let candidate: Date;
  if (diffHours <= 2) {
    candidate = new Date(now.getTime() + 13 * 60_000);
  } else {
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const isToday = bookingAt <= endOfDay(now);
    const isTomorrow =
      bookingAt >= new Date(tomorrow.setHours(0, 0, 0, 0)) &&
      bookingAt <= endOfDay(tomorrow);

    if (isToday) {
      candidate = new Date(now.getTime() + 60 * 60_000);
    } else if (isTomorrow) {
      candidate = new Date(now.getTime() + 6 * 60 * 60_000);
    } else {
      candidate = new Date(bookingAt.getTime() - 72 * 60 * 60_000);
    }
  }

  return candidate < minAllowed ? minAllowed : candidate;
}

/** When frontend sends only vehicleId, attach the vehicle owner as driver. */
async function resolveDriverIdFromVehicle(
  vehicleId: string | null,
  explicitDriverId: string | null,
): Promise<string | null> {
  if (explicitDriverId) return explicitDriverId;
  if (!vehicleId) return null;
  const v = await prisma.vehicles.findUnique({
    where: { id: vehicleId },
    select: {
      drivers: { select: { id: true }, orderBy: { id: "asc" }, take: 1 },
    },
  });
  return v?.drivers[0]?.id ?? null;
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
  vehicleId?: string;
  driverId?: string;
}) {
  const rows = await listBookings(filters);
  return rows.map(toPublicBooking);
}

export type GroupedDriverBookings = {
  paid: PublicBooking[];
  unpaid: PublicBooking[];
  pending: PublicBooking[];
};

export async function listDriverBookingsGroupedService(
  driverId: string,
): Promise<GroupedDriverBookings> {
  const rows = await listBookings();
  const mapped = rows.map(toPublicBooking);
  const rowsById = new Map(rows.map((r) => [r.id, r]));

  const pending = mapped.filter((b) => {
    if (b.status !== "pending") return false;
    if (b.driverId === driverId) return true;
    const row = rowsById.get(b.id);
    if (!row) return false;
    const candidates = parseCandidateDriverIdsJson(row.candidateDriverIds);
    return candidates.some(
      (c) => c.driverId === driverId && c.status.toLowerCase() === "pending",
    );
  });

  const acceptedForDriver = mapped.filter(
    (b) => b.status === "assigned" && b.driverId === driverId,
  );

  const paid = acceptedForDriver.filter((b) => b.paymentStatus === "paid");
  const unpaid = acceptedForDriver.filter((b) => b.paymentStatus === "unpaid");

  return { paid, unpaid, pending };
}

export async function getBookingByIdService(id: string) {
  const row = await findBookingById(id);
  if (!row) return null;
  return toPublicBooking(row);
}

const DEFAULT_PER_HOUR_EUR = 120;

/** Hourly estimate from vehicle pricing (no distance in DB). */
/** Hourly estimate from vehicle pricing (no distance in DB). Exported for admin payments list. */
export async function estimateBookingPriceEur(row: BookingPricingRow): Promise<number> {
  const hours = row.durationMin / 60;
  let perHour = DEFAULT_PER_HOUR_EUR;
  const vehicleId =
    row.vehicleId && row.vehicleId.trim() !== "" ? row.vehicleId : null;
  if (vehicleId) {
    const pricing = await prisma.vehiclePricings.findUnique({
      where: { vehicleId },
    });
    if (pricing) perHour = Number(pricing.perHour);
  }
  const raw = hours * perHour;
  return Math.round(raw * 100) / 100;
}

export type PublicBookingForPayment = PublicBooking & {
  price: number;
  totalPrice: number;
};

/** For Stripe / payment links: authoritative amount from server (not client). */
export async function getPublicBookingForPaymentService(
  id: string,
): Promise<PublicBookingForPayment | null> {
  const row = await findBookingById(id);
  if (!row) return null;
  const price = await estimateBookingPriceEur(row);
  return {
    ...toPublicBooking(row),
    price,
    totalPrice: price,
  };
}

export type PublicBookingPaymentLookup =
  | { status: "ok"; booking: PublicBookingForPayment }
  | { status: "not_found" }
  | { status: "already_paid"; booking: PublicBookingForPayment };

/** Single lookup path for public payment / booking-by-id flows (no duplicated fetch logic). */
export async function lookupPublicBookingForPayment(
  bookingId: string,
): Promise<PublicBookingPaymentLookup> {
  const booking = await getPublicBookingForPaymentService(bookingId);
  if (!booking) return { status: "not_found" };
  if (booking.paymentStatus === "paid") {
    return { status: "already_paid", booking };
  }
  return { status: "ok", booking };
}

/** HTTP status for create/update booking when service throws known validation errors. */
export function httpStatusForKnownBookingMutationError(
  message: string,
): number {
  if (
    message === "Vehicle not found" ||
    message === "Driver not found" ||
    message === "Driver does not belong to vehicle organization" ||
    message === "Provide vehicleId or vehicleClass"
  ) {
    return 400;
  }
  return 500;
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
  vehicleId: string;
  vehicleClass?: PublicVehicleClass | null;
  bookingAt: string;
  from: string;
  to: string;
  durationMin: number;
}) {
  return createBookingService({
    clientName: body.clientName,
    clientEmail: body.clientEmail ?? "",
    clientPhone: body.clientPhone ?? "",
    tripType: body.tripType ?? "one-way",
    notesForDriver: body.notesForDriver ?? "",
    vehicleId: body.vehicleId,
    vehicleClass: body.vehicleClass ?? null,
    bookingAt: body.bookingAt,
    from: body.from,
    to: body.to,
    durationMin: body.durationMin,
    status: "pending",
    paymentStatus: "unpaid",
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
  console.log("vehicleId", vehicleId);

  const vehicleClassDb =
    input.vehicleClass != null ? toDbVehicleClass(input.vehicleClass) : null;
  assertVehicleOrClass(vehicleId, vehicleClassDb);

  const drivers = vehicleId ? await getDriversByVehicleId(vehicleId) : [];

  if (vehicleId && drivers.length === 0)
    throw new Error("No drivers found for vehicle");

  // await validateDriverAndVehicle({
  //   vehicleId,
  //   driverId: input.driverId,
  // });

  const created = await createBooking({
    clientName: input.clientName,
    clientEmail: input.clientEmail ?? "",
    clientPhone: input.clientPhone ?? "",
    tripType: input.tripType ?? "one-way",
    notesForDriver: input.notesForDriver ?? "",
    vehicleId,
    vehicleClass: vehicleClassDb,
    driverId: null,
    bookingAt: new Date(input.bookingAt),
    from: input.from,
    to: input.to,
    durationMin: input.durationMin,
    status: toDbStatus(input.status),
    paymentStatus: toDbPaymentStatus(input.paymentStatus),
    driverResponseDeadline: computeDriverResponseDeadline(new Date(input.bookingAt)),
    candidateDriverIds: drivers.map((driver) => {
      return { driverId: driver.id, status: "pending" };
    }),
  });

  void notifyDriversNewBooking(
    created.id,
    parseCandidateDriverIdsJson(created.candidateDriverIds),
  );

  if (created.status === "PENDING" && created.clientEmail) {
    void sendBookingPendingEmail({
      bookingId: created.id,
      clientName: created.clientName,
      clientEmail: created.clientEmail,
      from: created.from,
      to: created.to,
      bookingAt: created.bookingAt,
      durationMin: created.durationMin,
    });
  }

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

  let nextDriverId =
    input.driverId === undefined ? existing.driverId : input.driverId;
  const vehicleIdChanged =
    input.vehicleId !== undefined && input.vehicleId !== existing.vehicleId;
  if (vehicleIdChanged && input.driverId === undefined) {
    nextDriverId = null;
  }
  // Явний `driverId` у запиті (навіть `null`) — не підставляти водія з авто (наприклад WhatsApp REJECT).
  if (input.driverId === undefined) {
    nextDriverId = await resolveDriverIdFromVehicle(nextVehicleId, nextDriverId);
  }

  await validateDriverAndVehicle({
    vehicleId: nextVehicleId,
    driverId: nextDriverId,
  });

  const updateData: UpdateBookingData = {};
  if (input.clientName !== undefined) updateData.clientName = input.clientName;
  if (input.clientEmail !== undefined)
    updateData.clientEmail = input.clientEmail;
  if (input.clientPhone !== undefined)
    updateData.clientPhone = input.clientPhone;
  if (input.tripType !== undefined) updateData.tripType = input.tripType;
  if (input.notesForDriver !== undefined)
    updateData.notesForDriver = input.notesForDriver;
  if (input.vehicleId !== undefined) updateData.vehicleId = input.vehicleId;
  if (input.vehicleClass !== undefined) {
    updateData.vehicleClass =
      input.vehicleClass === null ? null : toDbVehicleClass(input.vehicleClass);
  }
  if (nextDriverId !== existing.driverId) {
    updateData.driverId = nextDriverId;
  }
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
  if (input.candidateDriverIds !== undefined) {
    updateData.candidateDriverIds = input.candidateDriverIds;
  }

  const previousPayment = existing.paymentStatus;
  const updated = await updateBooking(id, updateData);
  void notifyDriverBookingPaidIfNeeded(
    id,
    previousPayment,
    updated.paymentStatus,
    parseCandidateDriverIdsJson(updated.candidateDriverIds),
  );
  return toPublicBooking(updated);
}

export async function deleteBookingService(id: string) {
  const existing = await findBookingById(id);
  if (!existing) return null;
  await deleteBookingById(id);
  return true;
}
