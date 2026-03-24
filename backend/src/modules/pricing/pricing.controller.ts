import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import { listVehiclePricing, saveVehiclePricing } from "./pricing.service.js";

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
    const { perHour, perKm } = req.body as { perHour: number; perKm: number };
    const saved = await saveVehiclePricing(vehicleId, perHour, perKm);
    if (!saved) {
      return res.status(404).json({ message: "Vehicle not found" });
    }
    return res.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Save failed";
    return res.status(500).json({ message });
  }
}
