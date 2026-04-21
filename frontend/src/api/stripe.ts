import { api } from "./api";

/** Emails the driver a Stripe Connect onboarding link (public return URLs, no admin redirect). */
export async function sendDriverStripeOnboardingEmail(driverId: string) {
  const { data } = await api.post<{ ok: boolean }>(
    "/stripe/send-driver-onboarding-email",
    { driverId },
  );
  return data;
}
