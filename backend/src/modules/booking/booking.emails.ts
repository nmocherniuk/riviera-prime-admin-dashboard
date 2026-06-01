import { sendEmail } from "../../lib/email.js";
import { signPaymentToken } from "../../lib/paymentToken.js";
import {
  emailButton,
  emailDetailRow,
  emailDetailTable,
  emailHeading,
  emailParagraph,
  escapeHtml,
  getBookingEmailCopy,
  parseEmailLocale,
  wrapEmailLayout,
  type EmailLocale,
} from "../../emails/index.js";
import { formatBookingDateTimeZone } from "../whatsapp/formatBookingTime.js";

const SITE_ORIGIN =
  process.env.LANDING_ORIGIN?.trim() ||
  process.env.FRONTEND_ORIGIN?.trim() ||
  "http://localhost:3000";

type BookingEmailData = {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  from: string;
  to: string;
  bookingAt: Date;
  durationMin: number;
  locale?: EmailLocale | string | null;
};

type BookingPaymentReceiptEmailData = BookingEmailData & {
  amountEur: number;
  paymentIntentId?: string;
};

function tripSummaryHtml(
  b: BookingEmailData,
  locale: EmailLocale,
  options?: { includeBookingId?: boolean },
): string {
  const copy = getBookingEmailCopy(locale);
  const { date, time } = formatBookingDateTimeZone(b.bookingAt);
  const rows = [
    emailDetailRow(copy.common.route, `${b.from} → ${b.to}`),
    emailDetailRow(copy.common.date, `${date} at ${time}`),
    emailDetailRow(copy.common.duration, `${b.durationMin} min`),
  ];
  if (options?.includeBookingId) {
    rows.push(emailDetailRow(copy.common.bookingId, b.bookingId));
  }
  return emailDetailTable(rows.join(""));
}

export async function sendBookingPendingEmail(
  booking: BookingEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping pending email`,
    );
    return;
  }

  const locale = parseEmailLocale(booking.locale);
  const copy = getBookingEmailCopy(locale);

  const html = wrapEmailLayout(`
    ${emailHeading(copy.pending.heading)}
    ${emailParagraph(`${copy.pending.greeting(escapeHtml(booking.clientName))}<br>${copy.pending.body}`)}
    ${tripSummaryHtml(booking, locale)}
    ${emailParagraph(copy.pending.followUp)}
    ${emailButton(SITE_ORIGIN, copy.pending.cta, "dark")}
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: copy.pending.subject,
    html,
  });
}

export async function sendBookingAcceptedEmail(
  booking: BookingEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping accepted email`,
    );
    return;
  }

  const locale = parseEmailLocale(booking.locale);
  const copy = getBookingEmailCopy(locale);
  const token = signPaymentToken(booking.bookingId);
  const paymentUrl = `${SITE_ORIGIN}/${locale}/security-payment/${token}`;

  const html = wrapEmailLayout(`
    ${emailHeading(copy.accepted.heading)}
    ${emailParagraph(`${copy.accepted.greeting(escapeHtml(booking.clientName))}<br>${copy.accepted.body}`)}
    ${tripSummaryHtml(booking, locale)}
    ${emailButton(paymentUrl, copy.accepted.cta, "gold")}
    <p style="color:#999;font-size:13px;text-align:center">
      ${escapeHtml(copy.common.paymentLinkNote)}
    </p>
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: copy.accepted.subject,
    html,
  });
}

export async function sendBookingAllRejectedEmail(
  booking: BookingEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping rejected email`,
    );
    return;
  }

  const locale = parseEmailLocale(booking.locale);
  const copy = getBookingEmailCopy(locale);

  const html = wrapEmailLayout(`
    ${emailHeading(copy.rejected.heading)}
    ${emailParagraph(`${copy.rejected.greeting(escapeHtml(booking.clientName))}<br>${copy.rejected.body}`)}
    ${tripSummaryHtml(booking, locale)}
    ${emailParagraph(copy.rejected.followUp)}
    ${emailButton(SITE_ORIGIN, copy.rejected.cta, "dark")}
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: copy.rejected.subject,
    html,
  });
}

export async function sendBookingPaymentReceiptEmail(
  booking: BookingPaymentReceiptEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping payment receipt email`,
    );
    return;
  }

  const locale = parseEmailLocale(booking.locale);
  const copy = getBookingEmailCopy(locale);

  const html = wrapEmailLayout(`
    ${emailHeading(copy.receipt.heading)}
    ${emailParagraph(`${copy.receipt.greeting(escapeHtml(booking.clientName))}<br>${copy.receipt.body}`)}
    ${tripSummaryHtml(booking, locale, { includeBookingId: true })}
    ${emailParagraph(copy.receipt.thanks)}
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: copy.receipt.subject,
    html,
  });
}
