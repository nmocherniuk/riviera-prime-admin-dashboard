import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import { getDashboardOverviewService } from "./dashboard.service.js";

export async function getDashboardOverviewController(
  _req: AuthedRequest,
  res: Response,
) {
  try {
    const overview = await getDashboardOverviewService();
    return res.json({ overview });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Get overview failed";
    return res.status(500).json({ message });
  }
}

