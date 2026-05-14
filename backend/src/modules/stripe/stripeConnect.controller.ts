import type { Response } from "express";
import type { AuthedRequest } from "../../middleware/requireAuth.js";
import { sendDriverStripeOnboardingEmail } from "./stripeConnect.service.js";

export async function sendDriverStripeOnboardingEmailController(
  req: AuthedRequest,
  res: Response,
) {
  try {
    const { driverId } = req.body as { driverId: string };
    await sendDriverStripeOnboardingEmail(driverId);
    return res.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to send onboarding email";
    if (message === "Driver not found") {
      return res.status(404).json({ message });
    }
    if (message === "Driver has no email address") {
      return res.status(400).json({ message });
    }
    if (message === "SMTP is not configured") {
      return res.status(503).json({ message });
    }
    console.error("[stripe-connect] email:", error);
    return res.status(500).json({ message });
  }
}
