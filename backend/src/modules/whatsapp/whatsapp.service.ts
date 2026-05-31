import type {
  ProcessableMessage,
  WhatsAppIncomingMessage,
  WhatsAppReplyPayload,
} from "./whatsapp.types.js";
import { buildReplyPayload } from "./whatsapp.replyMessages.js";
import {
  MAIN_MENU_LIST_ROWS,
  MAIN_MENU_BUTTON_LABEL,
  MAIN_MENU_SECTION_TITLE,
} from "./whatsapp.constants.js";

function getEnv(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return v;
}

async function graphSendMessage(
  payload: Record<string, unknown>,
): Promise<void> {
  const token = getEnv("WHATSAPP_ACCESS_TOKEN");
  const phoneNumberId = getEnv("WHATSAPP_PHONE_NUMBER_ID");
  const url = `https://graph.facebook.com/v22.0/${phoneNumberId}/messages`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      messaging_product: "whatsapp",
      ...payload,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`WhatsApp API error ${res.status}: ${errText}`);
  }
}

/**
 * Send a simple text message without menu.
 */
export async function sendWhatsAppText(
  to: string,
  body: string,
): Promise<void> {
  await graphSendMessage({
    to,
    type: "text",
    text: { body },
  });
}

export async function sendInteractiveReplyWithMenu(
  to: string,
  answerBody: string,
): Promise<void> {
  const bodyText = answerBody.slice(0, 1024);
  const rows = MAIN_MENU_LIST_ROWS.map((r) => ({
    id: r.id.slice(0, 200),
    title: r.title.trim().slice(0, 24),
    ...(r.description
      ? { description: r.description.trim().slice(0, 72) }
      : {}),
  }));

  await graphSendMessage({
    to,
    type: "interactive",
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: {
        button: MAIN_MENU_BUTTON_LABEL.slice(0, 20),
        sections: [
          {
            title: MAIN_MENU_SECTION_TITLE.slice(0, 24),
            rows,
          },
        ],
      },
    },
  });
}

/**
 * Send an interactive message with up to 3 reply buttons.
 * Used for single-action prompts like earnings "Withdraw".
 */
export async function sendWhatsAppInteractiveButtons(
  to: string,
  body: string,
  buttons: Array<{ id: string; title: string }>,
): Promise<void> {
  if (!buttons.length) {
    await sendWhatsAppText(to, body);
    return;
  }
  const trimmedBody = body.slice(0, 1024);
  const replyButtons = buttons.slice(0, 3).map((b) => ({
    type: "reply" as const,
    reply: {
      id: b.id.slice(0, 256),
      title: b.title.slice(0, 20),
    },
  }));
  await graphSendMessage({
    to,
    type: "interactive",
    interactive: {
      type: "button",
      body: { text: trimmedBody },
      action: { buttons: replyButtons },
    },
  });
}

/**
 * Official Message template (must be approved in WhatsApp Manager).
 */
export async function sendWhatsAppTemplate(
  to: string,
  templateName: string,
  languageCode: string,
  components?: unknown[],
): Promise<void> {
  await graphSendMessage({
    to,
    type: "template",
    template: {
      name: templateName,
      language: { code: languageCode },
      ...(components?.length ? { components } : {}),
    },
  });
}

async function sendReplyPayload(
  to: string,
  reply: WhatsAppReplyPayload,
): Promise<void> {
  if (reply.interactive) {
    await graphSendMessage({ to, type: "interactive", interactive: reply.interactive });
    return;
  }
  await sendInteractiveReplyWithMenu(to, reply.body);
}

/**
 * Processing incoming message: one response (text + list in the same message).
 */
export async function processMessage(
  message: ProcessableMessage,
): Promise<void> {
  const text = message.text?.trim();

  if (!text) {
    return;
  }

  const response = await buildReplyPayload(message);
  await sendReplyPayload(message.from, response);
}

export function extractFirstMessage(
  body: unknown,
): WhatsAppIncomingMessage | null {
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

/** Text, reply button payload, list row id, or interactive button reply id. */
export function incomingUserInput(msg: WhatsAppIncomingMessage): string | null {
  const t = msg.type;
  if (t === "interactive") {
    if (msg.interactive?.type === "list_reply") {
      return msg.interactive.list_reply?.id?.trim() ?? null;
    }
    if (msg.interactive?.type === "button_reply") {
      return msg.interactive.button_reply?.id?.trim() ?? null;
    }
  }
  if (t === "button" && msg.button) {
    const p = msg.button.payload?.trim();
    const label = msg.button.text?.trim();
    return p || label || null;
  }
  const body = msg.text?.body?.trim();
  return body || null;
}
