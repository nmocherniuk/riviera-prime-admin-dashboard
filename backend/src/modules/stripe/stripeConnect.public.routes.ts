import { Router } from "express";
import {
  driverStripeOnboardingReturnController,
  startDriverStripeOnboardingController,
} from "./stripeConnect.public.controller.js";

const router = Router();

router.get("/stripe/onboarding", startDriverStripeOnboardingController);
router.get("/stripe/onboarding/return", driverStripeOnboardingReturnController);

export default router;
