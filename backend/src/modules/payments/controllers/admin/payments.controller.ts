import type { Response } from "express";
import type { AuthedRequest } from "../../../../middleware/requireAuth.js";
import { listPaymentHistory } from "../../payments.service.js";

export async function listPaymentsController(
  _req: AuthedRequest,
  res: Response,
) {
  try {
    const payments = await listPaymentHistory();
    return res.json({ payments });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to list payments";
    console.error("[payments]", error);
    return res.status(500).json({ message });
  }
}
