import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  buildComputeRoutesBody,
  computeDrivingRoute,
  parseComputeRoutesResponse,
  parseDurationSeconds,
} from "../src/integrations/google/routes.js";
import { GoogleApiError } from "../src/integrations/google/googleClient.js";
import { captureLogs, FAKE_KEY, header, mockFetch } from "./helpers.js";

const FREJUS = { lat: 43.433, lng: 6.737 };
const NICE = { lat: 43.6974, lng: 7.2706 };

beforeEach(() => {
  process.env.GOOGLE_MAPS_API_KEY = FAKE_KEY;
});
afterEach(() => {
  delete process.env.GOOGLE_MAPS_API_KEY;
});

test("request body: latLng with latitude=lat, longitude=lng; Essentials-only options", () => {
  const body = buildComputeRoutesBody(FREJUS, NICE);
  assert.deepEqual(body.origin, { location: { latLng: { latitude: 43.433, longitude: 6.737 } } });
  assert.deepEqual(body.destination, { location: { latLng: { latitude: 43.6974, longitude: 7.2706 } } });
  assert.equal(body.travelMode, "DRIVE");
  assert.equal(body.routingPreference, "TRAFFIC_UNAWARE");
  assert.equal(body.computeAlternativeRoutes, false);
  // Pro / Enterprise triggers must be absent.
  for (const key of [
    "departureTime",
    "intermediates",
    "optimizeWaypointOrder",
    "extraComputations",
    "routeModifiers",
    "requestedReferenceRoutes",
  ]) {
    assert.ok(!(key in body), `${key} must not be sent`);
  }
});

test("parseDurationSeconds", () => {
  assert.equal(parseDurationSeconds("3120s"), 3120);
  assert.equal(parseDurationSeconds("12.5s"), 12.5);
  assert.equal(parseDurationSeconds("3120"), null);
  assert.equal(parseDurationSeconds(3120), null);
  assert.equal(parseDurationSeconds(undefined), null);
});

test("parseComputeRoutesResponse", () => {
  assert.deepEqual(
    parseComputeRoutesResponse({ routes: [{ distanceMeters: 63_412, duration: "3120s" }] }),
    { distanceKm: 63.412, durationMin: 52 },
  );
  assert.equal(parseComputeRoutesResponse({}), null);
  assert.equal(parseComputeRoutesResponse({ routes: [] }), null);
  assert.equal(parseComputeRoutesResponse({ routes: [{ distanceMeters: 0, duration: "1s" }] }), null);
  assert.equal(parseComputeRoutesResponse({ routes: [{ distanceMeters: 100, duration: 5 }] }), null);
});

test("computeDrivingRoute: URL, key header, exact field mask", async () => {
  const m = mockFetch(() => ({ body: { routes: [{ distanceMeters: 63_412, duration: "3120s" }] } }));
  try {
    const r = await computeDrivingRoute(FREJUS, NICE);
    assert.deepEqual(r, { distanceKm: 63.412, durationMin: 52 });
    const call = m.calls[0]!;
    assert.equal(call.url, "https://routes.googleapis.com/directions/v2:computeRoutes");
    assert.equal(call.init?.method, "POST");
    assert.equal(header(call.init, "X-Goog-FieldMask"), "routes.distanceMeters,routes.duration");
    assert.equal(header(call.init, "X-Goog-Api-Key"), FAKE_KEY);
    assert.ok(!call.url.includes(FAKE_KEY));
  } finally {
    m.restore();
  }
});

test("empty routes → 422 'No driving route'", async () => {
  const m = mockFetch(() => ({ body: {} }));
  try {
    await captureLogs(async () => {
      await assert.rejects(computeDrivingRoute(FREJUS, NICE), (e: unknown) => {
        assert.ok(e instanceof GoogleApiError);
        assert.equal(e.httpStatus, 422);
        return true;
      });
    });
  } finally {
    m.restore();
  }
});
