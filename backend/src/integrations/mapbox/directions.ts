/**
 * Mapbox Directions API (driving) — isolated integration layer.
 * Used by pricing quote; behavior unchanged from previous in-module implementation.
 */

import { geocodeAddress } from "./geocode.js";

export type LatLng = { lat: number; lng: number };

type MapboxDirectionsResponse = {
  routes?: Array<{ distance: number; duration: number }>;
};

export async function getRoute(from: LatLng, to: LatLng) {
  const token = process.env.MAPBOX_TOKEN;
  if (!token) throw new Error("MAPBOX_TOKEN is missing");

  const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${from.lng},${from.lat};${to.lng},${to.lat}?access_token=${token}&overview=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("Route lookup failed");
  const data = (await res.json()) as MapboxDirectionsResponse;

  const route = data.routes?.[0];

  if (!route) throw new Error("Route not found");

  return {
    distanceKm: route.distance / 1000,
    durationMin: route.duration / 60,
  };
}

/**
 * Address-based helper: geocode both endpoints and ask Mapbox for the driving route.
 * Returns null on any failure (token missing, empty inputs, Mapbox error) so callers can
 * gracefully fall back instead of failing the whole booking flow.
 */
export async function resolveRouteByAddresses(
  from: string | null | undefined,
  to: string | null | undefined,
): Promise<{ distanceKm: number; durationMin: number } | null> {
  if (!from || !to) return null;
  try {
    const [a, b] = await Promise.all([geocodeAddress(from), geocodeAddress(to)]);
    if (!a || !b) return null;
    const route = await getRoute(a, b);
    if (!Number.isFinite(route.distanceKm) || route.distanceKm <= 0) return null;
    return route;
  } catch {
    return null;
  }
}
