/**
 * HTTP-level regression: Express 5 re-parses `req.query` on every access, so the
 * controller must use schema-parsed numbers — otherwise the client-vs-server
 * coordinate check is silently skipped. Google is mocked; the rejected requests
 * never reach the database.
 */
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import type { AddressInfo } from "node:net";
import { FAKE_KEY, mockFetch } from "./helpers.js";

process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/unused";
process.env.GOOGLE_MAPS_API_KEY = FAKE_KEY;

const { default: app } = await import("../src/app.js");
const { __resetPlacesCaches, __seedPlaceLocation } = await import(
  "../src/modules/places/places.service.js"
);

const FREJUS = { lat: 43.43522, lng: 6.7374216 };
const NICE_AIRPORT = { lat: 43.6598704, lng: 7.2142012 };
const VEHICLE = "cafff580-9141-46fe-b2d5-18ea3d9fc543";

let server: http.Server;
let port = 0;
let restoreFetch: () => void;

before(() => {
  __resetPlacesCaches();
  __seedPlaceLocation("frejus", FREJUS);
  __seedPlaceLocation("nce", NICE_AIRPORT);
  // Any Google call in these tests would be a bug — answer with an error.
  restoreFetch = mockFetch(() => ({ status: 500, body: {} })).restore;
  server = app.listen(0);
  port = (server.address() as AddressInfo).port;
});
after(() => {
  restoreFetch();
  server.close();
  delete process.env.GOOGLE_MAPS_API_KEY;
});

function getJson(path: string): Promise<{ status: number; body: { message?: string; code?: string } }> {
  return new Promise((resolve, reject) => {
    http
      .get({ host: "127.0.0.1", port, path }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => resolve({ status: res.statusCode ?? 0, body: JSON.parse(data) }));
      })
      .on("error", reject);
  });
}

function quotePath(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  const q = new URLSearchParams({
    vehicleId: VEHICLE,
    tripType: "one_way",
    fromPlaceId: "frejus",
    fromLat: String(from.lat),
    fromLng: String(from.lng),
    toPlaceId: "nce",
    toLat: String(to.lat),
    toLng: String(to.lng),
  });
  return `/api/public/pricing/quote?${q}`;
}

test("tampered destination coordinates → 400 INVALID_LOCATION", async () => {
  const r = await getJson(quotePath(FREJUS, { lat: NICE_AIRPORT.lat + 0.05, lng: NICE_AIRPORT.lng }));
  assert.equal(r.status, 400);
  assert.equal(r.body.code, "INVALID_LOCATION");
  assert.match(r.body.message ?? "", /do not match/);
});

test("swapped lat/lng for origin → 400 INVALID_LOCATION", async () => {
  const r = await getJson(quotePath({ lat: FREJUS.lng, lng: FREJUS.lat }, NICE_AIRPORT));
  assert.equal(r.status, 400);
  assert.equal(r.body.code, "INVALID_LOCATION");
});

test("search without q → empty list, not a 500", async () => {
  const r = await getJson("/api/public/places/search");
  assert.equal(r.status, 200);
  assert.deepEqual((r.body as { suggestions?: unknown[] }).suggestions, []);
});
