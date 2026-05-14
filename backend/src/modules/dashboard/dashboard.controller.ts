import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import {
  getDashboardOverviewService,
  getDashboardRevenueSeriesService,
} from "./dashboard.service.js";

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

export async function getDashboardRevenueSeriesController(
  _req: AuthedRequest,
  res: Response,
) {
  try {
    const revenueSeries = await getDashboardRevenueSeriesService();
    return res.json({ revenueSeries });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Get revenue series failed";
    return res.status(500).json({ message });
  }
}

