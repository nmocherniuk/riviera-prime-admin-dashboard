/**
 * Chauffeur driver organizations UI — keys in English, copy in French.
 * Shared table / export strings live in `commonContent` (`common.ts`).
 */

export const driversContent = {
  page: {
    title: "Gestion des chauffeurs",
    subtitle: "Organisations et leurs chauffeurs",
  },

  actions: {
    addOrganization: "Ajouter une organisation chauffeur",
  },

  stats: {
    organizations: "Organisations",
    active: "Actives",
    inactive: "Inactives",
  },

  toolbar: {
    searchPlaceholder:
      "Rechercher une organisation, une société ou un contact…",
  },

  table: {
    title: "Organisations",
    columnOrganization: "Organisation",
    columnContact: "Contact",
    columnServiceArea: "Zone d’intervention",
    columnStatus: "Statut",
    idPrefix: "ID",
  },

  rowMenu: {
    viewDetails: "Voir les détails",
    edit: "Modifier",
    delete: "Supprimer",
  },

  empty: {
    unableToLoad: "Impossible de charger les organisations.",
    noneFound: "Aucune organisation trouvée.",
  },

  errors: {
    loadList: "Échec du chargement des organisations.",
    loadOne: "Échec du chargement de l’organisation.",
    save: "Échec de l’enregistrement de l’organisation.",
    delete: "Échec de la suppression de l’organisation.",
  },

  toasts: {
    created: "Organisation créée avec succès.",
    updated: "Organisation mise à jour avec succès.",
    deleted: "Organisation supprimée avec succès.",
  },

  deleteDialog: {
    title: "Supprimer l’organisation ?",
    message:
      "Cette action est irréversible. L’organisation sera supprimée définitivement.",
  },

  rowMenuViewDrivers: "Voir les chauffeurs",

  organizationCard: {
    contactPrefix: "Contact :",
    idPrefix: "ID :",
  },

  organizationModal: {
    titles: {
      readOnly: "Détails de l’organisation",
      edit: "Modifier l’organisation",
      create: "Nouvelle organisation",
    },
    cancel: "Annuler",
    save: "Enregistrer",

    sections: {
      organizationId: "Identifiant organisation",
      companyDetails: "Informations société",
      documents: "Documents",
      operations: "Exploitation",
      financial: "Commercial et financier",
    },

    basicInfo: {
      organizationName: {
        label: "Nom de l’organisation",
        helperEdit: "Chiffres uniquement (le cas échéant)",
      },
      email: {
        label: "E-mail",
        helperEdit: "Saisissez une adresse e-mail valide",
      },
      phone: {
        label: "Téléphone",
        helperEdit: "Saisissez un numéro de téléphone valide",
      },
      contactPerson: {
        label: "Personne de contact",
        helperEdit: "Saisissez un nom de contact valide",
      },
      serviceAreas: {
        label: "Zones d’intervention",
        helperEdit: "Zones séparées par des virgules",
      },
      status: { label: "Statut" },
    },

    companyDetails: {
      legalForm: { label: "Forme juridique" },
      sirenOrSiret: {
        label: "SIREN / SIRET",
        helperEdit: "Chiffres uniquement (le cas échéant)",
      },
      vatNumber: { label: "Numéro de TVA", helperEdit: "TVA intracommunautaire (facultatif)" },
      registrationDate: { label: "Date d’immatriculation" },
      registrationCountry: { label: "Pays d’immatriculation" },
      registeredAddress: { label: "Adresse du siège" },
      sameAsRegistered: "L’adresse postale est identique à l’adresse du siège",
      sameAsRegisteredReadOnly: "Adresse postale identique au siège",
      mailingAddress: { label: "Adresse postale" },
      websiteUrl: { label: "URL du site web" },
      directorFullName: { label: "Nom complet du dirigeant" },
      directorPosition: { label: "Fonction du dirigeant" },
    },

    documents: {
      kbisUploaded: "KBIS téléversé",
      rcProInsuranceUploaded: "Assurance RC Pro téléversée",
      transportInsuranceUploaded: "Assurance transport téléversée",
      operatingLicenseProvided: "Licence d’exploitation fournie",
      bankDetailsProvided: "Coordonnées bancaires fournies",
      directorIdCopyProvided: "Copie de pièce d’identité du dirigeant",
      signedPartnershipAgreement: "Convention de partenariat signée",
      additionalCertifications: { label: "Certifications complémentaires" },
      documentNotes: { label: "Notes sur les documents" },
    },

    operations: {
      serviceTypes: { label: "Types de prestations" },
      workingHours: { label: "Horaires de travail", helperEdit: "Exemple : 08:00-22:00" },
      languagesSpoken: { label: "Langues parlées" },
      maxConcurrentBookings: { label: "Réservations simultanées max." },
      minAdvanceBookingHours: { label: "Réservation min. à l’avance (heures)" },
      acceptsUrgentBookings: "Accepte les réservations urgentes",
      support247: "Assistance 24h/24 et 7j/7",
      cancellationPolicy: { label: "Politique d’annulation" },
      specialConditionsNotes: { label: "Conditions particulières" },
    },

    financial: {
      cooperationType: { label: "Type de coopération" },
      ratesNote:
        "Les tarifs clients publics sont définis par véhicule dans Tarification. Le règlement partenaire (commission, minimum partenaire, suppléments) s’applique aux versements après paiement client sur la plateforme.",
      payoutNote:
        "Les coordonnées bancaires de versement ne sont pas collectées ici — utilisez l’onboarding Stripe Connect par chauffeur depuis la fiche chauffeur.",
      paymentTerms: { label: "Conditions de paiement" },
      currency: { label: "Devise" },
      commissionPercent: { label: "Commission (%)" },
      minimumFare: { label: "Tarif minimum / plancher partenaire (EUR)" },
      holidaySurchargePercent: { label: "Supplément jours fériés — règlement (%)" },
      nightSurchargePercent: { label: "Supplément nuit — règlement (%)" },
      hourlyRate: { label: "Tarif horaire (réf. org.)" },
      transferBaseRate: { label: "Tarif de base transfert (réf. org.)" },
      waitingTimeFee: { label: "Frais d’attente" },
      cooperationOptions: {
        commission: "Commission",
        fixedRate: "Tarif fixe",
        custom: "Personnalisé",
      },
    },

    /** Display labels for stored English `serviceTypes` values. */
    serviceTypeLabels: {
      "Airport Transfer": "Transfert aéroport",
      "Hourly Service": "Service à l’heure",
      "Event Transport": "Transport événementiel",
      "VIP Transport": "Transport VIP",
      "Long Distance": "Longue distance",
      "Last-Minute Booking": "Réservation de dernière minute",
    } as const,
  },
} as const;

export type DriversContent = typeof driversContent;

export function driverServiceTypeLabel(serviceType: string): string {
  const map =
    driversContent.organizationModal.serviceTypeLabels as Record<string, string>;
  return map[serviceType] ?? serviceType;
}
