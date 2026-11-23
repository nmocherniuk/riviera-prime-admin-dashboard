import { z } from "zod";

/** Shape-only checks; range / service-area checks happen in `verifyPlace`. */
export const geoPointSchema = z.object({
  lat: z.number().finite(),
  lng: z.number().finite(),
});

/** Body form of a picked address: `{ placeId, location: { lat, lng } }`. */
export const placeRefSchema = z.object({
  placeId: z.string().trim().min(1).max(300),
  location: geoPointSchema,
});

export type PlaceRefInput = z.infer<typeof placeRefSchema>;

const toNumber = (value: unknown) => {
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim() !== "") return Number(value);
  return value;
};

/** Flat query-string form (GET): fromPlaceId/fromLat/fromLng, toPlaceId/toLat/toLng. */
export const placeQueryFields = {
  fromPlaceId: z.string().trim().min(1).max(300).optional(),
  fromLat: z.preprocess(toNumber, z.number().finite()).optional(),
  fromLng: z.preprocess(toNumber, z.number().finite()).optional(),
  toPlaceId: z.string().trim().min(1).max(300).optional(),
  toLat: z.preprocess(toNumber, z.number().finite()).optional(),
  toLng: z.preprocess(toNumber, z.number().finite()).optional(),
};

type PlaceQuery = {
  fromPlaceId?: string | undefined;
  fromLat?: number | undefined;
  fromLng?: number | undefined;
  toPlaceId?: string | undefined;
  toLat?: number | undefined;
  toLng?: number | undefined;
};

export function placeRefFromQuery(
  q: PlaceQuery,
  side: "from" | "to",
): PlaceRefInput | null {
  const placeId = side === "from" ? q.fromPlaceId : q.toPlaceId;
  const lat = side === "from" ? q.fromLat : q.toLat;
  const lng = side === "from" ? q.fromLng : q.toLng;
  if (!placeId || lat == null || lng == null) return null;
  return { placeId, location: { lat, lng } };
}

export function hasCompletePlaceQuery(q: PlaceQuery, side: "from" | "to"): boolean {
  return placeRefFromQuery(q, side) !== null;
}

export function hasAnyPlaceQuery(q: PlaceQuery, side: "from" | "to"): boolean {
  return side === "from"
    ? q.fromPlaceId != null || q.fromLat != null || q.fromLng != null
    : q.toPlaceId != null || q.toLat != null || q.toLng != null;
}
