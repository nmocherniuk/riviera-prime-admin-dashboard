import type { Request, Response } from "express";
import { verifyPaymentToken } from "../../../../lib/paymentToken.js";
import { lookupPublicBookingForPayment } from "../../../booking/booking.service.js";
import { getStripe } from "../../../../lib/stripe.js";
import { prisma } from "../../../../lib/prisma.js";

/**
 * GET /api/public/security-payment/:token
 * Validates the signed payment token, returns booking data if valid and unpaid.
 */
export async function getPaymentBookingController(
  req: Request,
  res: Response,
) {
  const { token } = req.params as { token: string };

  let bookingId: string;
  try {
    bookingId = verifyPaymentToken(token);
  } catch {
    return res.status(403).json({ message: "Invalid or expired payment link" });
  }

  try {
    const outcome = await lookupPublicBookingForPayment(bookingId);

    if (outcome.status === "not_found") {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (outcome.status === "already_paid") {
      return res
        .status(409)
        .json({ message: "Booking already paid", booking: outcome.booking });
    }

    return res.json({ booking: outcome.booking });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Lookup failed";
    return res.status(500).json({ message });
  }
}

/**
 * POST /api/public/security-payment/:token/create-intent
 * Creates (or retrieves existing) Stripe PaymentIntent for a valid unpaid booking.
 * Amount is computed server-side — never trusted from the client.
 */
export async function createPaymentIntentController(
  req: Request,
  res: Response,
) {
  const { token } = req.params as { token: string };

  let bookingId: string;
  try {
    bookingId = verifyPaymentToken(token);
  } catch {
    return res.status(403).json({ message: "Invalid or expired payment link" });
  }

  try {
    const outcome = await lookupPublicBookingForPayment(bookingId);

    if (outcome.status === "not_found") {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (outcome.status === "already_paid") {
      return res.status(409).json({ message: "Booking already paid" });
    }

    const booking = outcome.booking;

    if (booking.status !== "assigned") {
      return res
        .status(400)
        .json({ message: "Booking is not ready for payment" });
    }

    const stripe = getStripe();

    const dbRow = await prisma.bookings.findUnique({
      where: { id: bookingId },
      select: { stripePaymentIntentId: true },
    });

    if (dbRow?.stripePaymentIntentId) {
      try {
        const existing = await stripe.paymentIntents.retrieve(
          dbRow.stripePaymentIntentId,
        );
        if (
          existing.status !== "succeeded" &&
          existing.status !== "canceled"
        ) {
          return res.json({ clientSecret: existing.client_secret });
        }
      } catch {
        /* PI not found — create a new one below */
      }
    }

    const amountCents = Math.round(booking.totalPrice * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountCents,
      currency: "eur",
      metadata: { bookingId },
      automatic_payment_methods: { enabled: true },
    });

    await prisma.bookings.update({
      where: { id: bookingId },
      data: { stripePaymentIntentId: paymentIntent.id },
    });

    return res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Payment setup failed";
    console.error("[payment] createPaymentIntent:", error);
    return res.status(500).json({ message });
  }
}
