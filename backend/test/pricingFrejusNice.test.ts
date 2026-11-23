/**
 * End-to-end distance → price on a known pair, with Google Routes mocked.
 * The pricing formula itself is the existing one (unchanged); this pins that
 * only the distance source changed.
 */
import { test, after } from "node:test";
import assert from "node:assert/strict";
import { FAKE_KEY, mockFetch } from "./helpers.js";

// marketplacePricing.service imports the Prisma client, which requires a URL
// (no connection is opened by these pure functions).
process.env.DATABASE_URL ??= "postgresql://test:test@localhost:5432/unused";
process.env.GOOGLE_MAPS_API_KEY = FAKE_KEY;

const { computeMarketplaceSnapshotFromInputs } = await import(
  "../src/modules/pricing/marketplacePricing.service.js"
);
const { getDrivingRoute, __resetPlacesCaches } = await import(
  "../src/modules/places/places.service.js"
);

after(() => {
  delete process.env.GOOGLE_MAPS_API_KEY;
});

const FREJUS = { lat: 43.433, lng: 6.737 };
const NICE = { lat: 43.6974, lng: 7.2706 };

test("Fréjus → Nice: 63.412 km × 2.49 €/km = 157.90 €", async () => {
  __resetPlacesCaches();
  const m = mockFetch(() => ({ body: { routes: [{ distanceMeters: 63_412, duration: "3120s" }] } }));
  try {
    const route = await getDrivingRoute(FREJUS, NICE);
    assert.equal(route.distanceKm, 63.412);
    assert.equal(route.durationMin, 52);

    const snap = computeMarketplaceSnapshotFromInputs({
      // Wednesday 10:00 Paris — no night / holiday surcharge.
      bookingAt: new Date("2026-12-02T10:00:00+01:00"),
      tripType: "one-way",
      durationMin: 100,
      distanceKm: route.distanceKm,
      publicPricing: {
        perHour: 120,
        perKm: 2.49,
        minimumFare: 0,
        holidaySurchargePercent: 0,
        nightSurchargePercent: 0,
      },
      settlement: {
        commissionPercent: 20,
        minimumFare: 0,
        holidaySurchargePercent: 0,
        nightSurchargePercent: 0,
      },
    });
    assert.equal(snap.finalCustomerPrice, 157.9);
    assert.equal(snap.finalPartnerPayout, 126.32);
    assert.equal(snap.platformMargin, 31.58);
  } finally {
    m.restore();
  }
});

test("one-way duration does not affect price (only distance does)", () => {
  const base = {
    bookingAt: new Date("2026-12-02T10:00:00+01:00"),
    tripType: "one-way",
    distanceKm: 63.412,
    publicPricing: { perHour: 120, perKm: 2.49, minimumFare: 0, holidaySurchargePercent: 0, nightSurchargePercent: 0 },
    settlement: { commissionPercent: 20, minimumFare: 0, holidaySurchargePercent: 0, nightSurchargePercent: 0 },
  };
  const a = computeMarketplaceSnapshotFromInputs({ ...base, durationMin: 52 });
  const b = computeMarketplaceSnapshotFromInputs({ ...base, durationMin: 100 });
  assert.equal(a.finalCustomerPrice, b.finalCustomerPrice);
});
