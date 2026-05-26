import type { Request, Response } from "express";
import { submitSecurityRequestService } from "./securityRequest.service.js";

export async function submitSecurityRequestController(
  req: Request,
  res: Response,
) {
  try {
    await submitSecurityRequestService(req.body);
    return res.status(200).json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to submit request";
    console.error("[security-request] submit failed:", error);

    if (
      message === "ADMIN_EMAIL is not configured" ||
      message === "SMTP is not configured"
    ) {
      return res.status(503).json({
        message: "Email service is not configured. Please try again later.",
      });
    }

    return res.status(500).json({ message });
  }
}
