import { z } from "zod";

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

export const publicPricingQuoteQuerySchema = z
  .object({
    vehicleId: z.string().uuid(),
    tripType: z.enum(["one-way", "one_way", "hourly"]),
    distanceKm: z.preprocess(toNumber, z.number().positive()).optional(),
    durationMin: z.preprocess(toNumber, z.number().positive()).optional(),
    fromLat: z.preprocess(toNumber, z.number()).optional(),
    fromLon: z.preprocess(toNumber, z.number()).optional(),
    toLat: z.preprocess(toNumber, z.number()).optional(),
    toLon: z.preprocess(toNumber, z.number()).optional(),
    /** ISO datetime — used for holiday / night surcharges (default: now). */
    bookingAt: z.string().datetime().optional(),
  })
  .superRefine((val, ctx) => {
    const isOneWay = val.tripType === "one-way" || val.tripType === "one_way";
    const hasAllCoords =
      val.fromLat != null &&
      val.fromLon != null &&
      val.toLat != null &&
      val.toLon != null;

    if (isOneWay && val.distanceKm == null && !hasAllCoords) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "distanceKm or coordinates are required for one-way trip",
        path: ["distanceKm"],
      });
    }
    if (
      isOneWay &&
      (val.fromLat != null ||
        val.fromLon != null ||
        val.toLat != null ||
        val.toLon != null) &&
      !hasAllCoords
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All coordinates are required: fromLat, fromLon, toLat, toLon",
        path: ["fromLat"],
      });
    }
    if (val.tripType === "hourly" && val.durationMin == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "durationMin is required for hourly trip",
        path: ["durationMin"],
      });
    }
  });

export type PublicPricingQuoteQuery = z.infer<typeof publicPricingQuoteQuerySchema>;
