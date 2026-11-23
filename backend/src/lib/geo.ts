/**
 * Single coordinate model for the whole backend.
 * Always an object with named fields — never a `[a, b]` tuple, so lat/lng order
 * cannot be swapped by accident (Mapbox used `[lng, lat]`, Google uses
 * `{ latitude, longitude }`).
 */
export type GeoPoint = { lat: number; lng: number };

/** A place the user picked from autocomplete, verified on the server. */
export type SelectedPlace = {
  placeId: string;
  label: string;
  secondaryText?: string;
  location: GeoPoint;
};

export class GeoValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "GeoValidationError";
  }
}

/**
 * Service area: metropolitan France + Monaco, with a margin that also covers
 * the Italian Riviera border towns (Ventimiglia / Sanremo) and Geneva.
 * Bounding box, not a precise polygon — it only rejects clearly wrong points
 * (swapped lat/lng, 0,0, another continent).
 */
export const SERVICE_AREA = {
  minLat: 41.0,
  maxLat: 51.5,
  minLng: -5.5,
  maxLng: 10.0,
} as const;

export function isValidGeoPoint(value: unknown): value is GeoPoint {
  if (typeof value !== "object" || value === null) return false;
  const { lat, lng } = value as Record<string, unknown>;
  return (
    typeof lat === "number" &&
    typeof lng === "number" &&
    Number.isFinite(lat) &&
    Number.isFinite(lng) &&
    lat >= -90 &&
    lat <= 90 &&
    lng >= -180 &&
    lng <= 180 &&
    !(lat === 0 && lng === 0)
  );
}

export function isInServiceArea(point: GeoPoint): boolean {
  return (
    point.lat >= SERVICE_AREA.minLat &&
    point.lat <= SERVICE_AREA.maxLat &&
    point.lng >= SERVICE_AREA.minLng &&
    point.lng <= SERVICE_AREA.maxLng
  );
}

/**
 * Throws GeoValidationError with a client-readable message.
 * @param label which endpoint ("from" / "to") — used in the message.
 */
export function assertValidGeoPoint(value: unknown, label: string): GeoPoint {
  if (!isValidGeoPoint(value)) {
    throw new GeoValidationError(
      `Invalid coordinates for "${label}": lat must be in [-90, 90], lng in [-180, 180], finite and not 0,0`,
    );
  }
  if (!isInServiceArea(value)) {
    throw new GeoValidationError(
      `Address "${label}" is outside the service area (France / Côte d'Azur)`,
    );
  }
  return { lat: value.lat, lng: value.lng };
}

/** Great-circle distance in metres. Used only to compare two points, never for pricing. */
export function metersBetween(a: GeoPoint, b: GeoPoint): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Builds a GeoPoint from nullable DB columns; null when either side is missing. */
export function geoPointFromColumns(
  lat: number | null | undefined,
  lng: number | null | undefined,
): GeoPoint | null {
  if (lat == null || lng == null) return null;
  const p = { lat, lng };
  return isValidGeoPoint(p) ? p : null;
}
