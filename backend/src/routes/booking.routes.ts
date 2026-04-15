import { Router } from "express";
import { requireAuth } from "../middleware/requireAuth.js";
import { validateBody } from "../middleware/validateBody.js";
import { validateParams } from "../middleware/validateParams.js";
import { validateQuery } from "../middleware/validateQuery.js";
import {
  bookingIdParamsSchema,
  driverBookingsGroupedQuerySchema,
  bookingListQuerySchema,
  createBookingSchema,
  updateBookingSchema,
} from "../modules/booking/booking.schemas.js";
import {
  createBookingController,
  deleteBookingController,
  getBookingByIdController,
  listDriverBookingsGroupedController,
  listBookingsController,
  updateBookingController,
} from "../modules/booking/booking.controller.js";

const router = Router();

router.get("/", requireAuth, validateQuery(bookingListQuerySchema), listBookingsController);
router.get(
  "/driver/bookings",
  requireAuth,
  validateQuery(driverBookingsGroupedQuerySchema),
  listDriverBookingsGroupedController,
);
router.get("/:id", requireAuth, validateParams(bookingIdParamsSchema), getBookingByIdController);
router.post("/", requireAuth, validateBody(createBookingSchema), createBookingController);
router.patch(
  "/:id",
  requireAuth,
  validateParams(bookingIdParamsSchema),
  validateBody(updateBookingSchema),
  updateBookingController,
);
router.delete("/:id", requireAuth, validateParams(bookingIdParamsSchema), deleteBookingController);

export default router;

