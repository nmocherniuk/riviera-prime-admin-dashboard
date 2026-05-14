/**
 * Bookings area copy — keys in English, user-facing strings in French.
 * Reuse `commonContent` for generic words (filters, payment, etc.).
 */

export const bookingContent = {
  page: {
    title: "Calendrier des réservations",
    /** Replace `{count}` with the number of active transfers scheduled for today. */
    subtitleTemplate: "Suivi de {count} transferts actifs prévus aujourd’hui",
  },

  actions: {
    newBooking: "Nouvelle réservation",
  },

  stats: {
    todaysBookings: "Réservations du jour",
    pending: "En attente",
    completedToday: "Terminées aujourd’hui",
    assignedDrivers: "Chauffeurs assignés",
  },

  filters: {
    status: {
      pending: "En attente",
      assigned: "En cours",
      completed: "Terminé",
      cancelled: "Annulé",
    },
  },

  table: {
    title: "Réservations",
    clientName: "Client",
    vehicleId: "ID véhicule",
    driver: "Chauffeur",
    dateTime: "Date et heure",
    tripState: "État du trajet",
  },

  tripState: {
    confirmed: "Confirmé",
    waitingForPayment: "En attente de paiement",
    awaitingDriverAction: "En attente du chauffeur",
    unknown: "Inconnu",
  },

  detailModal: {
    title: "Détails du trajet",
    close: "Fermer",
    date: "Date",
    time: "Heure",
    duration: "Durée",
    client: "Client",
    route: "Itinéraire",
    vehicle: "Véhicule",
    status: "Statut",
  },

  /** FullCalendar header buttons (day / week / month views). */
  calendarToolbar: {
    day: "Jour",
    week: "Semaine",
    month: "Mois",
  },

  mobile: {
    emptyDay: "Aucune réservation",
  },

  errors: {
    loadBookings: "Échec du chargement des réservations.",
  },
} as const;

export type BookingContent = typeof bookingContent;

/** Interpolates `{count}` in `bookingContent.page.subtitleTemplate`. */
export function formatBookingsPageSubtitle(count: number): string {
  return bookingContent.page.subtitleTemplate.replace(
    "{count}",
    String(count),
  );
}
