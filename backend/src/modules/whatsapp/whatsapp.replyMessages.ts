import {
  findBookingById,
  listBookings as listBookingsRows,
  listCompletedBookings,
  parseCandidateDriverIdsJson,
} from "../booking/booking.repository.js";
import {
  getBookingByIdService,
  listBookingsService,
  updateBookingService,
} from "../booking/booking.service.js";
import {
  sendBookingAcceptedEmail,
  sendBookingAllRejectedEmail,
} from "../booking/booking.emails.js";
import { toBookingEmailData } from "../booking/booking.emailData.js";
import {
  getDriverEarningsSummary,
  requestDriverManualPayout,
  syncCompletedTransfersForDriver,
} from "../stripe/stripeEarnings.service.js";
import { formatBookingDateTimeZone } from "./formatBookingTime.js";
import { isHourlyTripType } from "../pricing/marketplacePricing.service.js";
import type {
  ProcessableMessage,
  WhatsAppReplyPayload,
} from "./whatsapp.types.js";
import { getDriverByPhone, setDriverOnlineStatus } from "../driver/driver.service.js";
import { findDriverById } from "../driver/driver.repository.js";
import {
  MAIN_MENU_BUTTON_LABEL,
  MAIN_MENU_LIST_ROWS,
  MAIN_MENU_SECTION_TITLE,
} from "./whatsapp.constants.js";

import {
  getDriverStripeBalanceView,
  formatEur,
  formatAvailableDate,
} from "./whatsapp.driverEarnings.js";

export const WHATSAPP_REPLY_MESSAGES = {
  menuWelcome:
    "Bienvenue sur *Riviera Prime* 👋\n\nOuvrez le menu ci-dessous pour gérer vos courses, vos gains et votre statut.",
  menu:
    "📋 *Menu chauffeur*\n\nChoisissez une option dans la liste.",

  tripAccepted:
    "✅ *Course acceptée*\n\nVous êtes assigné à cette course. Le client recevra un e-mail pour finaliser le paiement.\n\nEn cas d'erreur, contactez le support Riviera Prime.",
  tripRejected:
    "❌ *Course refusée*\n\nVotre réponse a été enregistrée. Vous ne serez pas assigné à cette course.",

  online: "🟢 *Vous êtes en ligne*\n\nVous pouvez recevoir de nouvelles offres de courses.",
  offline: "🔴 *Vous êtes hors ligne*\n\nVous ne recevrez plus de nouvelles offres pour le moment.",

  help: [
    "ℹ️ *Aide chauffeur*",
    "",
    "• Tapez *menu* ou */menu* pour ouvrir le menu",
    "• Utilisez la liste interactive pour naviguer",
    "• *Offres en attente* : acceptez ou refusez rapidement avant la date limite",
    "• *Mes courses* : consultez les trajets payés et en attente de paiement",
  ].join("\n"),

  unknownDriver: [
    "⚠️ *Numéro non autorisé*",
    "",
    "Ce numéro n'est pas lié à un profil chauffeur Riviera Prime.",
    "Si vous pensez qu'il s'agit d'une erreur, contactez l'administrateur pour vérifier votre téléphone dans la base chauffeurs.",
  ].join("\n"),

  defaultEcho:
    'Message reçu : « {{text}} ».\n\nTapez *menu* ou */menu* pour voir les options disponibles.',
} as const;

function formatStatusFr(status: string): string {
  const map: Record<string, string> = {
    pending: "En attente",
    assigned: "Assignée",
    in_progress: "En cours",
    completed: "Terminée",
    cancelled: "Annulée",
    PENDING: "En attente",
    ASSIGNED: "Assignée",
    IN_PROGRESS: "En cours",
    COMPLETED: "Terminée",
    CANCELLED: "Annulée",
  };
  return map[status] ?? status;
}

function formatPaymentFr(status: string): string {
  const map: Record<string, string> = {
    paid: "Payé",
    unpaid: "Non payé",
    PAID: "Payé",
    UNPAID: "Non payé",
  };
  return map[status] ?? status;
}

function formatTripTypeFr(tripType: string): string {
  const t = tripType.toLowerCase();
  if (t === "one-way" || t === "oneway") return "Aller simple";
  if (t === "hourly" || t === "hour") return "À l'heure";
  return tripType;
}

function dashIfEmpty(value: string | null | undefined): string {
  const t = value?.trim();
  return t && t.length > 0 ? t : "—";
}

/** Interactive driver menu (list). */
export function buildMainMenuReply(welcomeText?: string): WhatsAppReplyPayload {
  const bodyText = (welcomeText ?? WHATSAPP_REPLY_MESSAGES.menu).slice(0, 1024);
  const rows = MAIN_MENU_LIST_ROWS.map((r) => ({
    id: r.id.slice(0, 200),
    title: r.title.trim().slice(0, 24),
    ...(r.description
      ? { description: r.description.trim().slice(0, 72) }
      : {}),
  }));

  return {
    body: bodyText,
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: {
        button: MAIN_MENU_BUTTON_LABEL.slice(0, 20),
        sections: [{ title: MAIN_MENU_SECTION_TITLE.slice(0, 24), rows }],
      },
    },
  };
}

function isMenuCommand(text: string | undefined, lower: string | undefined): boolean {
  if (!lower) return false;
  return (
    lower === "menu" ||
    lower === "/menu" ||
    lower === "menú" ||
    lower === "меню" ||
    lower === "hi" ||
    lower === "hello" ||
    lower === "bonjour" ||
    lower === "salut" ||
    lower.startsWith("bonjour ") ||
    lower.startsWith("salut ") ||
    lower.startsWith("привіт") ||
    lower.startsWith("privit")
  );
}

function formatTripDate(date: Date): string {
  const { date: d, time } = formatBookingDateTimeZone(new Date(date));
  return `${d} ${time}`;
}

function formatDeadlineTime(date: Date | null | undefined): string {
  if (!date) return "—";
  const timeZone = process.env.BOOKING_DISPLAY_TIMEZONE ?? "Europe/Paris";
  const d = new Date(date);
  const now = new Date();
  const dayKey = (value: Date) =>
    new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(value);
  const sameDay = dayKey(d) === dayKey(now);
  return new Intl.DateTimeFormat("fr-FR", {
    timeZone,
    ...(sameDay
      ? {}
      : { day: "2-digit", month: "2-digit", year: "numeric" }),
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(d);
}

async function buildTripsListReply(
  driverId: string,
): Promise<WhatsAppReplyPayload> {
  const all = await listBookingsService({ driverId });
  const trips = all.filter((t) => t.status === "assigned");
  const paidTrips = trips.filter((t) => t.paymentStatus === "paid");
  const unpaidTrips = trips.filter((t) => t.paymentStatus === "unpaid");

  if (trips.length === 0) {
    return {
      body: "🚗 *Mes courses*\n\nAucune course assignée pour le moment.\n\nConsultez *Offres en attente* pour de nouvelles propositions.",
    };
  }

  const NAV_ROWS = 2;
  const MAX_LIST_ROWS = 10;
  const maxTripRows = Math.max(0, MAX_LIST_ROWS - NAV_ROWS);
  const paidQuota = Math.ceil(maxTripRows / 2);
  const rowsPaid = paidTrips.slice(0, paidQuota).map((trip) => ({
    id: `TRIP_${trip.id}`.slice(0, 200),
    title: `${trip.from} → ${trip.to}`.slice(0, 24),
    description: `${formatTripDate(trip.bookingAt)} • Confirmée`.slice(0, 72),
  }));
  const remainingForUnpaid = Math.max(0, maxTripRows - rowsPaid.length);
  const rowsUnpaid = unpaidTrips.slice(0, remainingForUnpaid).map((trip) => ({
    id: `TRIP_${trip.id}`.slice(0, 200),
    title: `${trip.from} → ${trip.to}`.slice(0, 24),
    description: `${formatTripDate(trip.bookingAt)} • Paiement en attente`.slice(0, 72),
  }));

  const bodyText = [
    "🚗 *Mes courses*",
    "",
    `✅ Payées : ${paidTrips.length}`,
    `💰 En attente de paiement : ${unpaidTrips.length}`,
    "",
    "Sélectionnez une course pour voir les détails.",
  ].join("\n");

  const sections: Array<{
    title: string;
    rows: Array<{ id: string; title: string; description: string }>;
  }> = [];
  if (rowsPaid.length) sections.push({ title: "✅ Courses payées", rows: rowsPaid });
  if (rowsUnpaid.length)
    sections.push({ title: "💰 Paiement en attente", rows: rowsUnpaid });

  return {
    body: bodyText,
    interactive: {
      type: "list",
      body: { text: bodyText },
      action: {
        button: "Voir courses",
        sections: [
          ...sections,
          {
            title: "Navigation",
            rows: [
              {
                id: "PENDING_TRIPS",
                title: "📋 Offres en attente",
                description: "Répondre aux propositions",
              },
              {
                id: "MENU_MAIN",
                title: "⬅ Retour au menu",
                description: "",
              },
            ],
          },
        ],
      },
    },

  };
}

async function buildPendingTripsReply(
  driverId: string,
): Promise<WhatsAppReplyPayload> {
  const all = await listBookingsRows();
  const pending = all.filter((t) => {
    if (t.status !== "PENDING") return false;
    const rowCandidates = parseCandidateDriverIdsJson(t.candidateDriverIds);
    return rowCandidates.some(
      (c) => c.driverId === driverId && c.status.toLowerCase() === "pending",
    );
  });

  if (!pending.length) {
    return {
      body: "📋 *Offres en attente*\n\nAucune course ne nécessite votre réponse pour le moment.",
    };
  }

  const rows = pending.slice(0, 10).map((trip) => ({
    id: `PENDING_${trip.id}`.slice(0, 200),
    title: `${trip.from} → ${trip.to}`.slice(0, 24),
    description: `Répondre avant ${formatDeadlineTime(trip.driverResponseDeadline ?? null)}`.slice(
      0,
      72,
    ),
  }));

  const pendingBody =
    "📋 *Offres en attente*\n\nSélectionnez une course pour *Accepter* ou *Refuser*.";

  return {
    body: pendingBody,
    interactive: {
      type: "list",
      body: { text: pendingBody },
      action: {
        button: "Offres",
        sections: [{ title: "En attente", rows }],
      },
    },
  };
}

async function buildTripDetailReply(
  bookingId: string,
): Promise<WhatsAppReplyPayload> {
  const trip = await getBookingByIdService(bookingId);
  if (!trip) {
    return { body: "❌ Course introuvable." };
  }

  const { date, time } = formatBookingDateTimeZone(new Date(trip.bookingAt));

  const bodyText = [
    `🛫 *Détails de la course*`,
    ``,
    `*Client :* ${trip.clientName}`,
    `*Téléphone :* ${dashIfEmpty(trip.clientPhone)}`,
    `*E-mail :* ${dashIfEmpty(trip.clientEmail)}`,
    `*Type :* ${formatTripTypeFr(trip.tripType)}`,
    `*Trajet :* ${trip.from} → ${trip.to}`,
    `*Véhicule :* ${dashIfEmpty(trip.vehicleName)} (${trip.vehicleClass ?? "—"})`,
    `*${isHourlyTripType(trip.tripType) ? "Date" : "Prise en charge"} :* ${date} à ${time}`,
    ...(isHourlyTripType(trip.tripType)
      ? [`*Durée :* ${trip.durationMin} min`]
      : []),
    `*Statut :* ${formatStatusFr(trip.status)}`,
    `*Paiement :* ${formatPaymentFr(trip.paymentStatus)}`,
    `*Notes :* ${dashIfEmpty(trip.notesForDriver)}`,
  ].join("\n");

  const buttons: { type: "reply"; reply: { id: string; title: string } }[] = [];

  if (trip.status === "assigned") {
    buttons.push({
      type: "reply",
      reply: { id: `START_${trip.id}`, title: "🚀 Démarrer" },
    });
  }

  buttons.push({
    type: "reply",
    reply: { id: "TRIPS", title: "🚗 Mes courses" },
  });

  return {
    body: bodyText,
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: { buttons },
    },
  };
}

const START_WINDOW_MIN = 30;

function canStartTrip(bookingAt: Date): boolean {
  const diffMin = (new Date(bookingAt).getTime() - Date.now()) / 60_000;
  return diffMin <= START_WINDOW_MIN;
}

async function handleStartTrip(
  message: ProcessableMessage,
  bookingId: string,
): Promise<WhatsAppReplyPayload> {
  const booking = await findBookingById(bookingId);
  if (!booking) {
    return { body: "❌ Course introuvable." };
  }

  const driver = await getDriverByPhone(message.from);
  if (!driver) {
    return { body: "❌ Chauffeur non reconnu. Vérifiez votre numéro dans le système." };
  }

  if (booking.driverId !== driver.id) {
    return { body: "⚠️ Cette course ne vous est pas assignée." };
  }

  if (booking.status === "IN_PROGRESS") {
    return { body: "ℹ️ La course est déjà en cours." };
  }

  if (booking.status !== "ASSIGNED") {
    return {
      body: `⚠️ Impossible de démarrer (statut actuel : ${formatStatusFr(booking.status.toLowerCase())}).`,
    };
  }

  if (booking.paymentStatus !== "PAID") {
    return {
      body: "💳 Paiement non confirmé.\n\nVous pourrez démarrer la course une fois le client payé.",
    };
  }

  if (!canStartTrip(booking.bookingAt)) {
    return {
      body: `⏳ Trop tôt pour démarrer.\n\nVous pourrez démarrer *${START_WINDOW_MIN} minutes* avant l'heure de prise en charge.`,
    };
  }

  await updateBookingService(bookingId, { status: "in_progress" });

  return {
    body: "🚀 *Course démarrée*\n\nBonne route et conduisez prudemment !",
  };
}

function parseAcceptBookingIdFromListRow(text: string | undefined): string | null {
  if (!text) return null;
  const match = text.match(/^(?:ACCEPT|ACCEPTER|REJECT|REFUSER)_(.+)$/i);
  const id = match?.[1]?.trim();
  return id && id.length > 0 ? id : null;
}

function normalizeButtonLabel(text: string): string {
  return text.replace(/^[^\p{L}\p{N}]+/u, "").trim().toUpperCase();
}

async function resolveBookingIdForDriverAction(
  text: string,
  driverId: string,
): Promise<string | null> {
  const fromPayload = parseAcceptBookingIdFromListRow(text);
  if (fromPayload) return fromPayload;

  const label = normalizeButtonLabel(text);
  if (label !== "ACCEPTER" && label !== "REFUSER") return null;

  const pending = (await listBookingsRows()).filter((trip) => {
    if (trip.status !== "PENDING") return false;
    const candidates = parseCandidateDriverIdsJson(trip.candidateDriverIds);
    return candidates.some(
      (c) => c.driverId === driverId && c.status.toLowerCase() === "pending",
    );
  });

  if (pending.length === 1) return pending[0]?.id ?? null;
  return null;
}

function isAcceptAction(text: string | undefined): boolean {
  if (!text) return false;
  const normalized = text.toUpperCase();
  return normalized.startsWith("ACCEPT") || normalized.startsWith("ACCEPTER");
}

function isRejectAction(text: string | undefined): boolean {
  if (!text) return false;
  const normalized = text.toUpperCase();
  return normalized.startsWith("REJECT") || normalized.startsWith("REFUSER");
}

async function buildEarningsReply(driverId: string): Promise<WhatsAppReplyPayload> {
  await syncCompletedTransfersForDriver(driverId);
  const [earnings, driver] = await Promise.all([
    getDriverEarningsSummary(driverId),
    findDriverById(driverId),
  ]);

  const stripeView = driver?.stripeAccountId
    ? await getDriverStripeBalanceView(driver.stripeAccountId)
    : { availableEur: 0, pendingEur: 0, availableOn: null };

  const lines: string[] = [
    "💶 *Gains*",
    "",
    `Total gagné : ${formatEur(earnings.totalEarned)}`,
    "",
    `💳 Disponible au retrait : ${formatEur(stripeView.availableEur)}`,
  ];

  if (stripeView.pendingEur > 0) {
    lines.push(`⏳ En attente : ${formatEur(stripeView.pendingEur)}`);
    if (stripeView.availableEur <= 0) {
      lines.push(`Disponible le : ${formatAvailableDate(stripeView.availableOn)}`);
    }
  }

  if (stripeView.availableEur > 0) {
    lines.push("", "Appuyez sur *Retirer* ci-dessous pour encaisser 👇");
  } else if (stripeView.pendingEur > 0) {
    lines.push("", "Nous vous informerons dès que les fonds seront disponibles.");
  } else {
    lines.push("", "Complétez des courses pour générer des revenus.");
  }

  const bodyText = lines.join("\n");

  const buttons: Array<{
    type: "reply";
    reply: { id: string; title: string };
  }> = [];
  if (stripeView.availableEur > 0) {
    buttons.push({
      type: "reply",
      reply: { id: "WITHDRAW", title: "💸 Retirer" },
    });
  }
  buttons.push({
    type: "reply",
    reply: { id: "MENU_MAIN", title: "📋 Menu" },
  });

  return {
    body: bodyText,
    interactive: {
      type: "button",
      body: { text: bodyText },
      action: { buttons },
    },
  };
}

/** Text on the button that opens the list (≤ 20 characters). */
export async function buildReplyPayload(
  message: ProcessableMessage,
): Promise<WhatsAppReplyPayload> {
  const text = message.text?.trim();
  const lower = text?.toLowerCase();
  const driver = await getDriverByPhone(message.from);

  if (!driver) {
    return { body: WHATSAPP_REPLY_MESSAGES.unknownDriver };
  }

  if (text?.startsWith("TRIP_")) {
    const bookingId = text.slice("TRIP_".length).trim();
    if (!bookingId) {
      return { body: "❌ Identifiant de course manquant." };
    }
    return buildTripDetailReply(bookingId);
  }

  /** Must run before `PENDING_*` row handler: nav id is `PENDING_TRIPS` (also starts with PENDING_). */
  if (text === "PENDING_TRIPS") {
    return buildPendingTripsReply(driver.id);
  }

  if (text?.startsWith("PENDING_")) {
    const bookingId = text.slice("PENDING_".length).trim();
    if (!bookingId) {
      return { body: "❌ Identifiant de course manquant." };
    }
    const booking = await findBookingById(bookingId);
    if (!booking) {
      return { body: "❌ Course introuvable." };
    }

    if (booking.status !== "PENDING") {
      return { body: "ℹ️ Cette offre n'est plus en attente." };
    }
    const candidates = parseCandidateDriverIdsJson(booking.candidateDriverIds);
    const mine = candidates.find(
      (c) =>
        c.driverId === driver.id &&
        c.status.toLowerCase() === "pending",
    );
    if (!mine) {
      return { body: "⚠️ Vous n'avez pas d'offre en attente pour cette course." };
    }

    const { date, time } = formatBookingDateTimeZone(new Date(booking.bookingAt));
    const body = [
      `🚗 *Nouvelle offre*`,
      ``,
      `*Trajet :* ${booking.from} → ${booking.to}`,
      `*Client :* ${booking.clientName}`,
      `*Date :* ${date} à ${time}`,
      `*Durée :* ${booking.durationMin} min`,
      `⏳ *Répondre avant :* ${formatDeadlineTime(booking.driverResponseDeadline ?? null)}`,
    ].join("\n");

    return {
      body,
      interactive: {
        type: "button",
        body: { text: body },
        action: {
          buttons: [
            { type: "reply", reply: { id: `ACCEPT_${booking.id}`, title: "✅ Accepter" } },
            { type: "reply", reply: { id: `REJECT_${booking.id}`, title: "❌ Refuser" } },
            { type: "reply", reply: { id: "PENDING_TRIPS", title: "📋 Offres" } },
          ],
        },
      },
    };
  }

  if (text?.startsWith("START_")) {
    const bookingId = text.slice("START_".length).trim();
    if (!bookingId) {
      return { body: "❌ Identifiant de course manquant." };
    }
    return handleStartTrip(message, bookingId);
  }

  if (text?.startsWith("COMPLETE_")) {
    const bookingId = text.slice("COMPLETE_".length).trim();
    if (!bookingId) {
      return { body: "❌ Identifiant de course manquant." };
    }

    const booking = await findBookingById(bookingId);
    if (!booking) {
      return { body: "❌ Course introuvable." };
    }

    const driver = await getDriverByPhone(message.from);
    if (!driver) {
      return { body: "❌ Chauffeur non reconnu. Vérifiez votre numéro dans le système." };
    }

    if (booking.driverId !== driver.id) {
      return { body: "⚠️ Cette course ne vous est pas assignée." };
    }

    if (booking.status === "COMPLETED") {
      return { body: "ℹ️ Cette course est déjà terminée." };
    }

    if (booking.status !== "IN_PROGRESS") {
      return { body: "⚠️ Seule une course *en cours* peut être terminée." };
    }

    await updateBookingService(bookingId, { status: "completed" });
    const earningsReply = await buildEarningsReply(driver.id);
    const mergedBody = [
      "✅ *Course terminée*",
      "Merci pour votre professionnalisme et bonne route !",
      "",
      earningsReply.body,
    ].join("\n");

    if (earningsReply.interactive?.type === "button") {
      return {
        body: mergedBody,
        interactive: {
          ...earningsReply.interactive,
          body: { text: mergedBody.slice(0, 1024) },
        },
      };
    }

    return { body: mergedBody };
  }

  if (isAcceptAction(text)) {
    if (!message.from) {
      return { body: "❌ Impossible d'identifier votre numéro de téléphone." };
    }

    const bookingId = text
      ? await resolveBookingIdForDriverAction(text, driver.id)
      : null;

    if (!bookingId) {
      return { body: "❌ Identifiant de course manquant." };
    }

    try {
      const booking = await findBookingById(bookingId);
      if (!booking) {
        return { body: "❌ Réservation introuvable." };
      }

      if (
        booking.driverResponseDeadline &&
        new Date(booking.driverResponseDeadline).getTime() <= Date.now()
      ) {
        const candidates = parseCandidateDriverIdsJson(booking.candidateDriverIds);
        const nextCandidates = candidates.map((d) =>
          d.driverId === driver.id ? { ...d, status: "rejected" } : d,
        );
        const allRejected = nextCandidates.every((d) => d.status === "rejected");
        await updateBookingService(bookingId, {
          status: allRejected ? "cancelled" : "pending",
          driverId: null,
          candidateDriverIds: nextCandidates,
        });
        return { body: "⏳ Offre expirée. Le délai de réponse est dépassé." };
      }

      if (booking.driverId === driver.id) {
        return { body: "ℹ️ Vous êtes déjà assigné à cette course." };
      }

      const bookingIsFree =
        booking.driverId === null && booking.status === "PENDING";
      if (!bookingIsFree) {
        return { body: "⚠️ Cette course est déjà assignée à un autre chauffeur." };
      }

      const candidates = parseCandidateDriverIdsJson(
        booking.candidateDriverIds,
      );
      await updateBookingService(bookingId, {
        status: "assigned",
        driverId: driver.id,
        candidateDriverIds: candidates.map((d) =>
          d.driverId !== driver.id
            ? { driverId: d.driverId, status: "rejected" }
            : { driverId: d.driverId, status: "accepted" },
        ),
      });

      void sendBookingAcceptedEmail(toBookingEmailData(booking));

      return { body: WHATSAPP_REPLY_MESSAGES.tripAccepted };
    } catch (error) {
      console.error("[WhatsApp] accept trip:", error);
      return { body: "❌ Impossible d'accepter la course. Réessayez plus tard." };
    }
  }

  if (isRejectAction(text)) {
    if (!message.from) {
      return { body: "❌ Impossible d'identifier votre numéro de téléphone." };
    }

    const bookingId = text
      ? await resolveBookingIdForDriverAction(text, driver.id)
      : null;
    if (!bookingId) {
      return { body: "❌ Identifiant de course manquant." };
    }

    try {
      const booking = await findBookingById(bookingId);
      if (!booking) {
        return { body: "❌ Réservation introuvable." };
      }

      if (booking.driverId === driver.id) {
        return { body: "ℹ️ Vous êtes déjà assigné à cette course." };
      }

      if (booking.status === "CANCELLED") {
        return { body: "ℹ️ Cette réservation est déjà annulée." };
      }

      const bookingIsFree =
        booking.driverId === null && booking.status === "PENDING";
      if (!bookingIsFree) {
        return { body: "⚠️ Cette course est déjà assignée à un autre chauffeur." };
      }

      const candidates = parseCandidateDriverIdsJson(
        booking.candidateDriverIds,
      );

      const myEntry = candidates.find((d) => d.driverId === driver.id);
      if (!myEntry) {
        return { body: "⚠️ Vous n'êtes pas sur la liste des candidats pour cette course." };
      }
      if (myEntry.status !== "pending") {
        return { body: "ℹ️ Vous avez déjà répondu à cette offre." };
      }

      const nextCandidates = candidates.map((d) =>
        d.driverId === driver.id
          ? { driverId: d.driverId, status: "rejected" }
          : d,
      );

      const allRejected = nextCandidates.every((d) => d.status === "rejected");

      if (allRejected) {
        await updateBookingService(bookingId, {
          status: "cancelled",
          driverId: null,
          candidateDriverIds: nextCandidates,
        });

        void sendBookingAllRejectedEmail(toBookingEmailData(booking));
      } else {
        await updateBookingService(bookingId, {
          status: "pending",
          driverId: null,
          candidateDriverIds: nextCandidates,
        });
      }

      return { body: WHATSAPP_REPLY_MESSAGES.tripRejected };
    } catch (error) {
      console.error("[WhatsApp] reject trip:", error);
      return { body: "❌ Impossible de refuser la course. Réessayez plus tard." };
    }
  }

  if (text === "CURRENT_TRIP") {
    const trips = await listBookingsService({ driverId: driver.id });
    const current = trips.find((t) => t.status === "in_progress");

    if (!current) {
      return { body: "📍 *Aucune course en cours*\n\nConsultez *Mes courses* ou *Offres en attente*." };
    }

    const { date, time } = formatBookingDateTimeZone(new Date(current.bookingAt));

    const bodyText = [
      `📍 *Course en cours*`,
      ``,
      `*Client :* ${current.clientName}`,
      `*Téléphone :* ${dashIfEmpty(current.clientPhone)}`,
      `*Trajet :* ${current.from} → ${current.to}`,
      `*Véhicule :* ${dashIfEmpty(current.vehicleName)} (${current.vehicleClass ?? "—"})`,
      `*Date :* ${date} à ${time}`,
      `*Durée :* ${current.durationMin} min`,
      `*Paiement :* ${formatPaymentFr(current.paymentStatus)}`,
      `*Notes :* ${dashIfEmpty(current.notesForDriver)}`,
    ].join("\n");

    return {
      body: bodyText,
      interactive: {
        type: "button",
        body: { text: bodyText },
        action: {
          buttons: [
            { type: "reply", reply: { id: `COMPLETE_${current.id}`, title: "✅ Terminer" } },
            { type: "reply", reply: { id: "MENU_MAIN", title: "📋 Menu" } },
          ],
        },
      },
    };
  }

  if (text === "EARNING" || lower === "earning" || lower === "earnings") {
    return buildEarningsReply(driver.id);
  }

  if (text === "WITHDRAW") {
    await syncCompletedTransfersForDriver(driver.id);
    const payout = await requestDriverManualPayout(driver.id);
    if (payout.status === "no_funds") {
      return { body: "💳 Aucun solde disponible pour le retrait." };
    }
    return {
      body: `✅ *Virement envoyé*\n\nMontant : *${payout.amount.toFixed(2)} EUR*\n\nLes fonds arriveront sur votre compte Stripe sous peu.`,
    };
  }

  if (text === "TRIPS") {
    return buildTripsListReply(driver.id);
  }

  if (text === "PROFILE") {
    const profileMessage = `
👤 *Votre profil*

*Nom :* ${driver.name}
*Téléphone :* ${dashIfEmpty(driver.phone)}
*E-mail :* ${dashIfEmpty(driver.email ?? undefined)}
*Adresse :* ${dashIfEmpty(driver.address ?? undefined)}
*Statut :* ${driver.status ? "🟢 En ligne" : "🔴 Hors ligne"}

📄 *Documents*
Permis de conduire : ${driver.driverLicenseProvided ? "✅" : "❌"}
Carte VTC : ${driver.vtcCardProvided ? "✅" : "❌"}
Passeport : ${driver.passportProvided ? "✅" : "❌"}
Certificat médical : ${driver.medicalCertificateProvided ? "✅" : "❌"}
Assurance : ${driver.insuranceProofProvided ? "✅" : "❌"}

🛣️ *Expérience et options*
Années de conduite : ${driver.drivingExperienceYears}
Ville de base : ${dashIfEmpty(driver.baseCity ?? undefined)}
Rayon d'activité : ${driver.workingRadiusKm} km
Courses de nuit : ${driver.acceptsNightTrips ? "✅" : "❌"}
Clients VIP : ${driver.acceptsVipClients ? "✅" : "❌"}
Transferts aéroport : ${driver.acceptsAirportTransfers ? "✅" : "❌"}
`;

    return { body: profileMessage };
  }
  if (text === "HISTORY") {
    const completed = await listCompletedBookings(driver.id);

    if (completed.length === 0) {
      return { body: "🔍 *Historique*\n\nAucune course terminée pour le moment." };
    }

    const lines = completed.map((t, idx) => {
      const { date, time } = formatBookingDateTimeZone(new Date(t.bookingAt));
      return [
        `*${idx + 1}.* ${t.from} → ${t.to}`,
        `   ${date} ${time} • ${t.vehicle?.vehicleName ?? "-"}`,
        `   ${t.clientName} • ${t.durationMin} min`,
      ].join("\n");
    });

    const body = [
      `🔍 *Historique* (${completed.length} dernières courses)`,
      ...lines,
    ].join("\n\n");

    return { body };
  }
  if (text === "HELP") {
    return { body: WHATSAPP_REPLY_MESSAGES.help };
  }
  if (text === "ONLINE") {
    if (driver.status === true) {
      return { body: "🟢 Vous êtes déjà en ligne." };
    }
    await setDriverOnlineStatus(driver.id, true);
    return { body: WHATSAPP_REPLY_MESSAGES.online };
  }
  if (text === "OFFLINE") {
    if (driver.status === false) {
      return { body: "🔴 Vous êtes déjà hors ligne." };
    }
    await setDriverOnlineStatus(driver.id, false);
    return { body: WHATSAPP_REPLY_MESSAGES.offline };
  }

  if (text === "MENU_MAIN" || text?.startsWith("MENU_MAIN")) {
    return buildMainMenuReply();
  }

  if (isMenuCommand(text, lower)) {
    return buildMainMenuReply(WHATSAPP_REPLY_MESSAGES.menuWelcome);
  }

  return {
    body: WHATSAPP_REPLY_MESSAGES.defaultEcho.replace(
      "{{text}}",
      text?.length && text.length > 200
        ? `${text?.slice(0, 200)}…`
        : (text ?? ""),
    ),
  };
}
