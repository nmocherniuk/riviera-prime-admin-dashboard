/**
 * Google Routes API — computeRoutes, driving distance/duration only.
 * https://developers.google.com/maps/documentation/routes/compute_route_directions
 *
 * Billing: kept on the **Compute Routes Essentials** SKU. Pro/Enterprise are
 * triggered by (per Google's SKU docs) TRAFFIC_AWARE / TRAFFIC_AWARE_OPTIMAL,
 * 11+ intermediate waypoints, optimizeWaypointOrder, location modifiers
 * (side of road, heading, vehicle stopover), toll calculation, traffic on
 * polylines, two-wheeler or large-vehicle routing. None of these are used.
 * `departureTime` is intentionally not sent either.
 *
 * TRAFFIC_UNAWARE: duration is based on average, time-independent conditions,
 * so the same two points always give the same distance → stable price.
 */
import type { GeoPoint } from "../../lib/geo.js";
import { googleFetchJson, requireGoogleApiKey, GoogleApiError } from "./googleClient.js";

const COMPUTE_ROUTES_URL = "https://routes.googleapis.com/directions/v2:computeRoutes";
const ROUTES_FIELD_MASK = "routes.distanceMeters,routes.duration";

export type DrivingRoute = { distanceKm: number; durationMin: number };

export type ComputeRoutesResponse = {
  routes?: Array<{ distanceMeters?: unknown; duration?: unknown }>;
};

function toLatLng(p: GeoPoint) {
  return { location: { latLng: { latitude: p.lat, longitude: p.lng } } };
}

export function buildComputeRoutesBody(from: GeoPoint, to: GeoPoint) {
  return {
    origin: toLatLng(from),
    destination: toLatLng(to),
    travelMode: "DRIVE",
    routingPreference: "TRAFFIC_UNAWARE",
    computeAlternativeRoutes: false,
    languageCode: "fr",
    units: "METRIC",
  };
}

/** Google encodes duration as a string of seconds with an "s" suffix, e.g. "1234s". */
export function parseDurationSeconds(value: unknown): number | null {
  if (typeof value !== "string") return null;
  const m = /^(\d+(?:\.\d+)?)s$/.exec(value.trim());
  if (!m || m[1] === undefined) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

export function parseComputeRoutesResponse(
  data: ComputeRoutesResponse,
): DrivingRoute | null {
  const route = data.routes?.[0];
  if (!route) return null;
  const meters = route.distanceMeters;
  const seconds = parseDurationSeconds(route.duration);
  if (typeof meters !== "number" || !Number.isFinite(meters) || meters <= 0) return null;
  if (seconds == null) return null;
  return { distanceKm: meters / 1000, durationMin: seconds / 60 };
}

export async function computeDrivingRoute(
  from: GeoPoint,
  to: GeoPoint,
): Promise<DrivingRoute> {
  const apiKey = requireGoogleApiKey();
  const data = await googleFetchJson<ComputeRoutesResponse>(
    "routes.computeRoutes",
    COMPUTE_ROUTES_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": ROUTES_FIELD_MASK,
      },
      body: JSON.stringify(buildComputeRoutesBody(from, to)),
    },
    "Route calculation is temporarily unavailable",
  );
  const route = parseComputeRoutesResponse(data);
  if (!route) {
    // Google answered 200 with an empty `routes` (e.g. no road connection).
    console.error("[google:routes.computeRoutes] empty route for given points");
    throw new GoogleApiError("No driving route found between these addresses", 422);
  }
  return route;
}
