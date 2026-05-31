export const MAIN_MENU_BUTTON_LABEL = "Menu";

export const MAIN_MENU_LIST_ROWS: Array<{
  id: string;
  title: string;
  description?: string;
}> = [
  {
    id: "CURRENT_TRIP",
    title: "📍 Course en cours",
    description: "Trajet actif",
  },
  {
    id: "PENDING_TRIPS",
    title: "📋 Offres en attente",
    description: "Accepter ou refuser",
  },
  {
    id: "EARNING",
    title: "💶 Gains",
    description: "Revenus et retrait",
  },
  {
    id: "TRIPS",
    title: "🚗 Mes courses",
    description: "Payées et en attente",
  },
  {
    id: "PROFILE",
    title: "👤 Profil",
    description: "Vos informations",
  },
  {
    id: "HISTORY",
    title: "🔍 Historique",
    description: "Courses terminées",
  },
  { id: "ONLINE", title: "🟢 En ligne", description: "Recevoir des offres" },
  { id: "OFFLINE", title: "🔴 Hors ligne", description: "Mettre en pause" },
];

export const MAIN_MENU_SECTION_TITLE = "Chauffeur";

export const DEFAULT_TEMPLATE_NAME = "trip_offer_driver";
export const DEFAULT_LANGUAGE = "fr";
