export function formatBookingDateTimeZone(
  d: Date,
  timeZone: string = process.env.BOOKING_DISPLAY_TIMEZONE ?? "Europe/Paris",
): { date: string; time: string } {
  const fmt = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
  const parts = fmt.formatToParts(d);
  const hour = parts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = parts.find((p) => p.type === "minute")?.value ?? "00";
  return {
    date: `${String(d.getUTCDate()).padStart(2, "0")}.${String(d.getUTCMonth() + 1).padStart(2, "0")}.${d.getUTCFullYear()}`,
    time: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
  };
}
