/**
 * HH:mm у заданій IANA-зоні (для шаблонів WhatsApp тощо).
 * UTC у БД → показ у зоні сервісу (узгоджено з фронтом `dayjs.tz(..., SERVICE_TZ)`).
 */
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
    date: `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}.${String(d.getFullYear())}`,
    time: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
  };
}
