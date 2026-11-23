import { test } from "node:test";
import assert from "node:assert/strict";
import {
  assertValidGeoPoint,
  GeoValidationError,
  geoPointFromColumns,
  isInServiceArea,
  isValidGeoPoint,
  metersBetween,
} from "../src/lib/geo.js";

const NICE = { lat: 43.6974, lng: 7.2706 };
const FREJUS = { lat: 43.433, lng: 6.737 };

test("valid points pass", () => {
  assert.equal(isValidGeoPoint(NICE), true);
  assert.deepEqual(assertValidGeoPoint(NICE, "from"), NICE);
});

test("rejects out-of-range, non-finite, 0,0 and non-numbers", () => {
  for (const bad of [
    { lat: 91, lng: 7 },
    { lat: -91, lng: 7 },
    { lat: 43, lng: 181 },
    { lat: 43, lng: -181 },
    { lat: Number.NaN, lng: 7 },
    { lat: 43, lng: Number.POSITIVE_INFINITY },
    { lat: 0, lng: 0 },
    { lat: "43.7", lng: "7.27" },
    [43.7, 7.27],
    null,
    undefined,
  ]) {
    assert.equal(isValidGeoPoint(bad), false, JSON.stringify(bad));
    assert.throws(() => assertValidGeoPoint(bad, "from"), GeoValidationError);
  }
});

test("service area: Côte d'Azur, Monaco in; elsewhere out", () => {
  assert.equal(isInServiceArea(NICE), true);
  assert.equal(isInServiceArea(FREJUS), true);
  assert.equal(isInServiceArea({ lat: 43.7396, lng: 7.4276 }), true); // Monaco
  assert.equal(isInServiceArea({ lat: 40.7128, lng: -74.006 }), false); // New York
  assert.throws(
    () => assertValidGeoPoint({ lat: 40.7128, lng: -74.006 }, "to"),
    /outside the service area/,
  );
});

test("swapped lat/lng (Mapbox order) is caught by the service area", () => {
  // Nice written as [lng, lat] → lat 7.27, lng 43.69 (Indian Ocean).
  const swapped = { lat: NICE.lng, lng: NICE.lat };
  assert.equal(isValidGeoPoint(swapped), true);
  assert.equal(isInServiceArea(swapped), false);
  assert.throws(() => assertValidGeoPoint(swapped, "from"), GeoValidationError);
});

test("geoPointFromColumns", () => {
  assert.deepEqual(geoPointFromColumns(43.7, 7.27), { lat: 43.7, lng: 7.27 });
  assert.equal(geoPointFromColumns(null, 7.27), null);
  assert.equal(geoPointFromColumns(43.7, undefined), null);
  assert.equal(geoPointFromColumns(0, 0), null);
});

test("metersBetween: Nice ↔ Fréjus ≈ 51 km straight line", () => {
  const d = metersBetween(NICE, FREJUS);
  assert.ok(d > 49_000 && d < 53_000, String(d));
  assert.equal(metersBetween(NICE, NICE), 0);
});
