/**
 * Vehicle pricing UI — keys in English, copy in French.
 * Table chrome (Actions column, pagination) uses `commonContent` (`common.ts`).
 * Vehicle class badges reuse `fleetClassLabel` from `vehicles.ts`.
 */

export const pricingContent = {
  page: {
    title: "Tarification",
    subtitle:
      "Définissez le tarif à l’heure ou au kilomètre pour chaque véhicule",
  },

  table: {
    title: "Tarification des véhicules",
    columnVehicle: "Véhicule",
    columnClass: "Classe",
    columnPricePerHour: "Prix à l’heure",
    columnPricePerKm: "Prix au km",
  },

  rowMenu: {
    edit: "Modifier",
  },

  mobile: {
    perHour: "À l’heure",
    perKm: "Au km",
    summaryMin: "Forfait min",
    summaryHoliday: "Fériés",
    summaryNight: "Nuit",
  },

  empty: {
    unableToLoad: "Impossible de charger les tarifs.",
    noResults: "Aucun résultat",
  },

  errors: {
    loadList: "Échec du chargement des tarifs.",
  },

  toasts: {
    saved: "Tarifs enregistrés avec succès.",
    saveFailed: "Échec de l’enregistrement des tarifs.",
  },

  modal: {
    titlePrefix: "Modifier le tarif — ",
    cancel: "Annuler",
    save: "Enregistrer",
    fields: {
      perHour: {
        label: "Prix à l’heure",
        placeholder: "0",
      },
      perKm: {
        label: "Prix au km",
        placeholder: "0",
      },
      minimumFare: {
        label: "Forfait minimum (EUR)",
      },
      holidaySurchargePercent: {
        label: "Supplément jours fériés (%)",
      },
      nightSurchargePercent: {
        label: "Supplément nuit (%)",
      },
    },
  },
} as const;

export type PricingContent = typeof pricingContent;
