import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import {
  getAdminVehiclePriceQuote,
  getPublicVehiclePriceQuote,
  listVehiclePricing,
  saveVehiclePricing,
} from "./pricing.service.js";
import {
  adminPricingQuoteQuerySchema,
  publicPricingQuoteQuerySchema,
  type AdminPricingQuoteQuery,
  type PublicPricingQuoteQuery,
} from "./pricing.schemas.js";
import type { QuoteInput } from "./pricing.service.js";
import { placeRefFromQuery } from "../places/places.schemas.js";
import { sendGeoError } from "../places/places.http.js";

export async function listPricingController(_req: AuthedRequest, res: Response) {
  try {
    const rows = await listVehiclePricing();
    return res.json({ rows });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List failed";
    return res.status(500).json({ message });
  }
}

export async function savePricingController(req: AuthedRequest, res: Response) {
  try {
    const { vehicleId } = req.params as { vehicleId: string };
    const {
      perHour,
      perKm,
      minimumFare,
      holidaySurchargePercent,
      nightSurchargePercent,
    } = req.body as {
      perHour: number;
      perKm: number;
      minimumFare?: number;
      holidaySurchargePercent?: number;
      nightSurchargePercent?: number;
    };
    const saved = await saveVehiclePricing(vehicleId, {
      perHour,
      perKm,
      minimumFare: minimumFare ?? 0,
      holidaySurchargePercent: holidaySurchargePercent ?? 0,
      nightSurchargePercent: nightSurchargePercent ?? 0,
    });
    if (!saved) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return res.status(500).json({ message });
  }
}

function quoteQueryToInput(
  query: PublicPricingQuoteQuery | AdminPricingQuoteQuery,
): QuoteInput {
  const input: QuoteInput = {
    vehicleId: query.vehicleId,
    tripType: query.tripType,
    from: placeRefFromQuery(query, "from"),
    to: placeRefFromQuery(query, "to"),
  };
  if ("distanceKm" in query && query.distanceKm != null) {
    input.distanceKm = query.distanceKm;
  }
  if (query.durationMin != null) input.durationMin = query.durationMin;
  if (query.bookingAt != null) input.bookingAt = new Date(query.bookingAt);
  return input;
}

export async function publicPricingQuoteController(req: Request, res: Response) {
  try {
    // Express 5: `req.query` is re-parsed on every access, so values coerced by
    // validateQuery are lost — parse again to get real numbers (lat/lng).
    const query: PublicPricingQuoteQuery = publicPricingQuoteQuerySchema.parse(req.query);

    const quote = await getPublicVehiclePriceQuote(quoteQueryToInput(query));

    if (!quote) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.json({ quote });
  } catch (error) {
    if (sendGeoError(res, error)) return;
    const message = error instanceof Error ? error.message : "Quote failed";
    return res.status(500).json({ message });
  }
}

export async function adminPricingQuoteController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const query: AdminPricingQuoteQuery = adminPricingQuoteQuerySchema.parse(req.query);

    const quote = await getAdminVehiclePriceQuote(quoteQueryToInput(query));

    if (!quote) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.json({ quote });
  } catch (error) {
    if (sendGeoError(res, error)) return;
    const message = error instanceof Error ? error.message : "Quote failed";
    return res.status(500).json({ message });
  }
}
