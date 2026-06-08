import jwt from "jsonwebtoken";
import { paymentTokenExpiresInSeconds } from "../modules/booking/booking.deadlines.js";

type PaymentTokenPayload = {
  bookingId: string;
  purpose: "payment";
};

function getSecret(): string {
  const secret =
    process.env.PAYMENT_TOKEN_SECRET || process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    throw new Error(
      "PAYMENT_TOKEN_SECRET (or JWT_ACCESS_SECRET) must be set",
    );
  }
  return secret;
}

/** Signed payment link — expiry scales with time until pickup. */
export function signPaymentToken(bookingId: string, bookingAt: Date): string {
  const expiresIn = paymentTokenExpiresInSeconds(bookingAt);
  return jwt.sign(
    { bookingId, purpose: "payment" } satisfies PaymentTokenPayload,
    getSecret(),
    { expiresIn },
  );
}

/**
 * Returns bookingId if valid, throws otherwise.
 * Caller should catch and return 401/403.
 */
export function verifyPaymentToken(token: string): string {
  const payload = jwt.verify(token, getSecret()) as jwt.JwtPayload &
    Partial<PaymentTokenPayload>;

  if (payload.purpose !== "payment" || !payload.bookingId) {
    throw new Error("Invalid payment token payload");
  }

  return payload.bookingId;
}
