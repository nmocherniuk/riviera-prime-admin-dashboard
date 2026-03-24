import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { getDashboardOverviewController } from "../modules/dashboard/dashboard.controller.js";

const router = Router();

router.get("/overview", requireAuth, getDashboardOverviewController);

export default router;

