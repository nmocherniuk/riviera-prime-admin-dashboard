import type Stripe from "stripe";
import { sendEmailOrThrow } from "../../lib/email.js";
import { getStripe } from "../../lib/stripe.js";
import { prisma } from "../../lib/prisma.js";
import { buildDriverStripeOnboardingEmailHtml } from "./stripeDriverOnboarding.email.js";

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

function getStripeConnectReturnUrl(): string {
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

function getStripeConnectRefreshUrl(): string {
  const explicit = process.env.STRIPE_CONNECT_REFRESH_URL?.trim();
  if (explicit) return normalizeBaseUrl(explicit);
  return getStripeConnectReturnUrl();
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

async function createDriverOnboardingLink(driverId: string): Promise<{ url: string }> {
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

  const link = await stripe.accountLinks.create({
    account: accountId,
    refresh_url: getStripeConnectRefreshUrl(),
    return_url: getStripeConnectReturnUrl(),
    type: "account_onboarding",
  });

  if (!link.url) {
    throw new Error("Stripe did not return an onboarding URL");
  }

  return { url: link.url };
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

  const { url } = await createDriverOnboardingLink(driverId);
  const html = buildDriverStripeOnboardingEmailHtml({
    driverName: driver.name,
    onboardingUrl: url,
  });

  await sendEmailOrThrow({
    to: email,
    subject: "Aurevia — connect your Stripe account for payouts",
    html,
  });
}
