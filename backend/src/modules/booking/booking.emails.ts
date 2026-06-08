import { sendEmail } from "../../lib/email.js";
import { signPaymentToken } from "../../lib/paymentToken.js";
import {
  computePaymentDeadline,
  formatDeadlineDateTime,
} from "./booking.deadlines.js";
import {
  type BookingEmailData,
  formatPriceEurForEmail,
  formatVehicleClassForEmail,
} from "./booking.emailData.js";
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
import { isHourlyTripType } from "../pricing/marketplacePricing.service.js";

const SITE_ORIGIN =
  process.env.LANDING_ORIGIN?.trim() ||
  process.env.FRONTEND_ORIGIN?.trim() ||
  "http://localhost:3000";

export type { BookingEmailData } from "./booking.emailData.js";

type BookingPaymentReceiptEmailData = BookingEmailData & {
  amountEur: number;
  paymentIntentId?: string;
};

function tripSummaryHtml(
  b: BookingEmailData,
  locale: EmailLocale,
  options?: { includeBookingId?: boolean; amountPaidEur?: number },
): string {
  const copy = getBookingEmailCopy(locale);
  const { date, time } = formatBookingDateTimeZone(b.bookingAt);
  const hourly = isHourlyTripType(b.tripType ?? "one-way");
  const atWord = locale === "fr" ? "à" : "at";
  const rows = [
    emailDetailRow(copy.common.route, `${b.from} → ${b.to}`),
    emailDetailRow(
      hourly ? copy.common.date : copy.common.pickup,
      `${date} ${atWord} ${time}`,
    ),
  ];

  if (hourly) {
    rows.push(emailDetailRow(copy.common.duration, `${b.durationMin} min`));
  }

  const phone = b.clientPhone?.trim();
  if (phone) {
    rows.push(emailDetailRow(copy.common.phone, phone));
  }

  const vehicleName = b.vehicleName?.trim();
  if (vehicleName) {
    rows.push(emailDetailRow(copy.common.vehicle, vehicleName));
  }

  const classLabel = formatVehicleClassForEmail(b.vehicleClass, locale);
  if (classLabel) {
    rows.push(emailDetailRow(copy.common.vehicleClass, classLabel));
  }

  if (b.priceEur != null && Number.isFinite(b.priceEur)) {
    rows.push(
      emailDetailRow(
        copy.common.estimatedPrice,
        formatPriceEurForEmail(b.priceEur, locale),
      ),
    );
  }

  if (options?.amountPaidEur != null && Number.isFinite(options.amountPaidEur)) {
    rows.push(
      emailDetailRow(
        copy.common.amountPaid,
        formatPriceEurForEmail(options.amountPaidEur, locale),
      ),
    );
  }

  const notes = b.notesForDriver?.trim();
  if (notes) {
    rows.push(emailDetailRow(copy.common.notes, notes));
  }

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
  const paymentDeadline = computePaymentDeadline(booking.bookingAt);
  const payBefore = formatDeadlineDateTime(paymentDeadline, locale);
  const token = signPaymentToken(booking.bookingId, booking.bookingAt);
  const paymentUrl = `${SITE_ORIGIN}/${locale}/security-payment/${token}`;

  const html = wrapEmailLayout(`
    ${emailHeading(copy.accepted.heading)}
    ${emailParagraph(`${copy.accepted.greeting(escapeHtml(booking.clientName))}<br>${copy.accepted.body}`)}
    ${tripSummaryHtml(booking, locale)}
    ${emailButton(paymentUrl, copy.accepted.cta, "gold")}
    <p style="color:#999;font-size:13px;text-align:center">
      ${escapeHtml(copy.common.paymentLinkNote(payBefore))}
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

export async function sendBookingAdminCancelledEmail(
  booking: BookingEmailData,
): Promise<void> {
  if (!booking.clientEmail) {
    console.warn(
      `[booking-email] No client email for booking ${booking.bookingId} — skipping admin-cancelled email`,
    );
    return;
  }

  const locale = parseEmailLocale(booking.locale);
  const copy = getBookingEmailCopy(locale);

  const html = wrapEmailLayout(`
    ${emailHeading(copy.adminCancelled.heading)}
    ${emailParagraph(`${copy.adminCancelled.greeting(escapeHtml(booking.clientName))}<br>${copy.adminCancelled.body}`)}
    ${tripSummaryHtml(booking, locale)}
    ${emailParagraph(copy.adminCancelled.followUp)}
    ${emailButton(SITE_ORIGIN, copy.adminCancelled.cta, "dark")}
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: copy.adminCancelled.subject,
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
    ${tripSummaryHtml(booking, locale, {
      includeBookingId: true,
      amountPaidEur: booking.amountEur,
    })}
    ${emailParagraph(copy.receipt.thanks)}
  `);

  await sendEmail({
    to: booking.clientEmail,
    subject: copy.receipt.subject,
    html,
  });
}
