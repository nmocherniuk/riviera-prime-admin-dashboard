import jwt from "jsonwebtoken";

type StripeOnboardingTokenPayload = {
  driverId: string;
  purpose: "stripe_onboarding";
};

/** Email links stay valid long enough to open days later. */
const ONBOARDING_TOKEN_TTL = "30d";

function getSecret(): string {
  const secret =
    process.env.STRIPE_ONBOARDING_TOKEN_SECRET ||
    process.env.PAYMENT_TOKEN_SECRET ||
    process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(
      "STRIPE_ONBOARDING_TOKEN_SECRET (or JWT_ACCESS_SECRET) must be set",
    );
  }
  return secret;
}

export function signStripeOnboardingToken(driverId: string): string {
  return jwt.sign(
    { driverId, purpose: "stripe_onboarding" } satisfies StripeOnboardingTokenPayload,
    getSecret(),
    { expiresIn: ONBOARDING_TOKEN_TTL },
  );
}

export function verifyStripeOnboardingToken(token: string): string {
  const payload = jwt.verify(token, getSecret()) as jwt.JwtPayload &
    Partial<StripeOnboardingTokenPayload>;

  if (payload.purpose !== "stripe_onboarding" || !payload.driverId) {
    throw new Error("Invalid Stripe onboarding token payload");
  }

  return payload.driverId;
}
