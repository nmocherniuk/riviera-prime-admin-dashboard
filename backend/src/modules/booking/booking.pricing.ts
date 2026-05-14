import { prisma } from "../../lib/prisma.js";
import {
  computeBookingPricingSnapshot,
  isHourlyTripType,
  PricingValidationError,
  snapshotToBookingScalars,
} from "../pricing/marketplacePricing.service.js";
import { resolveRouteByAddresses } from "../../integrations/mapbox/directions.js";
import { findBookingById } from "./booking.repository.js";

type SnapshotScalars = ReturnType<typeof snapshotToBookingScalars>;

export type BookingPricingDataResult = SnapshotScalars & {
  /** Distance used for the snapshot — either passed in or resolved from from/to via Mapbox. */
  resolvedDistanceKm: number | null;
};

async function resolveDistanceIfNeeded(input: {
  tripType: string;
  distanceKm: number | null;
  from?: string | null | undefined;
  to?: string | null | undefined;
}): Promise<number | null> {
  if (input.distanceKm != null && input.distanceKm > 0) return input.distanceKm;
  if (isHourlyTripType(input.tripType)) return null;
  const route = await resolveRouteByAddresses(input.from, input.to);
  if (!route) return null;
  return route.distanceKm;
}

/**
 * Produces pricing snapshot scalars + the distance used.
 * For one-way trips, when `distanceKm` isn't supplied, the backend resolves it from
 * `from`/`to` via Mapbox so the customer price isn't silently downgraded to an
 * hourly fallback (which under-pays the partner).
 */
export async function buildPricingDataForBooking(input: {
  vehicleId: string | null;
  tripType: string;
  bookingAt: Date;
  durationMin: number;
  distanceKm: number | null;
  from?: string | null;
  to?: string | null;
}): Promise<BookingPricingDataResult> {
  const resolvedDistanceKm = await resolveDistanceIfNeeded({
    tripType: input.tripType,
    distanceKm: input.distanceKm,
    from: input.from,
    to: input.to,
  });
  try {
    const snap = await computeBookingPricingSnapshot({
      vehicleId: input.vehicleId,
      tripType: input.tripType,
      bookingAt: input.bookingAt,
      durationMin: input.durationMin,
      distanceKm: resolvedDistanceKm,
    });
    return {
      ...snapshotToBookingScalars(snap),
      resolvedDistanceKm,
    };
  } catch (e) {
    if (e instanceof PricingValidationError) {
      throw new Error(`Pricing: ${e.message}`);
    }
    throw e;
  }
}

/**
 * Recomputes snapshot when missing (legacy rows) or when a one-way booking was
 * saved without distance (would otherwise fall back to hourly, under-paying the partner).
 * Only touches unpaid rows — paid bookings have an immutable pricing snapshot.
 */
export async function ensureBookingPricingSnapshot(
  bookingId: string,
): Promise<void> {
  const row = await findBookingById(bookingId);
  if (!row) return;
  if (row.paymentStatus === "PAID") return;

  const hasSnapshot =
    row.finalCustomerPrice != null &&
    row.finalPartnerPayout != null &&
    row.totalAmount != null;

  const oneWayMissingDistance =
    !isHourlyTripType(row.tripType) && row.distanceKm == null;

  if (hasSnapshot && !oneWayMissingDistance) return;

  const vehicleId =
    row.vehicleId && row.vehicleId.trim() !== "" ? row.vehicleId : null;

  const built = await buildPricingDataForBooking({
    vehicleId,
    tripType: row.tripType,
    bookingAt: row.bookingAt,
    durationMin: row.durationMin,
    distanceKm: row.distanceKm != null ? Number(row.distanceKm) : null,
    from: row.from,
    to: row.to,
  });

  const { resolvedDistanceKm, ...scalars } = built;
  await prisma.bookings.update({
    where: { id: bookingId },
    data: {
      ...scalars,
      ...(resolvedDistanceKm != null ? { distanceKm: resolvedDistanceKm } : {}),
    },
  });
}
