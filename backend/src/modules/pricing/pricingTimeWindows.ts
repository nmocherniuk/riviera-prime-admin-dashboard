/**
 * Holiday / night helpers for pricing (Europe/Paris).
 * Configure via env: PRICING_HOLIDAY_DATES, PRICING_COUNT_SUNDAYS_AS_HOLIDAY,
 * PRICING_NIGHT_START_HOUR, PRICING_NIGHT_END_HOUR.
 */

const TZ = "Europe/Paris";

function formatParisYmd(d: Date): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const y = parts.find((p) => p.type === "year")?.value;
  const m = parts.find((p) => p.type === "month")?.value;
  const day = parts.find((p) => p.type === "day")?.value;
  if (!y || !m || !day) return d.toISOString().slice(0, 10);
  return `${y}-${m}-${day}`;
}

export function getParisHour(d: Date): number {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: TZ,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(d);
  const h = parts.find((p) => p.type === "hour")?.value ?? "0";
  return parseInt(h, 10);
}

export function isConfiguredHolidayDate(d: Date): boolean {
  const ymd = formatParisYmd(d);
  const raw = process.env.PRICING_HOLIDAY_DATES?.trim();
  if (raw) {
    const set = new Set(
      raw
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    );
    if (set.has(ymd)) return true;
  }
  if (process.env.PRICING_COUNT_SUNDAYS_AS_HOLIDAY === "true") {
    const wd = new Intl.DateTimeFormat("en-GB", {
      timeZone: TZ,
      weekday: "short",
    }).format(d);
    if (wd === "Sun") return true;
  }
  return false;
}

function isNightHour(h: number, start: number, end: number): boolean {
  if (start === end) return false;
  if (start > end) return h >= start || h < end;
  return h >= start && h < end;
}

/** @returns true when local Paris hour falls in [start,end) night window (wraps past midnight). */
export function isNightPeriod(d: Date): boolean {
  const start = Number(process.env.PRICING_NIGHT_START_HOUR ?? 22);
  const end = Number(process.env.PRICING_NIGHT_END_HOUR ?? 6);
  const h = getParisHour(d);
  return isNightHour(h, start, end);
}
