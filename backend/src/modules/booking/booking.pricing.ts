import { prisma } from "../../lib/prisma.js";
import { geoPointFromColumns, type GeoPoint } from "../../lib/geo.js";
import {
  computeBookingPricingSnapshot,
  isHourlyTripType,
  PricingValidationError,
  snapshotToBookingScalars,
} from "../pricing/marketplacePricing.service.js";
import { getDrivingRoute } from "../places/places.service.js";
import { findBookingById } from "./booking.repository.js";

type SnapshotScalars = ReturnType<typeof snapshotToBookingScalars>;

export type BookingPricingDataResult = SnapshotScalars & {
  /** Distance used for the snapshot — either passed in or computed from stored coordinates via Google Routes. */
  resolvedDistanceKm: number | null;
};

/**
 * Distance priority:
 * 1. explicit `distanceKm` (stored value, or admin override);
 * 2. driving route between server-verified coordinates (same cached Routes call as the quote);
 * 3. null → engine falls back to hourly (legacy rows without coordinates — never re-geocoded from text).
 */
async function resolveDistanceIfNeeded(input: {
  tripType: string;
  distanceKm: number | null;
  fromLocation?: GeoPoint | null | undefined;
  toLocation?: GeoPoint | null | undefined;
}): Promise<number | null> {
  if (input.distanceKm != null && input.distanceKm > 0) return input.distanceKm;
  if (isHourlyTripType(input.tripType)) return null;
  if (!input.fromLocation || !input.toLocation) return null;
  const route = await getDrivingRoute(input.fromLocation, input.toLocation);
  return route.distanceKm;
}

/** Produces pricing snapshot scalars + the distance used. Pricing formula is unchanged. */
export async function buildPricingDataForBooking(input: {
  vehicleId: string | null;
  tripType: string;
  bookingAt: Date;
  durationMin: number;
  distanceKm: number | null;
  fromLocation?: GeoPoint | null | undefined;
  toLocation?: GeoPoint | null | undefined;
}): Promise<BookingPricingDataResult> {
  const resolvedDistanceKm = await resolveDistanceIfNeeded({
    tripType: input.tripType,
    distanceKm: input.distanceKm,
    fromLocation: input.fromLocation,
    toLocation: input.toLocation,
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
 * saved without distance but has stored coordinates.
 * Uses only the booking's stored coordinates — address text is never geocoded.
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

  const fromLocation = geoPointFromColumns(row.fromLat, row.fromLng);
  const toLocation = geoPointFromColumns(row.toLat, row.toLng);

  const oneWayMissingDistance =
    !isHourlyTripType(row.tripType) && row.distanceKm == null;
  const canResolveDistance = fromLocation != null && toLocation != null;

  if (hasSnapshot && !(oneWayMissingDistance && canResolveDistance)) return;

  const vehicleId =
    row.vehicleId && row.vehicleId.trim() !== "" ? row.vehicleId : null;

  const built = await buildPricingDataForBooking({
    vehicleId,
    tripType: row.tripType,
    bookingAt: row.bookingAt,
    durationMin: row.durationMin,
    distanceKm: row.distanceKm != null ? Number(row.distanceKm) : null,
    fromLocation,
    toLocation,
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
