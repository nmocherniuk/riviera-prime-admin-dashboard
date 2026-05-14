/**
 * Dashboard copy — keys in English, user-facing strings in French.
 */
export const dashboardContent = {
  header: {
    title: "Tableau de bord",
    subtitle:
      "Consultez votre tableau de bord et l’analyse de votre activité.",
  },
  stats: {
    todaysRides: "Courses du jour",
    todaysRevenue: "Chiffre d’affaires du jour",
    activeDrivers: "Chauffeurs actifs",
    awaitingConfirmation: "En attente de confirmation",
  },
  revenue: {
    sectionTitle: "Performance du chiffre d’affaires",
    chartAriaLabel: "Graphique du chiffre d’affaires par période",
    periodDay: "Jour",
    periodWeek: "Semaine",
    periodMonth: "Mois",
    chartDatasetLabel: "Chiffre d’affaires (EUR)",
    tooltipRevenuePrefix: "Chiffre d’affaires :",
    loadingMessage: "Chargement du chiffre d’affaires…",
  },
  bookings: {
    sectionTitle: "Aperçu des réservations",
    chartAriaLabel: "Graphique de l’aperçu des réservations",
    chartDatasetLabel: "Réservations",
  },
  charts: {
    metricFallback: "Indicateur",
  },
  errors: {
    loadOverview: "Échec du chargement du tableau de bord.",
  },
} as const;

export type DashboardContent = typeof dashboardContent;
