export function formatBookingDateTimeZone(
  d: Date,
  timeZone: string = process.env.BOOKING_DISPLAY_TIMEZONE ?? "Europe/Paris",
): { date: string; time: string } {
  const dateParts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).formatToParts(d);
  const timeParts = new Intl.DateTimeFormat("en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(d);

  const day = dateParts.find((p) => p.type === "day")?.value ?? "01";
  const month = dateParts.find((p) => p.type === "month")?.value ?? "01";
  const year = dateParts.find((p) => p.type === "year")?.value ?? "1970";
  const hour = timeParts.find((p) => p.type === "hour")?.value ?? "00";
  const minute = timeParts.find((p) => p.type === "minute")?.value ?? "00";

  return {
    date: `${day}.${month}.${year}`,
    time: `${hour.padStart(2, "0")}:${minute.padStart(2, "0")}`,
  };
}
