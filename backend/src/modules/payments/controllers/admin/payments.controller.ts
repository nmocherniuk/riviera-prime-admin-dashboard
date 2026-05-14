import type { Response } from "express";
import type { AuthedRequest } from "../../../../middleware/requireAuth.js";
import {
  getAdminAvailableBalance,
  listPaymentHistory,
  withdrawAdminAvailableBalance,
} from "../../payments.service.js";

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

export async function getAdminBalanceController(
  _req: AuthedRequest,
  res: Response,
) {
  try {
    const balance = await getAdminAvailableBalance();
    return res.json(balance);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to load balance";
    return res.status(500).json({ message });
  }
}

export async function withdrawAdminBalanceController(
  _req: AuthedRequest,
  res: Response,
) {
  try {
    const result = await withdrawAdminAvailableBalance();
    return res.json(result);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to withdraw balance";
    if (message === "No available balance") {
      return res.status(400).json({ message });
    }
    return res.status(500).json({ message });
  }
}
