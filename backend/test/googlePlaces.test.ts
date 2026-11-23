import { test, beforeEach, afterEach } from "node:test";
import assert from "node:assert/strict";
import {
  googleAutocomplete,
  googlePlaceLocation,
  parseAutocompleteResponse,
  parsePlaceDetailsResponse,
} from "../src/integrations/google/places.js";
import { GoogleApiError } from "../src/integrations/google/googleClient.js";
import { captureLogs, FAKE_KEY, header, mockFetch } from "./helpers.js";

beforeEach(() => {
  process.env.GOOGLE_MAPS_API_KEY = FAKE_KEY;
  process.env.GOOGLE_PLACES_REGION = "fr";
});
afterEach(() => {
  delete process.env.GOOGLE_MAPS_API_KEY;
});

const AUTOCOMPLETE_SAMPLE = {
  suggestions: [
    {
      placePrediction: {
        placeId: "ChIJ_airport",
        text: { text: "Aéroport Nice Côte d'Azur, Nice, France" },
        structuredFormat: {
          mainText: { text: "Aéroport Nice Côte d'Azur" },
          secondaryText: { text: "Nice, France" },
        },
        types: ["airport", "point_of_interest"],
      },
    },
    {
      placePrediction: {
        placeId: "ChIJ_frejus",
        text: { text: "Fréjus, France" },
        structuredFormat: { mainText: { text: "Fréjus" } },
        types: ["locality"],
      },
    },
    { placePrediction: { text: { text: "no id → skipped" } } },
    { queryPrediction: { text: { text: "query predictions are ignored" } } },
  ],
};

test("parseAutocompleteResponse → PlaceSuggestion[]", () => {
  assert.deepEqual(parseAutocompleteResponse(AUTOCOMPLETE_SAMPLE as never), [
    {
      placeId: "ChIJ_airport",
      label: "Aéroport Nice Côte d'Azur",
      secondaryText: "Nice, France",
      fullText: "Aéroport Nice Côte d'Azur, Nice, France",
      isAirport: true,
    },
    {
      placeId: "ChIJ_frejus",
      label: "Fréjus",
      secondaryText: "",
      fullText: "Fréjus, France",
      isAirport: false,
    },
  ]);
  assert.deepEqual(parseAutocompleteResponse({}), []);
});

test("parsePlaceDetailsResponse maps latitude→lat, longitude→lng (no swap)", () => {
  // Nice: latitude ≈ 43.7, longitude ≈ 7.27.
  const p = parsePlaceDetailsResponse({ location: { latitude: 43.6974, longitude: 7.2706 } });
  assert.deepEqual(p, { lat: 43.6974, lng: 7.2706 });
  assert.equal(parsePlaceDetailsResponse({}), null);
  assert.equal(parsePlaceDetailsResponse({ location: { latitude: "43.7", longitude: 7.27 } }), null);
  assert.equal(parsePlaceDetailsResponse({ location: { latitude: Number.NaN, longitude: 7.27 } }), null);
});

test("autocomplete request: POST, key in header only, field mask, region, language, session", async () => {
  const m = mockFetch(() => ({ body: AUTOCOMPLETE_SAMPLE }));
  try {
    const res = await googleAutocomplete({ input: "aeroport nice", lang: "en", sessionToken: "sess-12345678" });
    assert.equal(res.length, 2);
    const call = m.calls[0]!;
    assert.equal(call.url, "https://places.googleapis.com/v1/places:autocomplete");
    assert.equal(call.init?.method, "POST");
    assert.equal(header(call.init, "X-Goog-Api-Key"), FAKE_KEY);
    assert.ok(!call.url.includes(FAKE_KEY));
    assert.match(header(call.init, "X-Goog-FieldMask") ?? "", /suggestions\.placePrediction\.placeId/);
    const body = JSON.parse(String(call.init?.body));
    assert.deepEqual(body, {
      input: "aeroport nice",
      languageCode: "en",
      regionCode: "fr",
      sessionToken: "sess-12345678",
    });
  } finally {
    m.restore();
  }
});

test("details request: field mask is exactly 'location', session token forwarded", async () => {
  const m = mockFetch(() => ({ body: { location: { latitude: 43.6584, longitude: 7.2159 } } }));
  try {
    const p = await googlePlaceLocation({ placeId: "ChIJ_airport", lang: "fr", sessionToken: "sess-12345678" });
    assert.deepEqual(p, { lat: 43.6584, lng: 7.2159 });
    const call = m.calls[0]!;
    const url = new URL(call.url);
    assert.equal(url.origin + url.pathname, "https://places.googleapis.com/v1/places/ChIJ_airport");
    assert.equal(url.searchParams.get("sessionToken"), "sess-12345678");
    assert.equal(header(call.init, "X-Goog-FieldMask"), "location");
    assert.ok(!call.url.includes(FAKE_KEY));
  } finally {
    m.restore();
  }
});

test("Google error → GoogleApiError with client-safe message; log has status but never the key", async () => {
  const m = mockFetch(() => ({
    status: 403,
    body: { error: { code: 403, status: "PERMISSION_DENIED", message: "Places API (New) has not been used" } },
  }));
  try {
    let caught: unknown;
    const logs = await captureLogs(async () => {
      try {
        await googleAutocomplete({ input: "nice", lang: "fr" });
      } catch (e) {
        caught = e;
        throw e;
      }
    });
    assert.ok(caught instanceof GoogleApiError);
    assert.equal(caught.httpStatus, 502);
    assert.equal(caught.message, "Address search is temporarily unavailable");
    assert.match(logs, /HTTP 403 PERMISSION_DENIED/);
    assert.ok(!logs.includes(FAKE_KEY));
  } finally {
    m.restore();
  }
});

test("invalid key (Google 400 'API key not valid') is a server problem → 502, not 400", async () => {
  const m = mockFetch(() => ({
    status: 400,
    body: { error: { code: 400, status: "INVALID_ARGUMENT", message: "API key not valid. Please pass a valid API key." } },
  }));
  try {
    await captureLogs(async () => {
      await assert.rejects(googleAutocomplete({ input: "nice", lang: "fr" }), (e: unknown) => {
        assert.ok(e instanceof GoogleApiError);
        assert.equal(e.httpStatus, 502);
        return true;
      });
    });
  } finally {
    m.restore();
  }
});

test("missing key → 503 'not configured', no request sent", async () => {
  delete process.env.GOOGLE_MAPS_API_KEY;
  const m = mockFetch(() => ({ body: {} }));
  try {
    await captureLogs(async () => {
      await assert.rejects(googleAutocomplete({ input: "nice", lang: "fr" }), (e: unknown) => {
        assert.ok(e instanceof GoogleApiError);
        assert.equal(e.httpStatus, 503);
        return true;
      });
    });
    assert.equal(m.calls.length, 0);
  } finally {
    m.restore();
  }
});
