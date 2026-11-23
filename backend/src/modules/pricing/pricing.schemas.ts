import { z } from "zod";
import {
  hasAnyPlaceQuery,
  hasCompletePlaceQuery,
  placeQueryFields,
} from "../places/places.schemas.js";

export const pricingVehicleParamsSchema = z.object({
  vehicleId: z.string().uuid(),
});

export const savePricingBodySchema = z.object({
  perHour: z.number().nonnegative(),
  perKm: z.number().nonnegative(),
  minimumFare: z.number().nonnegative().optional(),
  holidaySurchargePercent: z.number().nonnegative().optional(),
  nightSurchargePercent: z.number().nonnegative().optional(),
});

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return value;
};

const baseQuoteFields = {
  vehicleId: z.string().uuid(),
  tripType: z.enum(["one-way", "one_way", "hourly"]),
  durationMin: z.preprocess(toNumber, z.number().positive()).optional(),
  ...placeQueryFields,
  /** ISO datetime — used for holiday / night surcharges (default: now). */
  bookingAt: z.string().datetime().optional(),
};

type QuoteShape = {
  tripType: string;
  durationMin?: number | undefined;
  distanceKm?: number | undefined;
} & Parameters<typeof hasCompletePlaceQuery>[0];

function refineQuote(allowDistanceKm: boolean) {
  return (val: QuoteShape, ctx: z.RefinementCtx) => {
    const isOneWay = val.tripType === "one-way" || val.tripType === "one_way";
    for (const side of ["from", "to"] as const) {
      if (hasAnyPlaceQuery(val, side) && !hasCompletePlaceQuery(val, side)) {
        ctx.addIssue({
          code: "custom",
          message: `${side}PlaceId, ${side}Lat and ${side}Lng must be sent together`,
          path: [`${side}PlaceId`],
        });
      }
    }
    const hasPlaces =
      hasCompletePlaceQuery(val, "from") && hasCompletePlaceQuery(val, "to");
    if (isOneWay && !hasPlaces && !(allowDistanceKm && val.distanceKm != null)) {
      ctx.addIssue({
        code: "custom",
        message: allowDistanceKm
          ? "distanceKm or both selected addresses are required for one-way trip"
          : "Both addresses must be selected from suggestions for one-way trip",
        path: ["fromPlaceId"],
      });
    }
    if (val.tripType === "hourly" && val.durationMin == null) {
      ctx.addIssue({
        code: "custom",
        message: "durationMin is required for hourly trip",
        path: ["durationMin"],
      });
    }
  };
}

/** Public (landing): distance always comes from Google Routes, never from the client. */
export const publicPricingQuoteQuerySchema = z
  .object(baseQuoteFields)
  .superRefine(refineQuote(false));

/** Admin: may also price an explicit distanceKm. */
export const adminPricingQuoteQuerySchema = z
  .object({
    ...baseQuoteFields,
    distanceKm: z.preprocess(toNumber, z.number().positive()).optional(),
  })
  .superRefine(refineQuote(true));

export type PublicPricingQuoteQuery = z.infer<typeof publicPricingQuoteQuerySchema>;
export type AdminPricingQuoteQuery = z.infer<typeof adminPricingQuoteQuerySchema>;
