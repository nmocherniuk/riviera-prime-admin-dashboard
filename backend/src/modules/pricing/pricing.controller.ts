import type { Request, Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import {
  getAdminVehiclePriceQuote,
  getPublicVehiclePriceQuote,
  listVehiclePricing,
  saveVehiclePricing,
} from "./pricing.service.js";
import type { PublicPricingQuoteQuery } from "./pricing.schemas.js";

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
  query: PublicPricingQuoteQuery,
): Parameters<typeof getPublicVehiclePriceQuote>[0] {
  const input: Parameters<typeof getPublicVehiclePriceQuote>[0] = {
    vehicleId: query.vehicleId,
    tripType: query.tripType,
  };
  if (query.distanceKm != null) input.distanceKm = query.distanceKm;
  if (query.durationMin != null) input.durationMin = query.durationMin;
  if (query.fromLat != null) input.fromLat = query.fromLat;
  if (query.fromLon != null) input.fromLon = query.fromLon;
  if (query.toLat != null) input.toLat = query.toLat;
  if (query.toLon != null) input.toLon = query.toLon;
  if (query.bookingAt != null) input.bookingAt = new Date(query.bookingAt);
  return input;
}

export async function publicPricingQuoteController(req: Request, res: Response) {
  try {
    const query = req.query as unknown as PublicPricingQuoteQuery;

    const quote = await getPublicVehiclePriceQuote(quoteQueryToInput(query));

    if (!quote) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.json({ quote });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Quote failed";
    return res.status(500).json({ message });
  }
}

export async function adminPricingQuoteController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const query = req.query as unknown as PublicPricingQuoteQuery;

    const quote = await getAdminVehiclePriceQuote(quoteQueryToInput(query));

    if (!quote) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    return res.json({ quote });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Quote failed";
    return res.status(500).json({ message });
  }
}
