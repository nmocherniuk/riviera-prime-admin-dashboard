import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import { captureLogs, FAKE_KEY, mockFetch } from "./helpers.js";
import { GeoValidationError } from "../src/lib/geo.js";
import {
  __resetPlacesCaches,
  __seedPlaceLocation,
  getDrivingRoute,
  resolvePlaceDetails,
  searchPlaces,
  verifyPlace,
} from "../src/modules/places/places.service.js";

const FREJUS = { lat: 43.433, lng: 6.737 };
const NICE = { lat: 43.6974, lng: 7.2706 };

beforeEach(() => {
  process.env.GOOGLE_MAPS_API_KEY = FAKE_KEY;
  __resetPlacesCaches();
});
afterEach(() => {
  delete process.env.GOOGLE_MAPS_API_KEY;
});

test("search: fewer than 3 characters → no Google request", async () => {
  const m = mockFetch(() => ({ body: { suggestions: [] } }));
  try {
    assert.deepEqual(await searchPlaces({ q: "  ni ", lang: "fr" }), []);
    assert.equal(m.calls.length, 0);
    await searchPlaces({ q: "nic", lang: "fr" });
    assert.equal(m.calls.length, 1);
  } finally {
    m.restore();
  }
});

test("details populate the cache; verifyPlace then needs no Google call", async () => {
  const m = mockFetch(() => ({ body: { location: { latitude: NICE.lat, longitude: NICE.lng } } }));
  try {
    const loc = await resolvePlaceDetails({ placeId: "nice", lang: "fr", sessionToken: "sess-12345678" });
    assert.deepEqual(loc, NICE);
    assert.equal(m.calls.length, 1);
    const verified = await verifyPlace({ placeId: "nice", location: NICE }, "from");
    assert.deepEqual(verified, NICE);
    assert.equal(m.calls.length, 1, "verify must use the cache");
  } finally {
    m.restore();
  }
});

test("verifyPlace: cache miss → one Details call without session", async () => {
  const m = mockFetch(() => ({ body: { location: { latitude: FREJUS.lat, longitude: FREJUS.lng } } }));
  try {
    const p = await verifyPlace({ placeId: "frejus", location: FREJUS }, "from");
    assert.deepEqual(p, FREJUS);
    assert.equal(m.calls.length, 1);
    assert.equal(new URL(m.calls[0]!.url).searchParams.get("sessionToken"), null);
  } finally {
    m.restore();
  }
});

test("verifyPlace: client coordinates that do not match the place are rejected", async () => {
  __seedPlaceLocation("nice", NICE);
  await captureLogs(async () => {
    await assert.rejects(
      verifyPlace({ placeId: "nice", location: FREJUS }, "from"),
      GeoValidationError,
    );
  });
});

test("verifyPlace: client sending swapped lat/lng is rejected", async () => {
  __seedPlaceLocation("nice", NICE);
  await captureLogs(async () => {
    await assert.rejects(
      verifyPlace({ placeId: "nice", location: { lat: NICE.lng, lng: NICE.lat } }, "from"),
      GeoValidationError,
    );
  });
});

test("verifyPlace: trusted location outside service area is rejected", async () => {
  __seedPlaceLocation("nyc", { lat: 40.7128, lng: -74.006 });
  await assert.rejects(
    verifyPlace({ placeId: "nyc", location: { lat: 40.7128, lng: -74.006 } }, "to"),
    /outside the service area/,
  );
});

test("getDrivingRoute: same points → one Routes call (quote and booking share it)", async () => {
  const m = mockFetch(() => ({ body: { routes: [{ distanceMeters: 63_412, duration: "3120s" }] } }));
  try {
    const quote = await getDrivingRoute(FREJUS, NICE);
    const booking = await getDrivingRoute({ ...FREJUS }, { ...NICE });
    assert.deepEqual(quote, booking);
    assert.equal(m.calls.length, 1);
    await getDrivingRoute(NICE, FREJUS); // reverse direction is a different route
    assert.equal(m.calls.length, 2);
  } finally {
    m.restore();
  }
});

test("getDrivingRoute rejects invalid points before calling Google", async () => {
  const m = mockFetch(() => ({ body: {} }));
  try {
    await assert.rejects(getDrivingRoute({ lat: 0, lng: 0 }, NICE), GeoValidationError);
    assert.equal(m.calls.length, 0);
  } finally {
    m.restore();
  }
});
