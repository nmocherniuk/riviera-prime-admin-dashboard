import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../../middleware/requireAuth.js";
import { validateBody } from "../../middleware/validateBody.js";
import { sendDriverStripeOnboardingEmailController } from "./stripeConnect.controller.js";

const router = Router();

const driverOnboardingBodySchema = z.object({
  driverId: z.string().uuid(),
});

router.post(
  "/send-driver-onboarding-email",
  requireAuth,
  validateBody(driverOnboardingBodySchema),
  sendDriverStripeOnboardingEmailController,
);

export default router;
