import Stripe from "stripe";

let _stripe: Stripe | undefined;

/** Lazily initialised so the app starts even when STRIPE_SECRET_KEY is not yet set. */
export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) throw new Error("STRIPE_SECRET_KEY must be set");
    _stripe = new Stripe(key);
  }
  return _stripe;
}
