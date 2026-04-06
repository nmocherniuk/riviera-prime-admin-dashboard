import type { WhatsAppReplyPayload } from "./whatsapp.types.js";

export const WHATSAPP_REPLY_MESSAGES = {
  welcomeHint: "Напиши «menu» або «привіт» — покажемо меню.",

  currentTrip:
    "📍 Current trip:\nNice → Monaco\nClient: John\nStatus: On the way",
  earning: "Ваш дохід (даммі): 100 €. Деталі — на сайті або у менеджера.",
  trips: "🚗 You have 2 active trips:\n1. Nice → Monaco\n2. Cannes → Airport",
  profile: "👤 Name: Nazar\nCar: BMW 5 Series\nRating: 4.9⭐",
  history: "🔍 History: You can see your past trips here.",
  help: [
    "Доступні команди (приклад):",
    "• привіт / menu — одне повідомлення з текстом і меню",
    "• обери пункт у списку нижче",
  ].join("\n"),

  online: "🟢 You are now ONLINE",
  offline: "🔴 You are now OFFLINE",

  tripRejected:
    "Ви відхилили поїздку. Статус: відхилено. Якщо це помилка — напишіть у підтримку.",
  tripAccepted:
    "Ви прийняли поїздку. Статус: прийнято. Якщо це помилка — напишіть у підтримку.",

  defaultEcho: 'Ти написав: "{{text}}". Це відповідь за замовчуванням.',
} as const;

/** Text on the button that opens the list (≤ 20 characters). */
export function buildReplyPayload(rawText: string): WhatsAppReplyPayload {
  const t = rawText.trim();
  const lower = t.toLowerCase();

  if (lower === "reject") {
    return { body: WHATSAPP_REPLY_MESSAGES.tripRejected };
  }

  if (lower === "accept") {
    return { body: WHATSAPP_REPLY_MESSAGES.tripAccepted };
  }

  if (t === "CURRENT_TRIP") {
    return { body: WHATSAPP_REPLY_MESSAGES.currentTrip };
  }
  if (t === "EARNING") {
    return { body: WHATSAPP_REPLY_MESSAGES.earning };
  }
  if (t === "TRIPS") {
    return { body: WHATSAPP_REPLY_MESSAGES.trips };
  }
  if (t === "PROFILE") {
    return { body: WHATSAPP_REPLY_MESSAGES.profile };
  }
  if (t === "HISTORY") {
    return { body: WHATSAPP_REPLY_MESSAGES.history };
  }
  if (t === "HELP") {
    return { body: WHATSAPP_REPLY_MESSAGES.help };
  }
  if (t === "ONLINE") {
    return { body: WHATSAPP_REPLY_MESSAGES.online };
  }
  if (t === "OFFLINE") {
    return { body: WHATSAPP_REPLY_MESSAGES.offline };
  }

  if (
    lower === "hi" ||
    lower === "hello" ||
    lower.startsWith("привіт") ||
    lower.startsWith("privit") ||
    lower === "menu" ||
    lower === "меню"
  ) {
    return {
      body: "Вітаємо! Нижче — меню з опціями (відкрий кнопку «Меню»).",
    };
  }

  if (lower === "help" || lower === "допомога" || lower === "?") {
    return { body: WHATSAPP_REPLY_MESSAGES.help };
  }

  return {
    body: WHATSAPP_REPLY_MESSAGES.defaultEcho.replace(
      "{{text}}",
      t.length > 200 ? `${t.slice(0, 200)}…` : t,
    ),
  };
}
