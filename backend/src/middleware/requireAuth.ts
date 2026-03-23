import type { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../modules/auth/auth.tokens.js";
import { findUserByEmail } from "../modules/auth/auth.repository.js";

export type AuthUser = {
  sub: string;
  email: string;
  name: string;
};

export type AuthedRequest = Request & { user?: AuthUser };

export async function requireAuth(
  req: AuthedRequest,
  res: Response,
  next: NextFunction,
) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = header.slice(7);
  try {
    const payload = verifyAccessToken(token);
    if (payload.tokenUse && payload.tokenUse !== "access") {
      return res.status(401).json({ message: "Invalid token type" });
    }

    const user = await findUserByEmail(payload.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid token user" });
    }

    req.user = {
      sub: user.id,
      email: user.email,
      name: user.name,
    };
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
