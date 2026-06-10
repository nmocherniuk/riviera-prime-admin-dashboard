/**
 * Individual driver agents UI — keys in English, copy in French.
 * Shared: `commonContent` (`common.ts`).
 */

export const driverAgentsContent = {
  page: {
    subtitle: "Gérer les chauffeurs",
    backToOrganizations: "Retour aux organisations",
    addDriver: "Ajouter un chauffeur",
  },

  stats: {
    active: "Actifs",
    inactive: "Inactifs",
  },

  errors: {
    loadOrganization: "Échec du chargement de l’organisation.",
    loadDrivers: "Échec du chargement des chauffeurs.",
    save: "Échec de l’enregistrement du chauffeur.",
    delete: "Échec de la suppression du chauffeur.",
    sendWhatsApp: "Échec de l’envoi du message WhatsApp de test.",
    missingDriverId: "Identifiant chauffeur manquant.",
  },

  empty: {
    noResults: "Aucun résultat",
  },

  toasts: {
    created: "Chauffeur créé avec succès.",
    updated: "Chauffeur mis à jour avec succès.",
    deleted: "Chauffeur supprimé avec succès.",
    whatsAppSent: "Message WhatsApp de test envoyé avec succès.",
  },

  deleteDialog: {
    title: "Supprimer le chauffeur ?",
    message:
      "Cette action est irréversible. Le chauffeur sera supprimé définitivement.",
  },

  table: {
    title: "Chauffeurs",
    columnName: "Nom du chauffeur",
    columnVehicle: "Véhicule",
    columnStatus: "Statut",
    columnRides: "Courses",
    columnEarning: "Revenus",
    idPrefix: "ID",
    noVehicleAssigned: "Aucun véhicule assigné",
    ridesPrefix: "Courses :",
  },

  rowMenu: {
    edit: "Modifier",
    delete: "Supprimer",
    sendTestWhatsApp: "Envoyer un WhatsApp de test",
  },

  vehicle: {
    unknown: "Véhicule inconnu",
    unnamedDriver: "Chauffeur sans nom",
  },

  modal: {
    titles: {
      readOnly: "Fiche chauffeur",
      edit: "Gestion du chauffeur",
    },
    cancel: "Annuler",
    save: "Enregistrer",
    driverIdSection: "Identifiant chauffeur",

    basic: {
      sectionTitle: "Informations de base",
      name: { label: "Nom", placeholder: "Saisir le nom" },
      phone: { label: "Téléphone", placeholder: "Saisir le numéro de téléphone" },
      email: { label: "E-mail", placeholder: "Saisir l’adresse e-mail" },
      address: { label: "Adresse" },
      nationality: { label: "Nationalité" },
      birthDate: { label: "Date de naissance" },
      languagesSpoken: { label: "Langues parlées" },
      emergencyContact: { label: "Contact d’urgence" },
      status: { label: "Statut" },
    },

    professional: {
      sectionTitle: "Informations professionnelles",
      employmentStatus: { label: "Statut d’emploi" },
      vtcCardNumber: { label: "Numéro de carte VTC" },
      licenseNumber: { label: "Numéro de permis" },
      licenseCategory: { label: "Catégorie de permis" },
      experienceYears: { label: "Années d’expérience" },
      languageLevel: { label: "Niveau linguistique" },
      notSet: "Non renseigné",
      flags: {
        hasVipExperience: "Expérience VIP",
        hasEventExperience: "Expérience événementielle",
        dressCodeReady: "Tenue vestimentaire conforme",
      },
    },

    documents: {
      sectionTitle: "Documents",
      flags: {
        passportProvided: "Passeport",
        driverLicenseProvided: "Permis de conduire",
        vtcCardProvided: "Carte VTC",
        criminalRecordProvided: "Casier judiciaire",
        medicalCertificateProvided: "Certificat médical",
        insuranceProofProvided: "Attestation d’assurance",
        profilePhotoProvided: "Photo de profil",
        signedContractProvided: "Contrat signé",
      },
    },

    operations: {
      sectionTitle: "Exploitation et véhicule",
      vehicleId: { label: "Identifiant véhicule" },
      vehicleIdOptional: { label: "Identifiant véhicule (facultatif)", placeholder: "UUID du véhicule" },
      vehicle: { label: "Véhicule", placeholder: "Saisir le modèle du véhicule" },
      vehiclePlate: { label: "Immatriculation" },
      vehicleColor: { label: "Couleur du véhicule" },
      baseCity: { label: "Ville de base" },
      workingRadiusKm: { label: "Rayon d’intervention (km)" },
      availabilityDays: { label: "Jours de disponibilité (séparés par des virgules)" },
      availabilityHours: { label: "Heures de disponibilité" },
      status: { label: "Statut" },
      rides: { label: "Courses" },
      todayShift: { label: "Service du jour" },
      flags: {
        acceptsLongDistance: "Accepte les longues distances",
        acceptsNightTrips: "Accepte les trajets de nuit",
        acceptsAirportTransfers: "Accepte les transferts aéroport",
        acceptsVipClients: "Accepte les clients VIP",
        hasOwnVehicle: "Dispose de son propre véhicule",
      },
    },

    payout: {
      sectionTitle: "Versements (Stripe)",
      description:
        "Envoyez au chauffeur un lien unique pour l’onboarding Stripe — sans application admin ni JWT, il l’ouvre sur téléphone ou ordinateur. Les coordonnées bancaires restent uniquement dans Stripe.",
      badges: {
        notConnected: "Non connecté",
        pending: "En attente",
        active: "Actif",
      },
      totalEarned: "Total gagné :",
      availableToWithdraw: "Disponible au retrait :",
      pendingTrips: "Courses en attente :",
      connectedMessage: "✔ Compte Stripe connecté — versements activés",
      addEmailWarning:
        "Ajoutez une adresse e-mail pour ce chauffeur avant d’envoyer le lien de configuration Stripe.",
      sendButton: "Envoyer l’e-mail d’onboarding Stripe",
      sending: "Envoi…",
      toastSuccess: "Lien d’onboarding envoyé à l’e-mail du chauffeur.",
      toastError: "Impossible d’envoyer l’e-mail",
      readOnlyPending:
        "Onboarding non terminé — le chauffeur peut utiliser le lien reçu par e-mail.",
      readOnlyNotSetup:
        "Stripe Connect n’est pas encore configuré pour ce chauffeur.",
    },
  },

  employmentStatus: {
    empty: "—",
    EMPLOYEE: "Salarié",
    FREELANCE: "Indépendant",
    SUBCONTRACTOR: "Sous-traitant",
  } as const,
} as const;

export type DriverAgentsContent = typeof driverAgentsContent;
