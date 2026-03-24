import type { Request, Response } from "express";
import { login, refreshAccessToken } from "./auth.service.js";
import { getRefreshCookieOptions } from "./auth.tokens.js";
import type { AuthedRequest } from "../../middleware/requireAuth.js";

export async function loginController(req: Request, res: Response) {
  console.log(req.body);
  try {
    const result = await login(req.body);
    res.cookie("refreshToken", result.refreshToken, getRefreshCookieOptions());
    return res.json({
      accessToken: result.accessToken,
      user: result.user,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unauthorized";
    if (message === "Invalid email or password") {
      return res.status(401).json({ message });
    }
    console.log(message);

    return res.status(500).json({ message: "Login failed" });
  }
}

export async function refreshController(req: Request, res: Response) {
  const token = req.cookies?.refreshToken as string | undefined;
  if (!token) {
    return res.status(401).json({ message: "No refresh token" });
  }

  try {
    const tokens = await refreshAccessToken(token);
    res.cookie("refreshToken", tokens.refreshToken, getRefreshCookieOptions());
    return res.json({ accessToken: tokens.accessToken });
  } catch {
    res.clearCookie("refreshToken", { path: "/" });
    return res.status(401).json({ message: "Invalid or expired refresh" });
  }
}

export function logoutController(_req: Request, res: Response) {
  res.clearCookie("refreshToken", { path: "/" });
  return res.json({ ok: true });
}

export function meController(req: AuthedRequest, res: Response) {
  return res.json({ user: req.user });
}
