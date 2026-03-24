import { z } from "zod";

export const pricingVehicleParamsSchema = z.object({
  vehicleId: z.string().uuid(),
});

export const savePricingBodySchema = z.object({
  perHour: z.number().nonnegative(),
  perKm: z.number().nonnegative(),
});
