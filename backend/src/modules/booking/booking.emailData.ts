import type { VehicleClass } from "../../generated/prisma/client.js";
import type { EmailLocale } from "../../emails/locale.js";
import {
  toPublicVehicleClass,
  type PublicVehicleClass,
} from "./booking.vehicleClass.js";

export type BookingEmailData = {
  bookingId: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  from: string;
  to: string;
  bookingAt: Date;
  durationMin: number;
  tripType?: string;
  vehicleName?: string | null;
  vehicleClass?: PublicVehicleClass | null;
  priceEur?: number | null;
  notesForDriver?: string | null;
  locale?: EmailLocale | string | null;
};

type BookingEmailSource = {
  id: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  from: string;
  to: string;
  bookingAt: Date;
  durationMin: number;
  tripType: string;
  notesForDriver: string;
  vehicleClass: VehicleClass | null;
  finalCustomerPrice?: { toString(): string } | number | null;
  totalAmount?: { toString(): string } | number | null;
  vehicle?: { vehicleName: string } | null;
  clientLocale: string;
};

const VEHICLE_CLASS_LABELS: Record<
  EmailLocale,
  Record<PublicVehicleClass, string>
> = {
  en: { comfort: "Comfort", business: "Business", van: "Van" },
  fr: { comfort: "Confort", business: "Affaires", van: "Van" },
};

export function formatVehicleClassForEmail(
  vehicleClass: PublicVehicleClass | null | undefined,
  locale: EmailLocale,
): string | null {
  if (!vehicleClass) return null;
  return VEHICLE_CLASS_LABELS[locale][vehicleClass] ?? vehicleClass;
}

export function formatPriceEurForEmail(
  amount: number,
  locale: EmailLocale,
): string {
  return new Intl.NumberFormat(locale === "fr" ? "fr-FR" : "en-GB", {
    style: "currency",
    currency: "EUR",
  }).format(amount);
}

function resolvePriceEur(row: BookingEmailSource): number | null {
  const raw = row.finalCustomerPrice ?? row.totalAmount;
  if (raw == null) return null;
  const n = Number(raw);
  return Number.isFinite(n) ? n : null;
}

export function toBookingEmailData(row: BookingEmailSource): BookingEmailData {
  return {
    bookingId: row.id,
    clientName: row.clientName,
    clientEmail: row.clientEmail,
    clientPhone: row.clientPhone,
    from: row.from,
    to: row.to,
    bookingAt: row.bookingAt,
    durationMin: row.durationMin,
    tripType: row.tripType,
    vehicleName: row.vehicle?.vehicleName ?? null,
    vehicleClass: toPublicVehicleClass(row.vehicleClass),
    priceEur: resolvePriceEur(row),
    notesForDriver: row.notesForDriver,
    locale: row.clientLocale,
  };
}
