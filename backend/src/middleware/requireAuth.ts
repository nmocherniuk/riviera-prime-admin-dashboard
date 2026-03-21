import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export type AuthUser = { sub: string; email: string };

export type AuthedRequest = Request & { user?: AuthUser };

export function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const secret = process.env.JWT_ACCESS_SECRET;
  if (!secret) {
    return res.status(500).json({ message: "Server misconfiguration" });
  }

  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, secret) as jwt.JwtPayload;
    if (payload.tokenUse && payload.tokenUse !== "access") {
      return res.status(401).json({ message: "Invalid token type" });
    }
    req.user = {
      sub: String(payload.sub),
      email: String(payload.email ?? ""),
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
