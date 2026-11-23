/**
 * Address search + verified coordinates + driving route — the single source of
 * distance for pricing (public quote, booking create, admin edit, payment snapshot).
 *
 * Trust model:
 * - The client only ever sends a Google `placeId` (+ the coordinates it was shown).
 * - Coordinates used for pricing come from our own details lookup:
 *   placeId → location is cached here when /places/details answers, and on a
 *   cache miss we ask Google again (no session token). Client-supplied
 *   coordinates are only compared against that, never used directly.
 * - Route results are cached by exact coordinates, so the quote the customer saw
 *   and the booking created a few minutes later use the same Routes answer.
 */
import {
  assertValidGeoPoint,
  GeoValidationError,
  isValidGeoPoint,
  metersBetween,
  type GeoPoint,
} from "../../lib/geo.js";
import { TtlCache } from "../../lib/ttlCache.js";
import {
  googleAutocomplete,
  googlePlaceLocation,
  type PlaceSuggestion,
} from "../../integrations/google/places.js";
import {
  computeDrivingRoute,
  type DrivingRoute,
} from "../../integrations/google/routes.js";
import { GoogleApiError } from "../../integrations/google/googleClient.js";

export const MIN_SEARCH_CHARS = 3;

/** Client coordinates may differ from ours only by float noise. */
const MAX_CLIENT_DRIFT_METERS = 30;

const placeLocationCache = new TtlCache<GeoPoint>(2 * 60 * 60 * 1000, 10_000);
const routeCache = new TtlCache<DrivingRoute>(30 * 60 * 1000, 5_000);

/** Test hook. */
export function __resetPlacesCaches() {
  placeLocationCache.clear();
  routeCache.clear();
}

export async function searchPlaces(params: {
  q: string;
  lang: string;
  sessionToken?: string | undefined;
}): Promise<PlaceSuggestion[]> {
  const input = params.q.trim();
  if (input.length < MIN_SEARCH_CHARS) return [];
  return googleAutocomplete({
    input,
    lang: params.lang,
    sessionToken: params.sessionToken,
  });
}

/**
 * Called when the user picks a suggestion. With a session token we always call
 * Google: the Details call is what closes the autocomplete session (otherwise
 * every keystroke request is billed separately).
 */
export async function resolvePlaceDetails(params: {
  placeId: string;
  lang: string;
  sessionToken?: string | undefined;
}): Promise<GeoPoint> {
  const cached = params.sessionToken ? undefined : placeLocationCache.get(params.placeId);
  if (cached) return cached;

  const location = await googlePlaceLocation(params);
  if (!location || !isValidGeoPoint(location)) {
    throw new GoogleApiError("Selected address has no coordinates", 404);
  }
  placeLocationCache.set(params.placeId, location);
  return location;
}

export type PlaceRef = { placeId: string; location: GeoPoint };

/**
 * Returns server-trusted coordinates for a place the client claims to have picked.
 * Throws GeoValidationError (→ 400) on mismatch / invalid / outside service area.
 */
export async function verifyPlace(ref: PlaceRef, label: string): Promise<GeoPoint> {
  if (!ref.placeId.trim()) {
    throw new GeoValidationError(`Missing placeId for "${label}"`);
  }
  let trusted = placeLocationCache.get(ref.placeId);
  if (!trusted) {
    const fetched = await googlePlaceLocation({ placeId: ref.placeId });
    if (!fetched || !isValidGeoPoint(fetched)) {
      throw new GeoValidationError(`Address "${label}" could not be verified`);
    }
    placeLocationCache.set(ref.placeId, fetched);
    trusted = fetched;
  }

  if (
    isValidGeoPoint(ref.location) &&
    metersBetween(ref.location, trusted) > MAX_CLIENT_DRIFT_METERS
  ) {
    console.warn(
      `[places] client coordinates for "${label}" differ from placeId lookup; rejected`,
    );
    throw new GeoValidationError(
      `Coordinates for "${label}" do not match the selected address — please pick it again`,
    );
  }

  return assertValidGeoPoint(trusted, label);
}

function routeKey(from: GeoPoint, to: GeoPoint): string {
  const f = (n: number) => n.toFixed(6);
  return `${f(from.lat)},${f(from.lng)};${f(to.lat)},${f(to.lng)}`;
}

/** Driving route between two server-trusted points (cached). */
export async function getDrivingRoute(from: GeoPoint, to: GeoPoint): Promise<DrivingRoute> {
  const a = assertValidGeoPoint(from, "from");
  const b = assertValidGeoPoint(to, "to");
  const key = routeKey(a, b);
  const cached = routeCache.get(key);
  if (cached) return cached;
  const route = await computeDrivingRoute(a, b);
  routeCache.set(key, route);
  return route;
}

/** Test hook: seed the placeId → location cache without calling Google. */
export function __seedPlaceLocation(placeId: string, location: GeoPoint) {
  placeLocationCache.set(placeId, location);
}
