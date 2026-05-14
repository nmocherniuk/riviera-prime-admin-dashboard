/**
 * Fleet (vehicles) UI — keys in English, copy in French.
 * Shared table / export strings live in `commonContent` (`common.ts`).
 */

export const vehiclesContent = {
  page: {
    title: "Gestion de la flotte",
    subtitle: "Gérez votre flotte premium et vos indicateurs de performance",
  },

  actions: {
    addFleet: "Ajouter un véhicule",
  },

  stats: {
    active: "Actifs",
    inactive: "Inactifs",
    totalFleet: "Flotte totale",
  },

  toolbar: {
    searchPlaceholder:
      "Rechercher un client, un identifiant ou un lieu…",
  },

  table: {
    title: "Flotte",
    columnVehicle: "Véhicule",
    columnLicensePlate: "Immatriculation",
    columnClass: "Classe",
    columnStatus: "Statut",
    columnColor: "Couleur",
    idPrefix: "ID",
    emptyValue: "—",
  },

  rowMenu: {
    edit: "Modifier",
    delete: "Supprimer",
  },

  /** Display labels for API / form enum `FleetStatus`. */
  fleetStatus: {
    ACTIVE: "Actif",
    INACTIVE: "Inactif",
  } as const,

  /** Display labels for `FleetClass` values stored in data. */
  fleetClass: {
    Comfort: "Confort",
    Business: "Affaires",
    Van: "Van",
  } as const,

  empty: {
    unableToLoad: "Impossible de charger les véhicules.",
    noResults: "Aucun résultat",
  },

  errors: {
    loadList: "Échec du chargement des véhicules.",
  },

  toasts: {
    deleted: "Le véhicule a été supprimé avec succès.",
    deleteFailed: "Échec de la suppression du véhicule.",
    saved: "Le véhicule a été enregistré avec succès.",
    saveFailed: "Échec de l’enregistrement du véhicule.",
  },

  deleteDialog: {
    title: "Supprimer le véhicule ?",
    message:
      "Cette action est irréversible. Le véhicule sera supprimé définitivement.",
  },

  modal: {
    titles: {
      readOnly: "Fiche véhicule",
      edit: "Modifier le véhicule",
      create: "Nouveau véhicule",
    },
    cancel: "Annuler",
    submitSave: "Enregistrer",
    submitAdd: "Ajouter",
    sections: {
      vehicleId: "Identifiant véhicule",
      vehicleInformation: "Informations véhicule",
      entityBinding: "Rattachement",
    },
    fields: {
      vehicleName: {
        label: "Nom du véhicule",
        placeholder: "Saisir le nom du véhicule",
      },
      year: {
        label: "Année",
        placeholder: "ex. 2024",
      },
      color: {
        label: "Couleur",
        placeholder: "Saisir la couleur",
      },
      licensePlate: {
        label: "Immatriculation",
        placeholder: "Saisir l’immatriculation",
      },
      imageUrl: {
        label: "URL de l’image (facultatif)",
        placeholder: "https://exemple.com/voiture.jpg",
      },
      description: {
        label: "Description",
        placeholder: "Brève description marketing pour la page",
      },
      class: {
        label: "Classe",
      },
      status: {
        label: "Statut",
      },
      passengers: {
        label: "Passagers",
      },
      baggageCount: {
        label: "Nombre de bagages",
      },
      vehicleType: {
        label: "Type de véhicule",
        placeholder: "Berline de luxe",
      },
      transmission: {
        label: "Transmission",
        placeholder: "Automatique",
      },
      interior: {
        label: "Intérieur",
        placeholder: "Cuir",
      },
      amenitiesText: {
        label: "Équipements (séparés par des virgules)",
        placeholder: "Climatisation, Wi‑Fi à bord, chargeurs téléphone",
      },
      organizationOptional: {
        label: "Organisation (facultatif)",
      },
      driverOptional: {
        label: "Chauffeur (facultatif)",
      },
    },
    binding: {
      none: "Aucune",
      notAssigned: "Non assigné",
      addOrgAndDriver: "Ajouter une organisation et un chauffeur",
      noOrganizationsHelper:
        "Aucune organisation chauffeur pour le moment — créez-en une dans Partenaires d’abord",
    },
  },
} as const;

export type VehiclesContent = typeof vehiclesContent;

export function fleetClassLabel(classKey: string): string {
  const map = vehiclesContent.fleetClass as Record<string, string>;
  return map[classKey] ?? classKey;
}
