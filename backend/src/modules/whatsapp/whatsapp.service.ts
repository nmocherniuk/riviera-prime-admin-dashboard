import type {
  ProcessableMessage,
  WhatsAppReplyPayload,
} from "./whatsapp.types.js";
import { buildReplyPayload } from "./whatsapp.replyMessages.js";
import {
  MAIN_MENU_LIST_ROWS,
  MAIN_MENU_BUTTON_LABEL,
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
            title: "Driver",
            rows,
          },
        ],
      },
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

  const response = buildReplyPayload(text);
  await sendReplyPayload(message.from, response);
}
