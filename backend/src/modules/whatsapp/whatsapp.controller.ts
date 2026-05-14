import type { Request, Response } from "express";
import {
  extractFirstMessage,
  incomingUserInput,
  processMessage,
} from "./whatsapp.service.js";
import type { WhatsAppIncomingMessage } from "./whatsapp.types.js";

function getVerifyToken(): string {
  const t = process.env.WHATSAPP_VERIFY_TOKEN;
  if (!t) {
    throw new Error("Missing WHATSAPP_VERIFY_TOKEN");
  }
  return t;
}

/**
 * GET — Meta webhook verification (subscription).
 */
export async function verifyWebhookController(req: Request, res: Response) {
  try {
    const mode = req.query["hub.mode"] as string | undefined;
    const token = req.query["hub.verify_token"] as string | undefined;
    const challenge = req.query["hub.challenge"] as string | undefined;

    const verifyToken = getVerifyToken();

    if (mode === "subscribe" && token === verifyToken && challenge) {
      return res.status(200).send(challenge);
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Verification failed";
    return res.status(500).json({ message: msg });
  }
}

/**
 * POST — incoming webhook events from Meta.
 */
export async function receiveWebhookController(req: Request, res: Response) {
  try {
    console.log(
      "[WhatsApp] Webhook payload:",
      JSON.stringify(req.body, null, 2),
    );

    const msg = extractFirstMessage(req.body);

    if (!msg?.from) {
      return res.sendStatus(200);
    }

    const text = incomingUserInput(msg);

    if (text) {
      console.log(
        `[WhatsApp] from=${msg.from} type=${msg.type ?? "?"} input=${JSON.stringify(text)}`,
      );
    }

    if (!text) {
      return res.sendStatus(200);
    }

    console.log("msg", msg);
    await processMessage({ from: msg.from, text });
    return res.sendStatus(200);
  } catch (e) {
    console.error("[WhatsApp] webhook error:", e);
    const message = e instanceof Error ? e.message : "Webhook failed";
    return res.status(500).json({ message });
  }
}
