/**
 * Single coordinate model for the admin app (mirrors backend `src/lib/geo.ts`).
 * Always named fields — never a `[a, b]` tuple.
 */
export type GeoPoint = { lat: number; lng: number };

export type SelectedPlace = {
  placeId: string;
  label: string;
  secondaryText?: string;
  location: GeoPoint;
};

export type PlaceSuggestion = {
  placeId: string;
  label: string;
  secondaryText: string;
  fullText: string;
  isAirport: boolean;
};

/** "43.658400, 7.215900" — always lat first. */
export function formatGeoPoint(p: GeoPoint): string {
  return `${p.lat.toFixed(6)}, ${p.lng.toFixed(6)}`;
}

/** Free Google Maps URL (not a billed API): `query=lat,lng`, optionally pinned to the place id. */
export function googleMapsUrl(p: GeoPoint, placeId?: string | null): string {
  const url = new URL("https://www.google.com/maps/search/");
  url.searchParams.set("api", "1");
  url.searchParams.set("query", `${p.lat},${p.lng}`);
  if (placeId) url.searchParams.set("query_place_id", placeId);
  return url.toString();
}
