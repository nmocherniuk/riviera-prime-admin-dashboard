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
} as const;

export type DriversContent = typeof driversContent;
