/**
 * Google Places API (New) — Autocomplete + Place Details.
 * https://developers.google.com/maps/documentation/places/web-service/place-autocomplete
 *
 * Billing:
 * - Autocomplete requests sharing a `sessionToken` that end with a Place Details
 *   call using the same token are billed as one session.
 * - Place Details requests only the `location` field (Essentials SKU).
 */
import type { GeoPoint } from "../../lib/geo.js";
import {
  getRegionCode,
  googleFetchJson,
  requireGoogleApiKey,
} from "./googleClient.js";

const AUTOCOMPLETE_URL = "https://places.googleapis.com/v1/places:autocomplete";
const DETAILS_URL = "https://places.googleapis.com/v1/places";

const AUTOCOMPLETE_FIELD_MASK = [
  "suggestions.placePrediction.placeId",
  "suggestions.placePrediction.text",
  "suggestions.placePrediction.structuredFormat",
  "suggestions.placePrediction.types",
].join(",");

/** Cheapest Place Details field set (Essentials). Do not add fields without a reason. */
const DETAILS_FIELD_MASK = "location";

/** One autocomplete suggestion as returned to our clients (no coordinates yet). */
export type PlaceSuggestion = {
  placeId: string;
  /** Main line, e.g. "Aéroport Nice Côte d'Azur". */
  label: string;
  /** Second line, e.g. "Nice, France". */
  secondaryText: string;
  /** Full single-line text, e.g. "Aéroport Nice Côte d'Azur, Nice, France". */
  fullText: string;
  isAirport: boolean;
};

type GooglePlacePrediction = {
  placeId?: string;
  text?: { text?: string };
  structuredFormat?: {
    mainText?: { text?: string };
    secondaryText?: { text?: string };
  };
  types?: string[];
};

export type GoogleAutocompleteResponse = {
  suggestions?: Array<{ placePrediction?: GooglePlacePrediction }>;
};

export type GooglePlaceDetailsResponse = {
  location?: { latitude?: unknown; longitude?: unknown };
};

export function parseAutocompleteResponse(
  data: GoogleAutocompleteResponse,
): PlaceSuggestion[] {
  const out: PlaceSuggestion[] = [];
  for (const s of data.suggestions ?? []) {
    const p = s.placePrediction;
    if (!p?.placeId) continue;
    const fullText = p.text?.text?.trim() ?? "";
    const label = p.structuredFormat?.mainText?.text?.trim() || fullText;
    if (!label) continue;
    const secondaryText = p.structuredFormat?.secondaryText?.text?.trim() ?? "";
    out.push({
      placeId: p.placeId,
      label,
      secondaryText,
      fullText: fullText || [label, secondaryText].filter(Boolean).join(", "),
      isAirport: (p.types ?? []).includes("airport"),
    });
  }
  return out;
}

/**
 * Google returns `{ location: { latitude, longitude } }`.
 * Maps explicitly by name to `{ lat, lng }`; returns null on anything malformed.
 */
export function parsePlaceDetailsResponse(
  data: GooglePlaceDetailsResponse,
): GeoPoint | null {
  const lat = data.location?.latitude;
  const lng = data.location?.longitude;
  if (typeof lat !== "number" || typeof lng !== "number") return null;
  if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
  return { lat, lng };
}

export async function googleAutocomplete(params: {
  input: string;
  lang: string;
  sessionToken?: string | undefined;
}): Promise<PlaceSuggestion[]> {
  const apiKey = requireGoogleApiKey();
  const body: Record<string, unknown> = {
    input: params.input,
    languageCode: params.lang,
  };
  const region = getRegionCode();
  if (region) body.regionCode = region;
  if (params.sessionToken) body.sessionToken = params.sessionToken;

  const data = await googleFetchJson<GoogleAutocompleteResponse>(
    "places.autocomplete",
    AUTOCOMPLETE_URL,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": AUTOCOMPLETE_FIELD_MASK,
      },
      body: JSON.stringify(body),
    },
    "Address search is temporarily unavailable",
  );
  return parseAutocompleteResponse(data);
}

export async function googlePlaceLocation(params: {
  placeId: string;
  lang?: string | undefined;
  sessionToken?: string | undefined;
}): Promise<GeoPoint | null> {
  const apiKey = requireGoogleApiKey();
  const url = new URL(`${DETAILS_URL}/${encodeURIComponent(params.placeId)}`);
  if (params.lang) url.searchParams.set("languageCode", params.lang);
  const region = getRegionCode();
  if (region) url.searchParams.set("regionCode", region);
  if (params.sessionToken) url.searchParams.set("sessionToken", params.sessionToken);

  const data = await googleFetchJson<GooglePlaceDetailsResponse>(
    "places.details",
    url.toString(),
    {
      method: "GET",
      headers: {
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": DETAILS_FIELD_MASK,
      },
    },
    "Could not resolve the selected address",
  );
  return parsePlaceDetailsResponse(data);
}
