import { Router } from "express";
import { requirePublicBookingKey } from "../middleware/requirePublicBookingKey.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import {
  publicBookingIdParamsSchema,
  publicCreateBookingSchema,
} from "../modules/booking/booking.schemas.js";
import {
  createPublicBookingController,
  getPublicBookingByIdController,
} from "../modules/booking/publicBooking.controller.js";
import {
  getPaymentBookingController,
  createPaymentIntentController,
} from "../modules/booking/publicPayment.controller.js";

const router = Router();

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

router.get("/pay/:token", getPaymentBookingController);
router.post("/pay/:token/create-intent", createPaymentIntentController);

export default router;
