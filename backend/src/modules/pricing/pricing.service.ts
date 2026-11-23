import { prisma } from "../../lib/prisma.js";
import { getDrivingRoute, verifyPlace } from "../places/places.service.js";
import type { PlaceRefInput } from "../places/places.schemas.js";
import {
  findAllVehiclesWithPricing,
  upsertVehiclePricing,
} from "./pricing.repository.js";
import {
  buildMarketplaceQuote,
  isHourlyTripType,
  PricingValidationError,
  type MarketplaceQuoteAdmin,
  type MarketplaceQuotePublic,
} from "./marketplacePricing.service.js";

const DEFAULT_PER_HOUR = "120.00";
const DEFAULT_PER_KM = "2.50";
const DEFAULT_MIN_FARE = "0";
const DEFAULT_SURCHARGE = "0";

export type PublicTripType = "one-way" | "one_way" | "hourly";

export type VehiclePricingRow = {
  vehicle: {
    id: string;
    vehicleName: string;
    licensePlate: string;
    class: "Comfort" | "Business" | "Van";
  };
  perHour: string;
  perKm: string;
  minimumFare: string;
  holidaySurchargePercent: string;
  nightSurchargePercent: string;
};

function toPublicClass(value: "COMFORT" | "BUSINESS" | "VAN") {
  if (value === "COMFORT") return "Comfort" as const;
  if (value === "BUSINESS") return "Business" as const;
  return "Van" as const;
}

export async function listVehiclePricing(): Promise<VehiclePricingRow[]> {
  const rows = await findAllVehiclesWithPricing();
  return rows.map((row) => ({
    vehicle: {
      id: row.id,
      vehicleName: row.vehicleName,
      licensePlate: row.licensePlate,
      class: toPublicClass(row.class),
    },
    perHour: row.pricing?.perHour.toString() ?? DEFAULT_PER_HOUR,
    perKm: row.pricing?.perKm.toString() ?? DEFAULT_PER_KM,
    minimumFare:
      row.pricing?.minimumFare != null
        ? row.pricing.minimumFare.toString()
        : DEFAULT_MIN_FARE,
    holidaySurchargePercent:
      row.pricing?.holidaySurchargePercent != null
        ? row.pricing.holidaySurchargePercent.toString()
        : DEFAULT_SURCHARGE,
    nightSurchargePercent:
      row.pricing?.nightSurchargePercent != null
        ? row.pricing.nightSurchargePercent.toString()
        : DEFAULT_SURCHARGE,
  }));
}

export async function saveVehiclePricing(
  vehicleId: string,
  data: {
    perHour: number;
    perKm: number;
    minimumFare: number;
    holidaySurchargePercent: number;
    nightSurchargePercent: number;
  },
) {
  const vehicle = await prisma.vehicles.findUnique({ where: { id: vehicleId } });
  if (!vehicle) return null;

  await upsertVehiclePricing(vehicleId, data);
  return true;
}

/** @deprecated Use MarketplaceQuotePublic — kept name for route handlers. */
export type PublicPriceQuote = MarketplaceQuotePublic;

export type QuoteInput = {
  vehicleId: string;
  tripType: PublicTripType;
  /** Admin only — public quote schema does not accept it. */
  distanceKm?: number;
  durationMin?: number;
  from?: PlaceRefInput | null;
  to?: PlaceRefInput | null;
  bookingAt?: Date;
};

/**
 * One-way distance source, shared with booking pricing:
 * selected places → server-verified coordinates → Google Routes (cached).
 */
async function resolveQuoteContext(input: QuoteInput): Promise<{
  distanceKm: number | null;
  durationForApi: number | null;
  durationForEngine: number;
}> {
  if (input.tripType === "hourly") {
    const durationForEngine = Number(input.durationMin ?? 60);
    return {
      distanceKm: null,
      durationForApi: durationForEngine,
      durationForEngine,
    };
  }

  let distanceKm: number | null = null;
  let durationForApi: number | null = null;

  if (input.from && input.to) {
    const [from, to] = await Promise.all([
      verifyPlace(input.from, "from"),
      verifyPlace(input.to, "to"),
    ]);
    const route = await getDrivingRoute(from, to);
    distanceKm = route.distanceKm;
    durationForApi = route.durationMin;
  } else {
    distanceKm = input.distanceKm ?? null;
  }

  if (distanceKm == null) {
    throw new Error("Both selected addresses are required for one-way trip");
  }

  const durationForEngine =
    durationForApi ?? Number(input.durationMin ?? 60);

  return { distanceKm, durationForApi, durationForEngine };
}

export async function getPublicVehiclePriceQuote(input: QuoteInput): Promise<MarketplaceQuotePublic | null> {
  const bookingAt = input.bookingAt ?? new Date();
  const ctx = await resolveQuoteContext(input);
  const tripNormalized = isHourlyTripType(input.tripType)
    ? "hourly"
    : "one-way";

  try {
    return await buildMarketplaceQuote({
      vehicleId: input.vehicleId,
      tripType: tripNormalized,
      durationMin: ctx.durationForEngine,
      distanceKm: ctx.distanceKm,
      bookingAt,
      includeSettlement: false,
      displayDurationMin: ctx.durationForApi,
    });
  } catch (e) {
    if (e instanceof PricingValidationError) {
      throw new Error(e.message);
    }
    throw e;
  }
}

export async function getAdminVehiclePriceQuote(input: QuoteInput): Promise<MarketplaceQuoteAdmin | null> {
  const bookingAt = input.bookingAt ?? new Date();
  const ctx = await resolveQuoteContext(input);
  const tripNormalized = isHourlyTripType(input.tripType)
    ? "hourly"
    : "one-way";

  try {
    return (await buildMarketplaceQuote({
      vehicleId: input.vehicleId,
      tripType: tripNormalized,
      durationMin: ctx.durationForEngine,
      distanceKm: ctx.distanceKm,
      bookingAt,
      includeSettlement: true,
      displayDurationMin: ctx.durationForApi,
    })) as MarketplaceQuoteAdmin | null;
  } catch (e) {
    if (e instanceof PricingValidationError) {
      throw new Error(e.message);
    }
    throw e;
  }
}
