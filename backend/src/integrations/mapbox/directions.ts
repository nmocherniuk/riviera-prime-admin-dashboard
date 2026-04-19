/**
 * Mapbox Directions API (driving) — isolated integration layer.
 * Used by pricing quote; behavior unchanged from previous in-module implementation.
 */

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
