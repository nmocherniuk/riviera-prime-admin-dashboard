import { sendEmail } from "../../lib/email.js";
import { signPaymentToken } from "../../lib/paymentToken.js";
import { formatBookingDateTimeZone } from "../whatsapp/formatBookingTime.js";

const FRONTEND_ORIGIN = "http://localhost:3000";

type BookingEmailData = {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  from: string;
  to: string;
  bookingAt: Date;
  durationMin: number;
};

type BookingPaymentReceiptEmailData = {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  from: string;
  to: string;
  bookingAt: Date;
  durationMin: number;
  amountEur: number;
  paymentIntentId?: string;
};

function tripSummaryHtml(b: BookingEmailData): string {
  const { date, time } = formatBookingDateTimeZone(b.bookingAt);
  return `
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <tr><td style="padding:8px 0;color:#888">Route</td><td style="padding:8px 0">${b.from} → ${b.to}</td></tr>
      <tr><td style="padding:8px 0;color:#888">Date</td><td style="padding:8px 0">${date} at ${time}</td></tr>
      <tr><td style="padding:8px 0;color:#888">Duration</td><td style="padding:8px 0">${b.durationMin} min</td></tr>
    </table>`;
}

function wrapLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#141414;padding:24px 32px">
      <span style="color:#D4AF35;font-size:22px;font-weight:700;letter-spacing:1px">AUREVIA</span>
    </div>
    <div style="padding:32px">
      ${content}
    </div>
    <div style="padding:16px 32px;background:#fafafa;text-align:center;color:#aaa;font-size:12px">
      &copy; ${new Date().getFullYear()} Aurevia. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

/**
 * Sent right after booking creation, while we are finding an available driver.
 */
export async function sendBookingPendingEmail(
  booking: BookingEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping pending email`,
    );
    return;
  }

  const html = wrapLayout(`
    <h2 style="margin:0 0 8px;color:#141414">We received your booking request</h2>
    <p style="color:#555;line-height:1.6">
      Hello <strong>${booking.clientName}</strong>,<br>
      Thank you for your request. We are currently checking driver availability
      for your trip.
    </p>
    ${tripSummaryHtml(booking)}
    <p style="color:#555;line-height:1.6">
      As soon as a driver confirms, we will email you with the next steps for payment.
    </p>
    <div style="text-align:center;margin:28px 0">
      <a href="${FRONTEND_ORIGIN}"
         style="display:inline-block;padding:14px 40px;background:#141414;color:#D4AF35;
                font-weight:700;font-size:16px;text-decoration:none;border-radius:8px">
        Back to website
      </a>
    </div>
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: "Aurevia — your booking request is being processed",
    html,
  });
}

/**
 * Sent when a driver accepts the trip.
 * Contains a secure payment link (JWT-signed, 72h expiry).
 */
export async function sendBookingAcceptedEmail(
  booking: BookingEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping accepted email`,
    );
    return;
  }

  const token = signPaymentToken(booking.bookingId);
  const paymentUrl = `${FRONTEND_ORIGIN}/security-payment/${token}`;

  const html = wrapLayout(`
    <h2 style="margin:0 0 8px;color:#141414">Your trip is confirmed!</h2>
    <p style="color:#555;line-height:1.6">
      Hello <strong>${booking.clientName}</strong>,<br>
      Great news — a driver has been assigned to your trip.
      To complete your reservation, please proceed with payment.
    </p>
    ${tripSummaryHtml(booking)}
    <div style="text-align:center;margin:28px 0">
      <a href="${paymentUrl}"
         style="display:inline-block;padding:14px 40px;background:#D4AF35;color:#141414;
                font-weight:700;font-size:16px;text-decoration:none;border-radius:8px">
        Pay &amp; Reserve
      </a>
    </div>
    <p style="color:#999;font-size:13px;text-align:center">
      This link is valid for 72 hours and is unique to your booking.
    </p>
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: "Your Aurevia trip is ready — complete payment",
    html,
  });
}

/**
 * Sent when all candidate drivers have rejected.
 */
export async function sendBookingAllRejectedEmail(
  booking: BookingEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping rejected email`,
    );
    return;
  }

  const html = wrapLayout(`
    <h2 style="margin:0 0 8px;color:#141414">No available drivers</h2>
    <p style="color:#555;line-height:1.6">
      Hello <strong>${booking.clientName}</strong>,<br>
      Unfortunately, no drivers are currently available for your requested trip.
      We apologize for the inconvenience.
    </p>
    ${tripSummaryHtml(booking)}
    <p style="color:#555;line-height:1.6">
      Please try booking again later — our driver network is constantly expanding
      and someone may become available soon.
    </p>
    <div style="text-align:center;margin:28px 0">
      <a href="${FRONTEND_ORIGIN}"
         style="display:inline-block;padding:14px 40px;background:#141414;color:#D4AF35;
                font-weight:700;font-size:16px;text-decoration:none;border-radius:8px">
        Try Again
      </a>
    </div>
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: "Aurevia — no drivers available for your trip",
    html,
  });
}

/**
 * Sent after successful payment.
 * This acts as a customer-facing payment receipt from our side.
 */
export async function sendBookingPaymentReceiptEmail(
  booking: BookingPaymentReceiptEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping payment receipt email`,
    );
    return;
  }

  const amount = Number.isFinite(booking.amountEur) ? booking.amountEur : 0;
  const paymentRef = booking.paymentIntentId?.trim();

  const html = wrapLayout(`
    <h2 style="margin:0 0 8px;color:#141414">Payment received ✅</h2>
    <p style="color:#555;line-height:1.6">
      Hello <strong>${booking.clientName}</strong>,<br>
      We confirm that your payment has been received successfully.
    </p>
    ${tripSummaryHtml(booking)}
    <table style="width:100%;border-collapse:collapse;margin:20px 0">
      <tr><td style="padding:8px 0;color:#888">Amount paid</td><td style="padding:8px 0"><strong>${amount.toFixed(2)} EUR</strong></td></tr>
      ${
        paymentRef
          ? `<tr><td style="padding:8px 0;color:#888">Payment reference</td><td style="padding:8px 0">${paymentRef}</td></tr>`
          : ""
      }
      <tr><td style="padding:8px 0;color:#888">Booking ID</td><td style="padding:8px 0">${booking.bookingId}</td></tr>
    </table>
    <p style="color:#555;line-height:1.6">
      Thank you for choosing Aurevia.
    </p>
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: "Aurevia — payment receipt",
    html,
  });
}
