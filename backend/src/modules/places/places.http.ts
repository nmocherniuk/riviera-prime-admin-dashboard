import type { Response } from "express";
import { GoogleApiError } from "../../integrations/google/googleClient.js";
import { GeoValidationError } from "../../lib/geo.js";

/**
 * Maps address/route errors to HTTP with a client-readable message.
 * Returns false for anything else so the caller keeps its own handling.
 */
export function sendGeoError(res: Response, error: unknown): boolean {
  if (error instanceof GoogleApiError) {
    res.status(error.httpStatus).json({ message: error.message, code: "GOOGLE_API_ERROR" });
    return true;
  }
  if (error instanceof GeoValidationError) {
    res.status(400).json({ message: error.message, code: "INVALID_LOCATION" });
    return true;
  }
  return false;
}
