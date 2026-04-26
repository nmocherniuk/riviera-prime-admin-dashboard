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
  distanceKm: true,
  durationMin: true,
  status: true,
  paymentStatus: true,
  driverResponseDeadline: true,
  stripePaymentIntentId: true,
  totalAmount: true,
  driverAmount: true,
  platformFee: true,
  baseCustomerPrice: true,
  finalCustomerPrice: true,
  partnerBasePayout: true,
  finalPartnerPayout: true,
  platformMargin: true,
  appliedHolidaySurcharge: true,
  appliedNightSurcharge: true,
  pricingSnapshotSource: true,
  isTransferred: true,
  transferredAt: true,
  payoutStatus: true,
  platformPayoutStatus: true,
  stripeTransferId: true,
  createdAt: true,
  updatedAt: true,
  driver: { select: { id: true, name: true } },
  vehicle: { select: { id: true, vehicleName: true } },
} as const;

const bookingPayloadSelectWithoutDeadline = {
  ...bookingPayloadSelect,
  driverResponseDeadline: false,
  stripePaymentIntentId: false,
  distanceKm: false,
  totalAmount: false,
  driverAmount: false,
  platformFee: false,
  baseCustomerPrice: false,
  finalCustomerPrice: false,
  partnerBasePayout: false,
  finalPartnerPayout: false,
  platformMargin: false,
  appliedHolidaySurcharge: false,
  appliedNightSurcharge: false,
  pricingSnapshotSource: false,
  isTransferred: false,
  transferredAt: false,
  payoutStatus: false,
  platformPayoutStatus: false,
  stripeTransferId: false,
} as const;

type BookingRow = Prisma.BookingsGetPayload<{
  select: typeof bookingPayloadSelect;
}>;
type BookingRowWithoutDeadline = Prisma.BookingsGetPayload<{
  select: typeof bookingPayloadSelectWithoutDeadline;
}>;

function withNullDeadline(row: BookingRowWithoutDeadline): BookingRow {
  return {
    ...row,
    driverResponseDeadline: null,
    stripePaymentIntentId: null,
    distanceKm: null,
    totalAmount: null,
    driverAmount: null,
    platformFee: null,
    baseCustomerPrice: null,
    finalCustomerPrice: null,
    partnerBasePayout: null,
    finalPartnerPayout: null,
    platformMargin: null,
    appliedHolidaySurcharge: null,
    appliedNightSurcharge: null,
    pricingSnapshotSource: null,
    isTransferred: false,
    transferredAt: null,
    payoutStatus: "NONE",
    platformPayoutStatus: "NONE",
    stripeTransferId: null,
  };
}

function isMissingDriverResponseDeadlineColumn(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const err = error as { code?: string; message?: string };
  if (err.code === "P2022") return true;
  const msg = err.message ?? "";
  return msg.includes("does not exist") || msg.includes("(not available)");
}

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
  distanceKm?: Prisma.Decimal | number | null;
  durationMin: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  driverResponseDeadline?: Date | null;
  candidateDriverIds?: Prisma.InputJsonValue;
  baseCustomerPrice?: Prisma.Decimal | number | null;
  finalCustomerPrice?: Prisma.Decimal | number | null;
  partnerBasePayout?: Prisma.Decimal | number | null;
  finalPartnerPayout?: Prisma.Decimal | number | null;
  platformMargin?: Prisma.Decimal | number | null;
  appliedHolidaySurcharge?: Prisma.Decimal | number | null;
  appliedNightSurcharge?: Prisma.Decimal | number | null;
  pricingSnapshotSource?: string | null;
  totalAmount?: Prisma.Decimal | number | null;
  driverAmount?: Prisma.Decimal | number | null;
  platformFee?: Prisma.Decimal | number | null;
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
}): Promise<BookingRow[]> {
  const where: { driverId?: string; vehicleId?: string } = {};
  if (filters?.driverId !== undefined) where.driverId = filters.driverId;
  if (filters?.vehicleId !== undefined) where.vehicleId = filters.vehicleId;
  try {
    return await prisma.bookings.findMany({
      where,
      select: bookingPayloadSelect,
      orderBy: { bookingAt: "asc" },
    });
  } catch (error) {
    if (!isMissingDriverResponseDeadlineColumn(error)) throw error;
    const rows = await prisma.bookings.findMany({
      where,
      select: bookingPayloadSelectWithoutDeadline,
      orderBy: { bookingAt: "asc" },
    });
    return rows.map(withNullDeadline);
  }
}

export async function listCompletedBookings(
  driverId: string,
  take = 6,
): Promise<BookingRow[]> {
  try {
    return await prisma.bookings.findMany({
      where: { driverId, status: "COMPLETED" },
      select: bookingPayloadSelect,
      orderBy: { bookingAt: "desc" },
      take,
    });
  } catch (error) {
    if (!isMissingDriverResponseDeadlineColumn(error)) throw error;
    const rows = await prisma.bookings.findMany({
      where: { driverId, status: "COMPLETED" },
      select: bookingPayloadSelectWithoutDeadline,
      orderBy: { bookingAt: "desc" },
      take,
    });
    return rows.map(withNullDeadline);
  }
}

export async function findBookingById(id: string): Promise<BookingRow | null> {
  try {
    return await prisma.bookings.findUnique({
      where: { id },
      select: bookingPayloadSelect,
    });
  } catch (error) {
    if (!isMissingDriverResponseDeadlineColumn(error)) throw error;
    const row = await prisma.bookings.findUnique({
      where: { id },
      select: bookingPayloadSelectWithoutDeadline,
    });
    return row ? withNullDeadline(row) : null;
  }
}

export async function createBooking(data: CreateBookingData): Promise<BookingRow> {
  try {
    return await prisma.bookings.create({
      data,
      select: bookingPayloadSelect,
    });
  } catch (error) {
    if (!isMissingDriverResponseDeadlineColumn(error)) throw error;
    const { driverResponseDeadline, ...fallbackData } = data;
    const row = await prisma.bookings.create({
      data: fallbackData,
      select: bookingPayloadSelectWithoutDeadline,
    });
    return withNullDeadline(row);
  }
}

export async function updateBooking(
  id: string,
  data: UpdateBookingData,
): Promise<BookingRow> {
  try {
    return await prisma.bookings.update({
      where: { id },
      data,
      select: bookingPayloadSelect,
    });
  } catch (error) {
    if (!isMissingDriverResponseDeadlineColumn(error)) throw error;
    const { driverResponseDeadline, ...fallbackData } = data;
    const row = await prisma.bookings.update({
      where: { id },
      data: fallbackData,
      select: bookingPayloadSelectWithoutDeadline,
    });
    return withNullDeadline(row);
  }
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
