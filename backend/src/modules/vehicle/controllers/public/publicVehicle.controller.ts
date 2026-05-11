import type { Request, Response } from "express";
import { listPublicVehiclesService } from "../../vehicle.service.js";

export async function listPublicVehiclesController(
  req: Request,
  res: Response,
) {
  try {
    const { class: classFilter } = req.query as {
      class?: "comfort" | "business" | "van";
    };
    const vehicles = await listPublicVehiclesService(
      classFilter ? { class: classFilter } : undefined,
    );
    return res.json({ vehicles });
  } catch (error) {
    const message = error instanceof Error ? error.message : "List failed";
    return res.status(500).json({ message });
  }
}
