import type { CookieOptions } from "express";
import jwt from "jsonwebtoken";

type TokenPayload = {
  sub: string;
  email: string;
  tokenUse: "access" | "refresh";
};

function getSecrets() {
  const access = process.env.JWT_ACCESS_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;

  if (!access || !refresh) {
    throw new Error("JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be set");
  }

  return { access, refresh };
}

export function getRefreshCookieOptions(): CookieOptions {
  const isProd = process.env.NODE_ENV === "production";
  return {
    httpOnly: true,
    secure: isProd,
    sameSite: "lax",
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
}

export function signAccessToken(payload: Omit<TokenPayload, "tokenUse">) {
  const { access } = getSecrets();
  return jwt.sign({ ...payload, tokenUse: "access" }, access, {
    expiresIn: "15m",
  });
}

export function signRefreshToken(payload: Omit<TokenPayload, "tokenUse">) {
  const { refresh } = getSecrets();
  return jwt.sign({ ...payload, tokenUse: "refresh" }, refresh, {
    expiresIn: "7d",
  });
}

export function verifyAccessToken(token: string) {
  const { access } = getSecrets();
  return jwt.verify(token, access) as jwt.JwtPayload;
}

export function verifyRefreshToken(token: string) {
  const { refresh } = getSecrets();
  return jwt.verify(token, refresh) as jwt.JwtPayload;
}
