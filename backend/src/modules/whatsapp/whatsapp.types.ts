/** Minimal shapes for Meta WhatsApp Cloud API webhook payloads (MVP). */

export type WhatsAppIncomingMessage = {
  from: string;
  type?: string;
  text?: { body?: string };
  /** Quick reply / template button reply */
  button?: { payload?: string; text?: string };
  /** List message reply */
  interactive?: {
    type?: string;
    list_reply?: {
      id?: string;
      title?: string;
      description?: string;
    };
  };
};

export type ProcessableMessage = {
  from: string;
  /** Normalized user input: text body or button payload/text */
  text: string | null;
};

/** Текст відповіді; у сервісі він одразу йде в body інтерактивного list-повідомлення одним запитом. */
export type WhatsAppReplyPayload = {
  body: string;
};
