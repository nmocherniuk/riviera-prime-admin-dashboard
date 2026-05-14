/**
 * Shared UI copy — keys in English, user-facing strings in French.
 */

export const commonContent = {
  all: "Tous",

  /** Prefix before colon in filter dropdowns, e.g. "Statut : Tous". */
  filterField: {
    status: "Statut",
    driver: "Chauffeur",
    vehicle: "Véhicule",
    payment: "Paiement",
  },

  search: {
    prefix: "Recherche",
    /** Hint after the colon (full placeholder = prefix + " : " + hint). */
    hint: "client, id ou itinéraire",
  },

  paymentStatus: {
    paid: "Payé",
    unpaid: "Non payé",
  },

  /** Sidebar & shell */
  nav: {
    dashboard: "Tableau de bord",
    bookings: "Réservations",
    drivers: "Chauffeurs",
    fleet: "Flotte",
    pricing: "Tarifs",
    security: "Sécurité",
    payments: "Paiements",
    settings: "Paramètres",
    signOut: "Déconnexion",
    sections: {
      mainMenu: "Menu principal",
      chauffeurServices: "Services chauffeur",
      securityServices: "Services sécurité",
      financials: "Finances",
    },
    brand: {
      name: "Aurevia",
      subtitle: "Admin chauffeur",
    },
  },

  /** Calendar / time range toggles (shared wording). */
  timeView: {
    day: "Jour",
    week: "Semaine",
    month: "Mois",
  },

  /** FullCalendar `buttonText.today` */
  calendar: {
    today: "Aujourd’hui",
    tomorrow: "Demain",
  },

  notAvailable: "N/D",
  notApplicable: "N/A",
  unassigned: "Non assigné",

  boolean: {
    yes: "Oui",
    no: "Non",
  },

  /** Generic data tables & toolbars (drivers orgs, security orgs, etc.). */
  dataTable: {
    actionsColumn: "Actions",
    paginationShowing: "Affichage",
    paginationOf: "sur",
    filter: "Filtrer",
    export: "Exporter",
  },

  status: {
    active: "Actif",
    inactive: "Inactif",
  },
} as const;

export type CommonContent = typeof commonContent;

export function filterOptionAllLabel(
  field: keyof typeof commonContent.filterField,
): string {
  return `${commonContent.filterField[field]} : ${commonContent.all}`;
}

export function searchFieldPlaceholder(): string {
  return `${commonContent.search.prefix} : ${commonContent.search.hint}`;
}
