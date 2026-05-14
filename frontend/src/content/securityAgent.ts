/**
 * Security agents (bodyguards) UI — keys in English, copy in French.
 * Shared: `commonContent` (`common.ts`).
 */

export const securityAgentContent = {
  page: {
    withBackLabel: "Retour aux organisations",
    subtitlePrefix: "Gérez les agents de sécurité pour",
    addAgent: "Ajouter un agent",
    organizationMissing: "Organisation introuvable.",
    backToPartners: "Retour aux partenaires",
  },

  errors: {
    loadPartner: "Échec du chargement du partenaire.",
    save: "Échec de l’enregistrement de l’agent.",
    delete: "Échec de la suppression de l’agent.",
  },

  empty: {
    noResults: "Aucun résultat",
  },

  toasts: {
    saved: "Agent enregistré avec succès.",
    deleted: "Agent supprimé avec succès.",
  },

  deleteDialog: {
    title: "Supprimer l’agent ?",
    message: "Cette action est irréversible.",
  },

  table: {
    title: "Agents de sécurité",
    columnName: "Nom",
    columnLicenseCertification: "Agrément / certification",
    columnExperience: "Expérience",
    columnLanguages: "Langues",
    columnStatus: "Statut",
    experienceYearsSuffix: " ans",
  },

  rowMenu: {
    edit: "Modifier",
    delete: "Supprimer",
    viewDetails: "Voir les détails",
  },

  modal: {
    titles: {
      readOnly: "Fiche agent",
      edit: "Modifier l’agent",
      create: "Nouvel agent",
    },
    cancel: "Annuler",
    save: "Enregistrer",
    addAgent: "Ajouter l’agent",
    agentIdSection: "Identifiant agent",

    personal: {
      sectionTitle: "Informations personnelles",
      firstName: { label: "Prénom" },
      lastName: { label: "Nom" },
      birthDate: { label: "Date de naissance" },
      nationality: { label: "Nationalité" },
      phone: { label: "Téléphone" },
      email: { label: "E-mail" },
      address: { label: "Adresse" },
      languagesSpoken: { label: "Langues parlées" },
      emergencyContact: { label: "Contact d’urgence" },
      profilePhotoUrl: { label: "URL de la photo de profil" },
    },

    professional: {
      sectionTitle: "Informations professionnelles",
      employmentStatus: { label: "Statut d’emploi" },
      physicalLevel: { label: "Niveau physique" },
      professionalCardNumber: { label: "Numéro de carte professionnelle" },
      cnapsNumber: { label: "Numéro CNAPS" },
      cardIssuedAt: { label: "Carte délivrée le" },
      cardExpiresAt: { label: "Carte expire le" },
      specializations: {
        label: "Spécialisations",
        placeholder: "Séparées par des virgules",
      },
      experienceYears: { label: "Expérience (années)" },
      additionalLicenses: { label: "Permis ou habilitations complémentaires" },
      flags: {
        hasVipExperience: "Expérience VIP",
        hasEventExperience: "Expérience événementielle",
        hasDriverLicenseB: "Permis B",
        hasFirstAidTraining: "Formation aux premiers secours",
        weaponExperience: "Expérience armes",
        readyForTravel: "Disponible pour déplacements",
        readyForNightShifts: "Disponible pour gardes de nuit",
      },
    },

    documents: {
      sectionTitle: "Documents (fournis)",
    },

    operations: {
      sectionTitle: "Exploitation et tarifs",
      baseCity: { label: "Ville de base" },
      workingRadiusKm: { label: "Rayon d’intervention (km)" },
      availability: { label: "Disponibilité (notes)" },
      status: { label: "Statut" },
      hourlyRate: { label: "Tarif horaire" },
      dailyRate: { label: "Tarif journalier" },
      nightRate: { label: "Tarif de nuit" },
      notes: { label: "Notes" },
      operationsFlags: {
        canWorkInTeam: "Peut travailler en équipe",
        canTravelWithClient: "Peut voyager avec le client",
        canDoDriverSecurity: "Sécurité chauffeur",
      },
    },
  },

  employmentStatus: {
    empty: "—",
    EMPLOYEE: "Salarié",
    FREELANCE: "Indépendant",
    SUBCONTRACTOR: "Sous-traitant",
  } as const,

  physicalLevel: {
    empty: "—",
    LOW: "Faible",
    MEDIUM: "Moyen",
    HIGH: "Élevé",
  } as const,

  documentProvided: {
    passportProvided: "Passeport",
    professionalCardProvided: "Carte professionnelle",
    cnapsProvided: "CNAPS",
    cvProvided: "CV",
    certificatesProvided: "Certificats",
    firstAidCertificateProvided: "Certificat de secourisme",
    driverLicenseProvided: "Permis de conduire",
    backgroundCheckProvided: "Casier judiciaire",
    profilePhotoProvided: "Photo de profil",
    signedContractProvided: "Contrat signé",
  } as const,
} as const;

export type SecurityAgentContent = typeof securityAgentContent;
