import { prisma } from "../../lib/prisma.js";
import { getRoute } from "../../integrations/mapbox/directions.js";
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

async function resolveQuoteContext(input: {
  tripType: PublicTripType;
  distanceKm?: number;
  durationMin?: number;
  fromLat?: number;
  fromLon?: number;
  toLat?: number;
  toLon?: number;
}): Promise<{
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

  const hasAllCoords =
    input.fromLat != null &&
    input.fromLon != null &&
    input.toLat != null &&
    input.toLon != null;

  let distanceKm: number | null = null;
  let durationForApi: number | null = null;

  if (hasAllCoords) {
    const route = await getRoute(
      { lat: input.fromLat!, lng: input.fromLon! },
      { lat: input.toLat!, lng: input.toLon! },
    );
    distanceKm = route.distanceKm;
    durationForApi = route.durationMin;
  } else {
    distanceKm = input.distanceKm ?? null;
  }

  if (distanceKm == null) {
    throw new Error("distanceKm or coordinates are required for one-way trip");
  }

  const durationForEngine =
    durationForApi ?? Number(input.durationMin ?? 60);

  return { distanceKm, durationForApi, durationForEngine };
}

export async function getPublicVehiclePriceQuote(input: {
  vehicleId: string;
  tripType: PublicTripType;
  distanceKm?: number;
  durationMin?: number;
  fromLat?: number;
  fromLon?: number;
  toLat?: number;
  toLon?: number;
  bookingAt?: Date;
}): Promise<MarketplaceQuotePublic | null> {
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

export async function getAdminVehiclePriceQuote(input: {
  vehicleId: string;
  tripType: PublicTripType;
  distanceKm?: number;
  durationMin?: number;
  fromLat?: number;
  fromLon?: number;
  toLat?: number;
  toLon?: number;
  bookingAt?: Date;
}): Promise<MarketplaceQuoteAdmin | null> {
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
