import type { Request, Response } from "express";
import { verifyStripeOnboardingToken } from "../../lib/stripeOnboardingToken.js";
import {
  createFreshStripeOnboardingRedirect,
  getStripeConnectReturnLandingUrl,
  syncDriverStripeOnboardingStatus,
} from "./stripeConnect.service.js";
import { prisma } from "../../lib/prisma.js";

function readToken(req: Request): string | null {
  const raw = req.query.token;
  if (typeof raw !== "string" || !raw.trim()) return null;
  return raw.trim();
}

/** Public entry from email — always issues a fresh Stripe Account Link. */
export async function startDriverStripeOnboardingController(
  req: Request,
  res: Response,
) {
  const token = readToken(req);
  if (!token) {
    return res.status(400).send("Missing onboarding link.");
  }

  try {
    const driverId = verifyStripeOnboardingToken(token);
    const stripeUrl = await createFreshStripeOnboardingRedirect(driverId);
    return res.redirect(302, stripeUrl);
  } catch (error) {
    console.error("[stripe-connect] public start:", error);
    return res.status(400).send(
      "This onboarding link is invalid or has expired. Ask your administrator to send a new email.",
    );
  }
}

/** Stripe return_url — sync status, then send driver to public landing. */
export async function driverStripeOnboardingReturnController(
  req: Request,
  res: Response,
) {
  const token = readToken(req);
  if (token) {
    try {
      const driverId = verifyStripeOnboardingToken(token);
      const driver = await prisma.drivers.findUnique({
        where: { id: driverId },
        select: {
          id: true,
          stripeAccountId: true,
          stripeOnboardingCompleted: true,
        },
      });
      if (driver) {
        await syncDriverStripeOnboardingStatus(driver);
      }
    } catch (error) {
      console.warn("[stripe-connect] return sync skipped:", error);
    }
  }

  const landing = getStripeConnectReturnLandingUrl();
  const separator = landing.includes("?") ? "&" : "?";
  return res.redirect(302, `${landing}${separator}stripe_onboarding=complete`);
}
