import { Router } from "express";
import { requirePublicBookingKey } from "../middleware/requirePublicBookingKey.js";
import { validateBody } from "../middleware/validateBody.js";
import { publicCreateBookingSchema } from "../modules/booking/booking.schemas.js";
import { createPublicBookingController } from "../modules/booking/publicBooking.controller.js";

const router = Router();

router.post(
  "/bookings",
  requirePublicBookingKey,
  validateBody(publicCreateBookingSchema),
  createPublicBookingController,
);

export default router;
