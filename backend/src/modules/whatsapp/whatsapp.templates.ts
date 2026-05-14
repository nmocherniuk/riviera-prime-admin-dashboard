import {
  DEFAULT_LANGUAGE,
  DEFAULT_TEMPLATE_NAME,
} from "./whatsapp.constants.js";
import { sendWhatsAppTemplate } from "./whatsapp.service.js";

export type TripOfferDriverBodyParams = {
  clientName: string;
  tripType: string;
  fromRoute: string;
  toRoute: string;
  date: string;
  time: string;
  notesForDriver: string;
  amountOrExtra: string;
};

function getTemplateName(): string {
  return (
    process.env.WHATSAPP_TEMPLATE_TRIP_OFFER_DRIVER ?? DEFAULT_TEMPLATE_NAME
  );
}

function getTemplateLanguage(): string {
  return process.env.WHATSAPP_TEMPLATE_TRIP_OFFER_LANG ?? DEFAULT_LANGUAGE;
}

/**
 * Sends approved template `trip_offer_driver` with 4 body variables, then
 * a follow-up interactive message with the driver menu (UX: return to app flow).
 */
export async function sendTripOfferDriverTemplateWithMenu(
  bookingId: string,
  toDigits: string,
  params: TripOfferDriverBodyParams,
): Promise<void> {
  const name = getTemplateName();
  const lang = getTemplateLanguage();

  const components = [
    {
      type: "body",
      parameters: [
        { type: "text", text: params.clientName },
        { type: "text", text: params.tripType },
        { type: "text", text: params.fromRoute },
        { type: "text", text: params.toRoute },
        { type: "text", text: params.date },
        { type: "text", text: params.time },
        { type: "text", text: params.notesForDriver },
        { type: "text", text: params.amountOrExtra },
      ],
    },
    {
      type: "button",
      sub_type: "quick_reply",
      index: 0,
      parameters: [{ type: "payload", payload: `REJECT_${bookingId}` }],
    },
    {
      type: "button",
      sub_type: "quick_reply",
      index: 1,
      parameters: [{ type: "payload", payload: `ACCEPT_${bookingId}` }],
    },
  ];

  await sendWhatsAppTemplate(toDigits, name, lang, components);
}
