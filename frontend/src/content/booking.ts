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
    phone: "Téléphone",
    email: "E-mail",
    route: "Itinéraire",
    vehicle: "Véhicule",
    vehicleClass: "Classe",
    price: "Prix",
    notes: "Commentaire",
    paymentStatus: "Statut du paiement",
    driver: "Chauffeur",
    noDriver: "Non assigné",
    status: "Statut",
    cancelTrip: "Annuler la réservation",
    cancelConfirmTitle: "Annuler cette réservation ?",
    cancelConfirmMessage:
      "La réservation sera définitivement supprimée. Un e-mail de confirmation sera envoyé au client.",
    cancelConfirmAction: "Confirmer l'annulation",
    cancelDismiss: "Annuler",
    cancelSuccess: "Réservation annulée. Le client a été notifié par e-mail.",
    cancelError: "Impossible d'annuler la réservation.",
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
    save: "Échec de l'enregistrement de la réservation.",
  },

  managementModal: {
    titles: {
      edit: "Modifier la réservation",
      create: "Nouvelle réservation",
    },
    cancel: "Annuler",
    submitEdit: "Enregistrer la réservation",
    submitCreate: "Créer la réservation",
    bookingId: "Identifiant réservation",
    sections: {
      details: "Détails de la réservation",
      route: "Départ / Arrivée",
    },
    fields: {
      clientName: { label: "Nom du client", placeholder: "Saisir le nom du client" },
      vehicleId: {
        label: "Identifiant véhicule",
        placeholder: "UUID véhicule (facultatif si classe ci-dessous)",
      },
      vehicleClass: { label: "Classe de véhicule" },
      driverId: { label: "Identifiant chauffeur", placeholder: "UUID chauffeur" },
      date: { label: "Date", placeholder: "AAAA-MM-JJ" },
      startTime: { label: "Heure de départ", placeholder: "HH:mm" },
      duration: { label: "Durée", placeholder: "ex. 1 h, 1 h 30 min" },
      from: { label: "Départ", placeholder: "Lieu de prise en charge" },
      to: { label: "Arrivée", placeholder: "Destination" },
    },
    vehicleClasses: {
      comfort: "Confort",
      business: "Affaires",
      van: "Van",
    },
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
