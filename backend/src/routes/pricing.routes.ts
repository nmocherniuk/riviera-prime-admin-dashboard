import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import {
  listPricingController,
  savePricingController,
} from "../modules/pricing/pricing.controller.js";
import {
  pricingVehicleParamsSchema,
  savePricingBodySchema,
} from "../modules/pricing/pricing.schemas.js";

const router = Router();

router.get("/", requireAuth, listPricingController);
router.patch(
  "/:vehicleId",
  requireAuth,
  validateParams(pricingVehicleParamsSchema),
  validateBody(savePricingBodySchema),
  savePricingController,
);

export default router;
