import type Stripe from "stripe";
import { sendEmailOrThrow } from "../../lib/email.js";
import { getStripe } from "../../lib/stripe.js";
import { prisma } from "../../lib/prisma.js";
import { getApiPublicOrigin } from "../../lib/uploads.js";
import { signStripeOnboardingToken } from "../../lib/stripeOnboardingToken.js";
import {
  buildDriverStripeOnboardingEmailHtml,
  STRIPE_ONBOARDING_EMAIL_LOCALE,
} from "./stripeDriverOnboarding.email.js";
import { getStripeOnboardingEmailCopy } from "../../emails/index.js";

function normalizeBaseUrl(raw: string): string {
  return raw.trim().replace(/\/$/, "");
}

function getStripeBusinessProfileUrl(): string {
  const explicit = process.env.STRIPE_BUSINESS_PROFILE_URL?.trim();
  if (explicit) return normalizeBaseUrl(explicit);

  const landing = process.env.LANDING_ORIGIN?.trim();
  if (landing) {
    return normalizeBaseUrl(
      /^https?:\/\//i.test(landing) ? landing : `https://${landing}`,
    );
  }
  return "http://localhost:3000";
}

/** Where drivers land after finishing Stripe onboarding. */
export function getStripeConnectReturnLandingUrl(): string {
  const explicit = process.env.STRIPE_CONNECT_RETURN_URL?.trim();
  if (explicit) return normalizeBaseUrl(explicit);

  const landing = process.env.LANDING_ORIGIN?.trim();
  if (landing) {
    return normalizeBaseUrl(
      /^https?:\/\//i.test(landing) ? landing : `https://${landing}`,
    );
  }
  return "http://localhost:3000";
}

function buildDriverOnboardingPortalUrl(driverId: string): string {
  const token = signStripeOnboardingToken(driverId);
  const origin = getApiPublicOrigin();
  return `${origin}/api/public/stripe/onboarding?token=${encodeURIComponent(token)}`;
}

function buildDriverOnboardingReturnUrl(driverId: string): string {
  const token = signStripeOnboardingToken(driverId);
  const origin = getApiPublicOrigin();
  return `${origin}/api/public/stripe/onboarding/return?token=${encodeURIComponent(token)}`;
}

export function isStripeOnboardingCompleted(account: Stripe.Account): boolean {
  const currentlyDue = account.requirements?.currently_due?.length ?? 0;
  const pastDue = account.requirements?.past_due?.length ?? 0;
  return Boolean(
    account.payouts_enabled &&
    account.details_submitted &&
    currentlyDue === 0 &&
    pastDue === 0,
  );
}

/**
 * Creates a new Stripe Account Link (single-use) and returns the redirect URL.
 * refresh_url points back to our portal so expired links can be reopened from email.
 */
export async function createFreshStripeOnboardingRedirect(
  driverId: string,
): Promise<string> {
  const driver = await prisma.drivers.findUnique({ where: { id: driverId } });
  if (!driver) {
    throw new Error("Driver not found");
  }

  const stripe = getStripe();
  const country = (process.env.STRIPE_CONNECT_DEFAULT_COUNTRY ?? "FR").trim();

  let accountId = driver.stripeAccountId;
  if (!accountId) {
    const createParams: Parameters<typeof stripe.accounts.create>[0] = {
      type: "express",
      country,
      business_type: "individual",
      capabilities: {
        transfers: { requested: true },
      },
      settings: {
        payouts: {
          schedule: { interval: "manual" },
        },
      },
      business_profile: {
        url: getStripeBusinessProfileUrl(),
      },
      metadata: { driverId },
    };
    if (driver.email?.trim()) {
      createParams.email = driver.email.trim();
    }
    const account = await stripe.accounts.create(createParams);
    accountId = account.id;
    await prisma.drivers.update({
      where: { id: driverId },
      data: { stripeAccountId: accountId },
    });
  }

  const portalUrl = buildDriverOnboardingPortalUrl(driverId);
  const returnUrl = buildDriverOnboardingReturnUrl(driverId);

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: portalUrl,
    return_url: returnUrl,
    type: "account_onboarding",
  });

  if (!link.url) {
    throw new Error("Stripe did not return an onboarding URL");
  }

  return link.url;
}

export async function syncDriverStripeOnboardingStatus(driver: {
  id: string;
  stripeAccountId: string | null;
  stripeOnboardingCompleted: boolean | null;
}): Promise<boolean | null> {
  if (!driver.stripeAccountId) return null;

  try {
    const stripe = getStripe();
    const account = await stripe.accounts.retrieve(driver.stripeAccountId);
    const completed = isStripeOnboardingCompleted(account);

    if (driver.stripeOnboardingCompleted !== completed) {
      await prisma.drivers.update({
        where: { id: driver.id },
        data: { stripeOnboardingCompleted: completed },
      });
    }

    return completed;
  } catch (error) {
    console.warn(
      `[stripe-connect] sync status skipped for driver ${driver.id}:`,
      error,
    );
    return null;
  }
}

export async function sendDriverStripeOnboardingEmail(
  driverId: string,
): Promise<void> {
  const driver = await prisma.drivers.findUnique({ where: { id: driverId } });
  if (!driver) {
    throw new Error("Driver not found");
  }
  const email = driver.email?.trim();
  if (!email) {
    throw new Error("Driver has no email address");
  }

  const portalUrl = buildDriverOnboardingPortalUrl(driverId);
  const copy = getStripeOnboardingEmailCopy(STRIPE_ONBOARDING_EMAIL_LOCALE);
  const html = buildDriverStripeOnboardingEmailHtml({
    driverName: driver.name,
    onboardingUrl: portalUrl,
    locale: STRIPE_ONBOARDING_EMAIL_LOCALE,
  });

  await sendEmailOrThrow({
    to: email,
    subject: copy.subject,
    html,
  });
}
