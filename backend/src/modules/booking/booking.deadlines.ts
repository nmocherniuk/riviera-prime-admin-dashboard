/**
 * Booking time windows — three lead-time tiers:
 *
 * | Lead time   | Driver response      | Pay before pickup |
 * |-------------|----------------------|-------------------|
 * | < 1 h       | 15–20 min            | 10–20 min         |
 * | 1 h – 3 d   | power law (20m→hours)| 1–2 h             |
 * | > 3 d       | up to 24 h           | 4 h               |
 *
 * Payment after accept: min(pickup buffer, acceptedAt + 72 h).
 */

const ONE_HOUR_MS = 60 * 60_000;
const PAYMENT_MAX_AFTER_ACCEPT_MS = 72 * ONE_HOUR_MS;
const THREE_DAYS_MS = 3 * 24 * ONE_HOUR_MS;

const DRIVER_RESPONSE_BASE_MIN = 20;
const PAYMENT_BASE_MIN = 30;
/** 3^exp = 1.5 — anchors 1 h → 20 min driver / 30 min payment, 3 h → 30 / 45 min. */
const LEAD_TIME_EXPONENT = Math.log(1.5) / Math.log(3);

const ABSOLUTE_MIN_MS = 5 * 60_000;
const DRIVER_ABSOLUTE_MIN_MS = 15 * 60_000;
const PAYMENT_ABSOLUTE_MIN_MS = 10 * 60_000;

const DRIVER_ADVANCE_MAX_MS = 24 * ONE_HOUR_MS;
const DRIVER_STANDARD_MAX_MS = 12 * ONE_HOUR_MS;

const ADVANCE_PAYMENT_BUFFER_MS = 4 * ONE_HOUR_MS;
const STANDARD_PAYMENT_BUFFER_MIN_MS = ONE_HOUR_MS;
const STANDARD_PAYMENT_BUFFER_MAX_MS = 2 * ONE_HOUR_MS;

const TRIP_BUFFER_MIN_MS = 5 * 60_000;
const TRIP_BUFFER_MAX_MS = 30 * 60_000;

type LeadTier = "urgent" | "standard" | "advance";

function leadTier(leadMs: number): LeadTier {
  if (leadMs < ONE_HOUR_MS) return "urgent";
  if (leadMs <= THREE_DAYS_MS) return "standard";
  return "advance";
}

function powerLawWindowMs(
  leadHours: number,
  baseMinutes: number,
  minMs: number,
  maxMs: number,
): number {
  const leadH = Math.max(leadHours, 1 / 60);
  const minutes = baseMinutes * Math.pow(leadH, LEAD_TIME_EXPONENT);
  const ms = minutes * 60_000;
  return Math.min(maxMs, Math.max(minMs, ms));
}

function tripBufferMs(leadMs: number): number {
  return Math.max(
    TRIP_BUFFER_MIN_MS,
    Math.min(TRIP_BUFFER_MAX_MS, leadMs * 0.05),
  );
}

/** How long before pickup the client must have paid. */
export function paymentBufferBeforeTripMs(leadMs: number): number {
  if (leadMs <= 0) return TRIP_BUFFER_MIN_MS;

  const tier = leadTier(leadMs);
  if (tier === "urgent") {
    return Math.max(
      10 * 60_000,
      Math.min(20 * 60_000, leadMs * 0.5),
    );
  }
  if (tier === "standard") {
    const leadH = leadMs / ONE_HOUR_MS;
    const maxLeadH = THREE_DAYS_MS / ONE_HOUR_MS;
    const t = Math.min(1, Math.max(0, (leadH - 1) / (maxLeadH - 1)));
    return (
      STANDARD_PAYMENT_BUFFER_MIN_MS +
      t * (STANDARD_PAYMENT_BUFFER_MAX_MS - STANDARD_PAYMENT_BUFFER_MIN_MS)
    );
  }
  return ADVANCE_PAYMENT_BUFFER_MS;
}

function clampDeadline(
  preferredMs: number,
  earliestMs: number,
  latestMs: number,
): Date {
  const clamped = Math.min(Math.max(preferredMs, earliestMs), latestMs);
  return new Date(clamped);
}

function driverResponseWindowMs(leadMs: number): number {
  const tier = leadTier(leadMs);
  if (tier === "urgent") {
    return Math.max(
      DRIVER_ABSOLUTE_MIN_MS,
      Math.min(20 * 60_000, leadMs * 0.75),
    );
  }
  if (tier === "standard") {
    return powerLawWindowMs(
      leadMs / ONE_HOUR_MS,
      DRIVER_RESPONSE_BASE_MIN,
      DRIVER_ABSOLUTE_MIN_MS,
      DRIVER_STANDARD_MAX_MS,
    );
  }
  return DRIVER_ADVANCE_MAX_MS;
}

function driverTripBufferMs(leadMs: number): number {
  if (leadTier(leadMs) === "advance") return TRIP_BUFFER_MAX_MS;
  return tripBufferMs(leadMs);
}

/**
 * When drivers must accept/reject an offer (from booking creation time).
 */
export function computeDriverResponseDeadline(
  bookingAt: Date,
  now: Date = new Date(),
): Date {
  const leadMs = bookingAt.getTime() - now.getTime();
  if (leadMs <= 0) {
    return new Date(now.getTime() + ABSOLUTE_MIN_MS);
  }

  const windowMs = driverResponseWindowMs(leadMs);
  const bufferMs = driverTripBufferMs(leadMs);

  return clampDeadline(
    now.getTime() + windowMs,
    now.getTime() + ABSOLUTE_MIN_MS,
    bookingAt.getTime() - bufferMs,
  );
}

/**
 * When the client must pay after a driver accepts.
 * Never later than 72 h after accept or the pickup buffer — whichever is sooner.
 */
export function computePaymentDeadline(
  bookingAt: Date,
  acceptedAt: Date = new Date(),
): Date {
  const leadMs = bookingAt.getTime() - acceptedAt.getTime();
  if (leadMs <= 0) {
    return new Date(acceptedAt.getTime() + PAYMENT_ABSOLUTE_MIN_MS);
  }

  const tripLatestMs = bookingAt.getTime() - paymentBufferBeforeTripMs(leadMs);
  const acceptLatestMs =
    acceptedAt.getTime() + PAYMENT_MAX_AFTER_ACCEPT_MS;
  const latestMs = Math.min(tripLatestMs, acceptLatestMs);
  const earliestMs = acceptedAt.getTime() + PAYMENT_ABSOLUTE_MIN_MS;

  if (latestMs <= earliestMs) {
    return new Date(Math.max(earliestMs, latestMs));
  }

  const tier = leadTier(leadMs);

  if (tier === "advance") {
    return new Date(latestMs);
  }

  if (tier === "urgent") {
    const windowMs = Math.min(
      latestMs - acceptedAt.getTime(),
      20 * 60_000,
    );
    return clampDeadline(
      acceptedAt.getTime() + windowMs,
      earliestMs,
      latestMs,
    );
  }

  const windowMs = powerLawWindowMs(
    leadMs / ONE_HOUR_MS,
    PAYMENT_BASE_MIN,
    PAYMENT_ABSOLUTE_MIN_MS,
    latestMs - acceptedAt.getTime(),
  );

  return clampDeadline(
    acceptedAt.getTime() + windowMs,
    earliestMs,
    latestMs,
  );
}

export function paymentTokenExpiresInSeconds(
  bookingAt: Date,
  acceptedAt: Date = new Date(),
): number {
  const deadline = computePaymentDeadline(bookingAt, acceptedAt);
  return Math.max(60, Math.ceil((deadline.getTime() - Date.now()) / 1000));
}

/** True when a stored driver deadline looks like a legacy short window for a far-future trip. */
export function shouldRecalculateStaleDriverDeadline(
  bookingAt: Date,
  createdAt: Date,
  driverResponseDeadline: Date | null,
  now: Date = new Date(),
): boolean {
  if (!driverResponseDeadline) return false;

  const leadMs = bookingAt.getTime() - now.getTime();
  const offeredWindowMs =
    driverResponseDeadline.getTime() - createdAt.getTime();
  if (leadMs <= 0 || offeredWindowMs <= 0) return false;

  const tier = leadTier(leadMs);
  if (tier === "advance") {
    return offeredWindowMs < DRIVER_ADVANCE_MAX_MS * 0.9;
  }
  if (leadMs > 2 * ONE_HOUR_MS && offeredWindowMs < 30 * 60_000) {
    return true;
  }
  return false;
}

export function formatDeadlineDateTime(
  date: Date,
  locale: "en" | "fr" = "en",
): string {
  const timeZone = process.env.BOOKING_DISPLAY_TIMEZONE ?? "Europe/Paris";
  const intlLocale = locale === "fr" ? "fr-FR" : "en-GB";
  return new Intl.DateTimeFormat(intlLocale, {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(date);
}
