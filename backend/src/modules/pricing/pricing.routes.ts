import { Router } from "express";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { validateParams } from "../../middleware/validateParams.js";
import {
  adminPricingQuoteController,
  listPricingController,
  savePricingController,
} from "./pricing.controller.js";
import {
  pricingVehicleParamsSchema,
  publicPricingQuoteQuerySchema,
  savePricingBodySchema,
} from "./pricing.schemas.js";
import { validateQuery } from "../../middleware/validateQuery.js";

const router = Router();

router.get("/", requireAuth, listPricingController);
router.get(
  "/admin/quote",
  requireAuth,
  validateQuery(publicPricingQuoteQuerySchema),
  adminPricingQuoteController,
);
router.patch(
  "/:vehicleId",
  requireAuth,
  validateParams(pricingVehicleParamsSchema),
  validateBody(savePricingBodySchema),
  savePricingController,
);

export default router;
