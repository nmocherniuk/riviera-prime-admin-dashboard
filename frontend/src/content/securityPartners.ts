/**
 * Security partners (organizations) UI — keys in English, copy in French.
 * Shared table / export / booleans: `commonContent` (`common.ts`).
 */

export const securityPartnersContent = {
  page: {
    title: "Sécurité / Partenaires",
    subtitle:
      "Gérez les sociétés de sécurité et les agents de protection rapprochée",
  },

  actions: {
    addOrganization: "Ajouter une organisation de sécurité",
  },

  stats: {
    organizations: "Organisations",
    active: "Actives",
    inactive: "Inactives",
  },

  toolbar: {
    searchPlaceholder:
      "Rechercher un partenaire, une société ou un contact…",
  },

  table: {
    title: "Organisations",
    columnCompany: "Société",
    columnContact: "Contact",
    columnEmailPhone: "E-mail / Téléphone",
    columnServiceArea: "Zone d’intervention",
    columnStatus: "Statut",
    idPrefix: "ID",
  },

  rowMenu: {
    viewDetails: "Voir les détails",
    viewBodyguards: "Voir les agents",
    edit: "Modifier",
    delete: "Supprimer",
  },

  empty: {
    unableToLoad: "Impossible de charger les partenaires.",
    noneFound: "Aucune organisation trouvée.",
  },

  errors: {
    loadList: "Échec du chargement des partenaires.",
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
      "Cette action est irréversible. L’enregistrement sera supprimé définitivement.",
  },

  organizationModal: {
    titles: {
      readOnly: "Détails de l’organisation",
      edit: "Modifier l’organisation",
      create: "Nouvelle organisation",
    },
    cancel: "Annuler",
    save: "Enregistrer",
    addOrganization: "Ajouter l’organisation",

    sections: {
      organizationId: "Identifiant organisation",
      companyDetails: "Informations société",
      documents: "Documents",
      operations: "Exploitation",
      financial: "Finances",
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
      sirenOrSiret: { label: "SIREN / SIRET" },
      licenseNumber: { label: "Numéro d’agrément" },
      cnapsNumber: { label: "Numéro CNAPS" },
      registrationDate: { label: "Date d’immatriculation" },
      registeredAddress: { label: "Adresse du siège" },
      officeAddress: { label: "Adresse du bureau" },
      websiteUrl: { label: "URL du site web" },
      directorFullName: { label: "Nom complet du dirigeant" },
    },

    documents: {
      kbisUploaded: "KBIS téléversé",
      licenseUploaded: "Agrément téléversé",
      rcProInsuranceUploaded: "Assurance RC Pro téléversée",
      cnapsAuthorizationUploaded: "Autorisation CNAPS téléversée",
      bankDetailsProvided: "Coordonnées bancaires fournies",
      directorIdCopyProvided: "Copie de pièce d’identité du dirigeant",
      signedPartnershipAgreement: "Convention de partenariat signée",
      additionalCertifications: {
        label: "Certifications complémentaires",
      },
    },

    operations: {
      serviceAreas: { label: "Zones d’intervention" },
      serviceTypes: { label: "Types de prestations" },
      support247: { label: "Assistance 24h/24 et 7j/7" },
      languagesSpoken: { label: "Langues parlées" },
      minBookingHours: { label: "Réservation min. (heures)" },
      mobilizationTimeMinutes: { label: "Délai de mobilisation (min)" },
      agentsCount: { label: "Nombre d’agents" },
      specialRequirements: { label: "Exigences particulières" },
    },

    financial: {
      bankAccountIban: { label: "IBAN du compte bancaire" },
      paymentTerms: { label: "Conditions de paiement" },
      currency: { label: "Devise" },
      hourlyRate: { label: "Tarif horaire" },
      dailyRate: { label: "Tarif journalier" },
      nightRate: { label: "Tarif de nuit" },
      eventRate: { label: "Tarif événementiel" },
      executiveProtectionRate: { label: "Tarif protection rapprochée" },
      minimumBookingAmount: { label: "Montant minimum de réservation" },
      commissionPercent: { label: "Commission (%)" },
    },

    specialRequirements: {
      hasTeamLeader: "Chef d’équipe désigné",
      armedPersonnelAllowed: "Personnel armé autorisé",
      unarmedPersonnelAllowed: "Personnel non armé autorisé",
      internationalMissions: "Missions internationales",
    },

    /** Display labels for stored English `serviceTypes` values. */
    serviceTypeLabels: {
      "Static guarding": "Surveillance statique",
      "Event security": "Sécurité événementielle",
      "VIP escort": "Escorte VIP",
      "Executive protection": "Protection de dirigeants",
      "Close protection": "Protection rapprochée",
      Patrol: "Patrouille",
    } as const,
  },
} as const;

export type SecurityPartnersContent = typeof securityPartnersContent;

export function securityServiceTypeLabel(serviceType: string): string {
  const map =
    securityPartnersContent.organizationModal.serviceTypeLabels as Record<
      string,
      string
    >;
  return map[serviceType] ?? serviceType;
}
