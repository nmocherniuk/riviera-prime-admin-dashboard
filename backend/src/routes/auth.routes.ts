import { Router, type Response } from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { z } from "zod";
import type { CookieOptions } from "express";
import type { AuthedRequest } from "../middleware/requireAuth.js";
import { requireAuth } from "../middleware/requireAuth.js";

const router = Router();

const loginBody = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const DEMO_USER_ID = "admin-1";

function getSecrets() {
  const access = process.env.JWT_ACCESS_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;
  if (!access || !refresh) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set");
  }
  return { access, refresh };
}

function cookieOpts(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const plain = process.env.ADMIN_PASSWORD;

  if (hash) {
    return bcrypt.compare(password, hash);
  }
  if (plain) {
    return password === plain;
  }
  return false;
}

function signAccessToken(email: string) {
  const { access } = getSecrets();
  return jwt.sign(
    { sub: DEMO_USER_ID, email, tokenUse: "access" },
    access,
    { expiresIn: "15m" },
  );
}

function signRefreshToken(email: string) {
  const { refresh } = getSecrets();
  return jwt.sign(
    { sub: DEMO_USER_ID, email, tokenUse: "refresh" },
    refresh,
    { expiresIn: "7d" },
  );
}

router.post("/login", async (req, res) => {
  const parsed = loginBody.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ message: "Invalid body" });
  }

  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@aurevia.local";
  const { email, password } = parsed.data;

  if (email.toLowerCase() !== adminEmail.toLowerCase()) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  const ok = await verifyAdminPassword(password);
  if (!ok) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  try {
    const accessToken = signAccessToken(email);
    const refreshToken = signRefreshToken(email);
    res.cookie("refreshToken", refreshToken, cookieOpts());
    return res.json({ accessToken, user: { email } });
  } catch {
    return res.status(500).json({ message: "Auth configuration error" });
  }
});

router.post("/refresh", (req, res: Response) => {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  let refreshSecret: string;
  try {
    refreshSecret = getSecrets().refresh;
  } catch {
    return res.status(500).json({ message: "Auth configuration error" });
  }

  try {
    const payload = jwt.verify(token, refreshSecret) as jwt.JwtPayload;
    if (payload.tokenUse !== "refresh") {
      return res.status(401).json({ message: "Invalid refresh token" });
    }
    const email = String(payload.email ?? process.env.ADMIN_EMAIL ?? "");
    const accessToken = signAccessToken(email);
    const newRefresh = signRefreshToken(email);
    res.cookie("refreshToken", newRefresh, cookieOpts());
    return res.json({ accessToken });
  } catch {
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(401).json({ message: "Invalid or expired refresh" });
  }
});

router.post("/logout", (_req, res) => {
  res.clearCookie("refreshToken", { path: "/" });
  return res.json({ ok: true });
});

router.get("/me", requireAuth, (req: AuthedRequest, res) => {
  return res.json({ user: req.user });
});

export default router;
