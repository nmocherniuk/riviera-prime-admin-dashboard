import type { NextFunction, Request, Response } from "express";

/**
 * If `PUBLIC_BOOKING_API_KEY` is set, require matching `x-public-booking-key` header.
 * If unset, allow (local / open test only — set the key in production).
 */
export function requirePublicBookingKey(req: Request, res: Response, next: NextFunction) {
  const expected = process.env.PUBLIC_BOOKING_API_KEY?.trim();
  if (!expected) {
    return next();
  }
  const provided = req.header("x-public-booking-key");
  if (provided !== expected) {
    return res.status(401).json({ message: "Invalid or missing public booking key" });
  }
  return next();
}
