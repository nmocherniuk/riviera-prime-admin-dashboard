import { Router, type Request } from "express";
import { z } from "zod";
import { validateQuery } from "../../middleware/validateQuery.js";
import { sendGeoError } from "./places.http.js";
import { resolvePlaceDetails, searchPlaces } from "./places.service.js";

const SUPPORTED_LANGS = ["fr", "en"] as const;
const DEFAULT_LANG = "fr";

function normalizeLang(value: unknown): string | null {
  if (typeof value !== "string" || !value) return null;
  const primary = value.split("-")[0]?.trim().toLowerCase() ?? "";
  return (SUPPORTED_LANGS as readonly string[]).includes(primary) ? primary : null;
}

/** `lang` query (site locale) → `Accept-Language` → French. */
export function pickLang(req: Request): string {
  const fromQuery = normalizeLang(req.query.lang);
  if (fromQuery) return fromQuery;
  const header = req.headers["accept-language"] ?? "";
  return normalizeLang(header.split(",")[0]) ?? DEFAULT_LANG;
}

const sessionSchema = z.string().trim().min(8).max(128).optional();

const searchQuerySchema = z.object({
  q: z.string().max(200).default(""),
  lang: z.string().max(10).optional(),
  session: sessionSchema,
});

const detailsQuerySchema = z.object({
  id: z.string().trim().min(1).max(300),
  lang: z.string().max(10).optional(),
  session: sessionSchema,
});

const router = Router();

router.get("/places/search", validateQuery(searchQuerySchema), async (req, res) => {
  // Express 5 re-parses req.query on each access; take validated values from the schema.
  const query = searchQuerySchema.parse(req.query);
  try {
    const suggestions = await searchPlaces({
      q: query.q,
      lang: pickLang(req),
      sessionToken: query.session,
    });
    return res.json({ suggestions });
  } catch (error) {
    if (sendGeoError(res, error)) return;
    console.error("[places] search failed", error);
    return res.status(500).json({ message: "Address search failed" });
  }
});

router.get("/places/details", validateQuery(detailsQuerySchema), async (req, res) => {
  const query = detailsQuerySchema.parse(req.query);
  try {
    const location = await resolvePlaceDetails({
      placeId: query.id,
      lang: pickLang(req),
      sessionToken: query.session,
    });
    return res.json({ placeId: query.id, location });
  } catch (error) {
    if (sendGeoError(res, error)) return;
    console.error("[places] details failed", error);
    return res.status(500).json({ message: "Address lookup failed" });
  }
});

export default router;
