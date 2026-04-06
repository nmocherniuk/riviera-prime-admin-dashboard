import type { Request, Response } from "express";
import { processMessage } from "./whatsapp.service.js";
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
    console.log("token", token, "verifyToken", verifyToken);
    if (mode === "subscribe" && token === verifyToken && challenge) {
      return res.status(200).send(challenge);
    }

    return res.status(403).json({ message: "Forbidden" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Verification failed";
    return res.status(500).json({ message: msg });
  }
}

function extractFirstMessage(body: unknown): WhatsAppIncomingMessage | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;
  const entry = b.entry;
  if (!Array.isArray(entry) || entry.length === 0) return null;
  const firstEntry = entry[0] as Record<string, unknown>;
  const changes = firstEntry.changes;
  if (!Array.isArray(changes) || changes.length === 0) return null;
  const firstChange = changes[0] as Record<string, unknown>;
  const value = firstChange.value as Record<string, unknown> | undefined;
  if (!value) return null;
  const messages = value.messages;
  if (!Array.isArray(messages) || messages.length === 0) return null;
  return messages[0] as WhatsAppIncomingMessage;
}

/** Text, reply button payload, або list row id. */
function incomingUserInput(msg: WhatsAppIncomingMessage): string | null {
  const t = msg.type;
  if (t === "interactive" && msg.interactive?.type === "list_reply") {
    return msg.interactive.list_reply?.id?.trim() ?? null;
  }
  if (t === "button" && msg.button) {
    const p = msg.button.payload?.trim();
    const label = msg.button.text?.trim();
    return p || label || null;
  }
  const body = msg.text?.body?.trim();
  return body || null;
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

    await processMessage({ from: msg.from, text });
    return res.sendStatus(200);
  } catch (e) {
    console.error("[WhatsApp] webhook error:", e);
    const message = e instanceof Error ? e.message : "Webhook failed";
    return res.status(500).json({ message });
  }
}
