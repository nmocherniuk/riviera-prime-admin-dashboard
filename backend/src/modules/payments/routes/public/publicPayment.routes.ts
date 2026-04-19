import { Router } from "express";
import {
  createPaymentIntentController,
  getPaymentBookingController,
} from "../../controllers/public/publicPayment.controller.js";

const router = Router();

router.get("/security-payment/:token", getPaymentBookingController);
router.post(
  "/security-payment/:token/create-intent",
  createPaymentIntentController,
);

export default router;
