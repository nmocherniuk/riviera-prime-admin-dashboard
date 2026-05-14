import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import {
  getDashboardOverviewController,
  getDashboardRevenueSeriesController,
} from "./dashboard.controller.js";

const router = Router();

router.get("/overview", requireAuth, getDashboardOverviewController);
router.get(
  "/revenue-series",
  requireAuth,
  getDashboardRevenueSeriesController,
);

export default router;
