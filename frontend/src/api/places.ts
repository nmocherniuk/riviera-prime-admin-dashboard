import axios from "axios";
import { api } from "./api";
import type { GeoPoint, PlaceSuggestion } from "../lib/geo";

/** Same backend endpoints as the landing form (the Google key never reaches the browser). */
export const MIN_PLACE_QUERY_CHARS = 3;

function message(error: unknown, fallback: string): string {
  if (axios.isAxiosError(error)) {
    const m = (error.response?.data as { message?: unknown } | undefined)?.message;
    if (typeof m === "string" && m) return m;
  }
  return fallback;
}

export async function searchPlaces(params: {
  q: string;
  session: string;
  signal?: AbortSignal;
}): Promise<PlaceSuggestion[]> {
  try {
    const { data } = await api.get<{ suggestions?: PlaceSuggestion[] }>(
      "/public/places/search",
      { params: { q: params.q, lang: "fr", session: params.session }, signal: params.signal },
    );
    return Array.isArray(data?.suggestions) ? data.suggestions : [];
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    throw new Error(message(error, "Échec de la recherche d’adresse"), { cause: error });
  }
}

export async function getPlaceLocation(params: {
  placeId: string;
  session: string;
}): Promise<GeoPoint> {
  try {
    const { data } = await api.get<{ location?: GeoPoint }>("/public/places/details", {
      params: { id: params.placeId, lang: "fr", session: params.session },
    });
    const loc = data?.location;
    if (!loc || !Number.isFinite(loc.lat) || !Number.isFinite(loc.lng)) {
      throw new Error("Adresse sans coordonnées");
    }
    return { lat: loc.lat, lng: loc.lng };
  } catch (error) {
    throw new Error(message(error, "Impossible de résoudre l’adresse sélectionnée"), { cause: error });
  }
}
