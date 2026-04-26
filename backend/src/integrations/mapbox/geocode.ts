/**
 * Mapbox Geocoding API — address string → lat/lng.
 * Returns null when the token is missing, the query is empty, or no match is found.
 */

import type { LatLng } from "./directions.js";

type MapboxGeocodeResponse = {
  features?: Array<{ center?: [number, number] }>;
};

export async function geocodeAddress(
  query: string | null | undefined,
): Promise<LatLng | null> {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) return null;
  if (!query) return null;
  const trimmed = query.trim();
  if (!trimmed) return null;

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    trimmed,
  )}.json?access_token=${token}&limit=1`;

  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = (await res.json()) as MapboxGeocodeResponse;
    const center = data.features?.[0]?.center;
    if (!center || center.length < 2) return null;
    const [lng, lat] = center;
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}
