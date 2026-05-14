import { Router } from "express";
import { requirePublicBookingKey } from "../../../../middleware/requirePublicBookingKey.js";
import { validateBody } from "../../../../middleware/validateBody.js";
import { validateParams } from "../../../../middleware/validateParams.js";
import { validateQuery } from "../../../../middleware/validateQuery.js";
import {
  publicBookingIdParamsSchema,
  publicCreateBookingSchema,
} from "../../booking.validation.js";
import {
  createPublicBookingController,
  getPublicBookingByIdController,
} from "../../controllers/public/publicBooking.controller.js";
import { publicPricingQuoteController } from "../../../pricing/pricing.controller.js";
import { publicPricingQuoteQuerySchema } from "../../../pricing/pricing.schemas.js";

const router = Router();

router.get(
  "/pricing/quote",
  validateQuery(publicPricingQuoteQuerySchema),
  publicPricingQuoteController,
);

router.get(
  "/bookings/:bookingId",
  validateParams(publicBookingIdParamsSchema),
  getPublicBookingByIdController,
);

router.post(
  "/bookings",
  requirePublicBookingKey,
  validateBody(publicCreateBookingSchema),
  createPublicBookingController,
);

export default router;
