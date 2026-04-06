import type { PaymentStatus } from "../../generated/prisma/client.js";
import { prisma } from "../../lib/prisma.js";
import { sendTripOfferDriverTemplateWithMenu } from "./whatsapp.templates.js";
import { formatBookingDateTimeZone } from "./formatBookingTime.js";

function normalizeWaTo(raw: string): string {
  return raw.replace(/\D/g, "");
}

function labelOrDash(s: string): string {
  const t = s.trim();
  return t || "—";
}

type BookingNotifyRow = {
  id: string;
  clientName: string;
  tripType: string;
  notesForDriver: string;
  from: string;
  to: string;
  bookingAt: Date;
  durationMin: number;
  whatsappPaidTemplateSentAt?: Date | null;
  driver: { phone: string | null } | null;
};

async function findBookingForPaidNotify(
  bookingId: string,
): Promise<BookingNotifyRow | null> {
  const baseSelect = {
    id: true,
    clientName: true,
    tripType: true,
    notesForDriver: true,
    from: true,
    to: true,
    bookingAt: true,
    durationMin: true,
    driver: { select: { phone: true } },
  } as const;
  try {
    return await prisma.bookings.findUnique({
      where: { id: bookingId },
      select: {
        ...baseSelect,
        whatsappPaidTemplateSentAt: true,
      },
    });
  } catch {
    return await prisma.bookings.findUnique({
      where: { id: bookingId },
      select: baseSelect,
    });
  }
}

/**
 * When payment transitions to PAID (and not yet notified), sends Meta template
 * `trip_offer_driver` + follow-up menu. Sets `whatsappPaidTemplateSentAt` only after success.
 */
export async function notifyDriverBookingPaidIfNeeded(
  bookingId: string,
  previousPaymentStatus: PaymentStatus,
  nextPaymentStatus: PaymentStatus,
): Promise<void> {
  if (nextPaymentStatus !== "PAID" || previousPaymentStatus === "PAID") {
    return;
  }

  const booking = await findBookingForPaidNotify(bookingId);
  if (!booking) return;
  if (booking.whatsappPaidTemplateSentAt) return;

  const phoneRaw = booking.driver?.phone;
  const toDigits = phoneRaw ? normalizeWaTo(phoneRaw) : "380665833124";
  if (!toDigits) {
    console.warn(
      `[WhatsApp] Skip trip_offer_driver: no driver phone for booking ${bookingId}`,
    );
    return;
  }

  const fromRoute = labelOrDash(booking.from);
  const toRoute = labelOrDash(booking.to);

  try {
    const { date, time } = formatBookingDateTimeZone(booking.bookingAt);

    await sendTripOfferDriverTemplateWithMenu(toDigits, {
      clientName: booking.clientName,
      tripType: booking.tripType,
      fromRoute,
      toRoute,
      date,
      time,
      notesForDriver:
        booking.notesForDriver.length > 0 ? booking.notesForDriver : "-",
      amountOrExtra: String(booking.durationMin),
    });
  } catch (e) {
    console.error(
      `[WhatsApp] trip_offer_driver failed for booking ${bookingId} (booking saved, will retry on next paid transition):`,
      e,
    );
    return;
  }

  try {
    await prisma.bookings.update({
      where: { id: bookingId },
      data: { whatsappPaidTemplateSentAt: new Date() },
    });
  } catch (markErr) {
    console.warn(
      `[WhatsApp] Could not persist whatsappPaidTemplateSentAt for booking ${bookingId}. Apply migration 20260401120000_bookings_whatsapp_paid_template_sent if missing column.`,
      markErr,
    );
  }
}
