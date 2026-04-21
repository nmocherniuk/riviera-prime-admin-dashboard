import { prisma } from "../../lib/prisma.js";
import {
  computeBookingPricingSnapshot,
  PricingValidationError,
  snapshotToBookingScalars,
} from "../pricing/marketplacePricing.service.js";
import { findBookingById } from "./booking.repository.js";

export async function buildPricingDataForBooking(input: {
  vehicleId: string | null;
  tripType: string;
  bookingAt: Date;
  durationMin: number;
  distanceKm: number | null;
}) {
  try {
    const snap = await computeBookingPricingSnapshot(input);
    return snapshotToBookingScalars(snap);
  } catch (e) {
    if (e instanceof PricingValidationError) {
      throw new Error(`Pricing: ${e.message}`);
    }
    throw e;
  }
}

/**
 * Recomputes snapshot when missing (legacy rows) or before payment / transfer.
 */
export async function ensureBookingPricingSnapshot(bookingId: string): Promise<void> {
  const row = await findBookingById(bookingId);
  if (!row) return;
  if (
    row.finalCustomerPrice != null &&
    row.finalPartnerPayout != null &&
    row.totalAmount != null
  ) {
    return;
  }
  const vehicleId =
    row.vehicleId && row.vehicleId.trim() !== "" ? row.vehicleId : null;
  const data = await buildPricingDataForBooking({
    vehicleId,
    tripType: row.tripType,
    bookingAt: row.bookingAt,
    durationMin: row.durationMin,
    distanceKm: null,
  });
  await prisma.bookings.update({
    where: { id: bookingId },
    data,
  });
}
