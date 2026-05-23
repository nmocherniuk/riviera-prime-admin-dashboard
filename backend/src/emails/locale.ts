import { z } from "zod";

export type EmailLocale = "en" | "fr";

export const emailLocaleSchema = z.enum(["en", "fr"]).default("en");

/** Normalizes frontend locale; unknown values fall back to English. */
export function parseEmailLocale(value: unknown): EmailLocale {
  if (value === "fr") return "fr";
  return "en";
}
