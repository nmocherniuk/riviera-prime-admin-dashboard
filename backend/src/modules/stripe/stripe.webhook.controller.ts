import type { Request, Response } from "express";
import type Stripe from "stripe";
import { getStripe } from "../../lib/stripe.js";
import { prisma } from "../../lib/prisma.js";
import { isStripeOnboardingCompleted } from "./stripeConnect.service.js";
import { sendBookingPaymentReceiptEmail } from "../booking/booking.emails.js";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function stripeWebhookController(req: Request, res: Response) {
  if (!webhookSecret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not configured");
    res.status(500).json({ error: "Webhook secret not configured" });
    return;
  }

  const signature = req.headers["stripe-signature"];
  if (!signature) {
    console.warn("[stripe-webhook] Missing stripe-signature header");
    res.status(400).json({ error: "Missing stripe-signature header" });
    return;
  }

  let event: Stripe.Event;
  try {
    const rawBody = req.body as Buffer;
    event = getStripe().webhooks.constructEvent(
      rawBody,
      signature,
      webhookSecret,
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(
      `[stripe-webhook] Signature verification failed: ${message}`,
    );
    res.status(400).json({ error: "Webhook signature verification failed" });
    return;
  }

  try {
    switch (event.type) {
      case "payment_intent.succeeded":
        await handlePaymentIntentSucceeded(
          event.data.object as Stripe.PaymentIntent,
        );
        break;

      case "account.updated":
        await handleAccountUpdated(event.data.object as Stripe.Account);
        break;

      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error(
      `[stripe-webhook] Error processing ${event.type}: ${message}`,
    );
  }

  res.status(200).json({ received: true });
}

async function handlePaymentIntentSucceeded(
  paymentIntent: Stripe.PaymentIntent,
) {
  const bookingId = paymentIntent.metadata?.bookingId;

  if (!bookingId) {
    console.warn(
      `[stripe-webhook] payment_intent.succeeded missing metadata.bookingId — PI: ${paymentIntent.id}`,
    );
    return;
  }

  const booking = await prisma.bookings.findUnique({
    where: { id: bookingId },
    select: {
      id: true,
      paymentStatus: true,
      clientName: true,
      clientEmail: true,
      from: true,
      to: true,
      bookingAt: true,
      durationMin: true,
    },
  });

  if (!booking) {
    console.error(
      `[stripe-webhook] Booking not found for id=${bookingId} — PI: ${paymentIntent.id}`,
    );
    return;
  }

  if (booking.paymentStatus === "PAID") {
    console.log(
      `[stripe-webhook] Booking ${bookingId} already PAID — skipping (idempotent)`,
    );
    return;
  }

  await prisma.bookings.update({
    where: { id: bookingId },
    data: {
      paymentStatus: "PAID",
      stripePaymentIntentId: paymentIntent.id,
    },
  });

  console.log(
    `[stripe-webhook] Booking ${bookingId} marked PAID — PI: ${paymentIntent.id}`,
  );

  void sendBookingPaymentReceiptEmail({
    bookingId: booking.id,
    clientName: booking.clientName,
    clientEmail: booking.clientEmail,
    from: booking.from,
    to: booking.to,
    bookingAt: booking.bookingAt,
    durationMin: booking.durationMin,
    amountEur: Number(paymentIntent.amount_received || paymentIntent.amount) / 100,
    paymentIntentId: paymentIntent.id,
  }).catch((error) => {
    console.error(
      `[stripe-webhook] Failed to send payment receipt for booking=${bookingId}:`,
      error,
    );
  });
}

async function handleAccountUpdated(account: Stripe.Account) {
  const completed = isStripeOnboardingCompleted(account);
  const result = await prisma.drivers.updateMany({
    where: { stripeAccountId: account.id },
    data: { stripeOnboardingCompleted: completed },
  });
  if (result.count === 0) {
    console.log(
      `[stripe-webhook] account.updated no driver for account ${account.id}`,
    );
  }
}
