/**
 * Marketplace pricing: public (customer) layer + organization settlement + platform margin.
 * Client pays full finalCustomerPrice to the platform Stripe account; on completion we transfer
 * finalPartnerPayout to the connected account; platformMargin remains on the platform balance.
 */

import { prisma } from "../../lib/prisma.js";
import { isConfiguredHolidayDate, isNightPeriod } from "./pricingTimeWindows.js";

const DEFAULT_PER_HOUR = 120;
const DEFAULT_PER_KM = 2.5;

const DEFAULT_COMMISSION_PERCENT = Number(
  process.env.DEFAULT_PLATFORM_COMMISSION_PERCENT ??
    process.env.PLATFORM_COMMISSION_PERCENT ??
    "20",
);

export class PricingValidationError extends Error {
  readonly code = "PRICING_INVALID" as const;
  constructor(message: string) {
    super(message);
    this.name = "PricingValidationError";
  }
}

export type MarketplacePricingSnapshot = {
  baseCustomerPrice: number;
  finalCustomerPrice: number;
  partnerBasePayout: number;
  finalPartnerPayout: number;
  platformMargin: number;
  appliedHolidaySurcharge: number;
  appliedNightSurcharge: number;
  pricingSnapshotSource: string;
  totalAmount: number;
  driverAmount: number;
  platformFee: number;
};

export type MarketplaceQuotePublic = {
  price: number;
  totalPrice: number;
  finalCustomerPrice: number;
  baseCustomerPrice: number;
  appliedHolidaySurcharge: number;
  appliedNightSurcharge: number;
  distanceKm: number | null;
  durationMin: number | null;
};

export type MarketplaceQuoteAdmin = MarketplaceQuotePublic & {
  finalPartnerPayout: number;
  partnerBasePayout: number;
  platformMargin: number;
  commissionPercent: number;
};

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function isHourlyTripType(tripType: string): boolean {
  const t = tripType.toLowerCase();
  return t === "hourly" || t === "hour";
}

type VehiclePublicPricing = {
  perHour: number;
  perKm: number;
  minimumFare: number;
  holidaySurchargePercent: number;
  nightSurchargePercent: number;
};

/** Chauffeur org commercial fields — partner payout floor and surcharges (after commission). */
type OrgSettlement = {
  commissionPercent: number;
  minimumFare: number;
  holidaySurchargePercent: number;
  nightSurchargePercent: number;
};

function num(v: unknown, fallback = 0): number {
  if (v == null) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

async function loadVehiclePublicPricing(
  vehicleId: string,
): Promise<{ pricing: VehiclePublicPricing; organizationId: string | null } | null> {
  const v = await prisma.vehicles.findUnique({
    where: { id: vehicleId },
    select: {
      organizationId: true,
      pricing: true,
    },
  });
  if (!v) return null;
  if (!v.pricing) {
    return {
      organizationId: v.organizationId,
      pricing: {
        perHour: DEFAULT_PER_HOUR,
        perKm: DEFAULT_PER_KM,
        minimumFare: 0,
        holidaySurchargePercent: 0,
        nightSurchargePercent: 0,
      },
    };
  }
  const p = v.pricing;
  return {
    organizationId: v.organizationId,
    pricing: {
      perHour: num(p.perHour, DEFAULT_PER_HOUR),
      perKm: num(p.perKm, DEFAULT_PER_KM),
      minimumFare: num(p.minimumFare, 0),
      holidaySurchargePercent: num(p.holidaySurchargePercent, 0),
      nightSurchargePercent: num(p.nightSurchargePercent, 0),
    },
  };
}

export async function loadOrgSettlement(
  organizationId: string | null,
): Promise<OrgSettlement> {
  if (!organizationId) {
    return {
      commissionPercent: DEFAULT_COMMISSION_PERCENT,
      minimumFare: 0,
      holidaySurchargePercent: 0,
      nightSurchargePercent: 0,
    };
  }
  const d = await prisma.chauffeurOrganizationDetails.findUnique({
    where: { organizationId },
    select: {
      commissionPercent: true,
      minimumFare: true,
      holidaySurchargePercent: true,
      nightSurchargePercent: true,
    },
  });
  if (!d) {
    return {
      commissionPercent: DEFAULT_COMMISSION_PERCENT,
      minimumFare: 0,
      holidaySurchargePercent: 0,
      nightSurchargePercent: 0,
    };
  }
  return {
    commissionPercent:
      d.commissionPercent != null
        ? num(d.commissionPercent)
        : DEFAULT_COMMISSION_PERCENT,
    minimumFare: num(d.minimumFare, 0),
    holidaySurchargePercent: num(d.holidaySurchargePercent, 0),
    nightSurchargePercent: num(d.nightSurchargePercent, 0),
  };
}

function computeRawPublicFare(input: {
  pub: VehiclePublicPricing;
  tripType: string;
  durationMin: number;
  distanceKm: number | null;
}): number {
  if (isHourlyTripType(input.tripType)) {
    return (input.durationMin / 60) * input.pub.perHour;
  }
  if (input.distanceKm != null && input.distanceKm > 0) {
    return input.distanceKm * input.pub.perKm;
  }
  return (input.durationMin / 60) * input.pub.perHour;
}

export function computeMarketplaceSnapshotFromInputs(input: {
  bookingAt: Date;
  tripType: string;
  durationMin: number;
  distanceKm: number | null;
  publicPricing: VehiclePublicPricing;
  settlement: OrgSettlement;
}): MarketplacePricingSnapshot {
  const raw = computeRawPublicFare({
    pub: input.publicPricing,
    tripType: input.tripType,
    durationMin: input.durationMin,
    distanceKm: input.distanceKm,
  });
  const afterMin = round2(
    Math.max(raw, input.publicPricing.minimumFare),
  );
  const holiday = isConfiguredHolidayDate(input.bookingAt);
  const night = isNightPeriod(input.bookingAt);

  let customer = afterMin;
  let appliedHoliday = 0;
  let appliedNight = 0;

  if (holiday && input.publicPricing.holidaySurchargePercent > 0) {
    const next =
      customer * (1 + input.publicPricing.holidaySurchargePercent / 100);
    appliedHoliday = round2(next - customer);
    customer = round2(next);
  }

  if (night && input.publicPricing.nightSurchargePercent > 0) {
    const next =
      customer * (1 + input.publicPricing.nightSurchargePercent / 100);
    appliedNight = round2(next - customer);
    customer = round2(next);
  }

  const finalCustomerPrice = customer;
  const baseCustomerPrice = afterMin;

  let partnerPayout = round2(
    finalCustomerPrice * (1 - input.settlement.commissionPercent / 100),
  );
  const partnerBasePayout = partnerPayout;

  if (holiday && input.settlement.holidaySurchargePercent > 0) {
    partnerPayout = round2(
      partnerPayout *
        (1 + input.settlement.holidaySurchargePercent / 100),
    );
  }
  if (night && input.settlement.nightSurchargePercent > 0) {
    partnerPayout = round2(
      partnerPayout *
        (1 + input.settlement.nightSurchargePercent / 100),
    );
  }

  let finalPartnerPayout = round2(
    Math.max(partnerPayout, input.settlement.minimumFare),
  );

  if (finalPartnerPayout > finalCustomerPrice + 0.001) {
    throw new PricingValidationError(
      "Partner payout would exceed customer price — adjust commission, partner surcharges, or minimums.",
    );
  }

  if (finalPartnerPayout > finalCustomerPrice) {
    finalPartnerPayout = finalCustomerPrice;
  }

  const platformMargin = round2(finalCustomerPrice - finalPartnerPayout);
  if (platformMargin < -0.001) {
    throw new PricingValidationError(
      "Platform margin cannot be negative for this quote.",
    );
  }

  return {
    baseCustomerPrice,
    finalCustomerPrice,
    partnerBasePayout,
    finalPartnerPayout,
    platformMargin: Math.max(0, platformMargin),
    appliedHolidaySurcharge: appliedHoliday,
    appliedNightSurcharge: appliedNight,
    pricingSnapshotSource: "marketplace_v1",
    totalAmount: finalCustomerPrice,
    driverAmount: finalPartnerPayout,
    platformFee: Math.max(0, platformMargin),
  };
}

const fallbackPublic: VehiclePublicPricing = {
  perHour: DEFAULT_PER_HOUR,
  perKm: DEFAULT_PER_KM,
  minimumFare: 0,
  holidaySurchargePercent: 0,
  nightSurchargePercent: 0,
};

async function snapshotWithoutVehicleRow(params: {
  tripType: string;
  bookingAt: Date;
  durationMin: number;
  distanceKm: number | null;
}): Promise<MarketplacePricingSnapshot> {
  const settlement = await loadOrgSettlement(null);
  return computeMarketplaceSnapshotFromInputs({
    bookingAt: params.bookingAt,
    tripType: params.tripType,
    durationMin: params.durationMin,
    distanceKm: params.distanceKm,
    publicPricing: fallbackPublic,
    settlement,
  });
}

export async function computeBookingPricingSnapshot(params: {
  vehicleId: string | null;
  tripType: string;
  bookingAt: Date;
  durationMin: number;
  distanceKm: number | null;
}): Promise<MarketplacePricingSnapshot> {
  if (!params.vehicleId) {
    return snapshotWithoutVehicleRow(params);
  }
  const loaded = await loadVehiclePublicPricing(params.vehicleId);
  if (!loaded) {
    return snapshotWithoutVehicleRow(params);
  }
  const settlement = await loadOrgSettlement(loaded.organizationId);
  return computeMarketplaceSnapshotFromInputs({
    bookingAt: params.bookingAt,
    tripType: params.tripType,
    durationMin: params.durationMin,
    distanceKm: params.distanceKm,
    publicPricing: loaded.pricing,
    settlement,
  });
}

export function snapshotToBookingScalars(
  s: MarketplacePricingSnapshot,
): {
  baseCustomerPrice: number;
  finalCustomerPrice: number;
  partnerBasePayout: number;
  finalPartnerPayout: number;
  platformMargin: number;
  appliedHolidaySurcharge: number;
  appliedNightSurcharge: number;
  pricingSnapshotSource: string;
  totalAmount: number;
  driverAmount: number;
  platformFee: number;
} {
  return {
    baseCustomerPrice: s.baseCustomerPrice,
    finalCustomerPrice: s.finalCustomerPrice,
    partnerBasePayout: s.partnerBasePayout,
    finalPartnerPayout: s.finalPartnerPayout,
    platformMargin: s.platformMargin,
    appliedHolidaySurcharge: s.appliedHolidaySurcharge,
    appliedNightSurcharge: s.appliedNightSurcharge,
    pricingSnapshotSource: s.pricingSnapshotSource,
    totalAmount: s.totalAmount,
    driverAmount: s.driverAmount,
    platformFee: s.platformFee,
  };
}

function snapshotToPublicQuote(
  s: MarketplacePricingSnapshot,
  distanceKm: number | null,
  durationMin: number | null,
): MarketplaceQuotePublic {
  return {
    price: s.finalCustomerPrice,
    totalPrice: s.finalCustomerPrice,
    finalCustomerPrice: s.finalCustomerPrice,
    baseCustomerPrice: s.baseCustomerPrice,
    appliedHolidaySurcharge: s.appliedHolidaySurcharge,
    appliedNightSurcharge: s.appliedNightSurcharge,
    distanceKm,
    durationMin,
  };
}

export async function buildMarketplaceQuote(params: {
  vehicleId: string;
  tripType: string;
  durationMin: number;
  distanceKm: number | null;
  bookingAt: Date;
  includeSettlement: boolean;
  /** Shown on quote (e.g. Mapbox route duration for one-way). */
  displayDurationMin?: number | null;
}): Promise<
  MarketplaceQuotePublic | MarketplaceQuoteAdmin | null
> {
  const loaded = await loadVehiclePublicPricing(params.vehicleId);
  if (!loaded) return null;
  const settlement = await loadOrgSettlement(loaded.organizationId);
  const snap = computeMarketplaceSnapshotFromInputs({
    bookingAt: params.bookingAt,
    tripType: params.tripType,
    durationMin: params.durationMin,
    distanceKm: params.distanceKm,
    publicPricing: loaded.pricing,
    settlement,
  });
  const durationDisplay =
    params.displayDurationMin ?? params.durationMin;
  const base = snapshotToPublicQuote(
    snap,
    params.distanceKm,
    durationDisplay,
  );
  if (!params.includeSettlement) return base;
  return {
    ...base,
    finalPartnerPayout: snap.finalPartnerPayout,
    partnerBasePayout: snap.partnerBasePayout,
    platformMargin: snap.platformMargin,
    commissionPercent: settlement.commissionPercent,
  };
}
