export const MAIN_MENU_BUTTON_LABEL = "Menu";

export const MAIN_MENU_LIST_ROWS: Array<{
  id: string;
  title: string;
  description?: string;
}> = [
    { id: "CURRENT_TRIP", title: "📍 Current trip", description: "Active trip" },
    { id: "PENDING_TRIPS", title: "📋 Pending Trips", description: "Awaiting your response" },
    { id: "EARNING", title: "💶 Earnings", description: "Your income" },
    { id: "TRIPS", title: "🚗 My Trips", description: "Paid and unpaid" },
    { id: "PROFILE", title: "👤 Profile", description: "Driver profile" },
    { id: "HISTORY", title: "🔍 History", description: "Past trips" },
    // { id: "HELP", title: "❓ Help", description: "Commands" },
    { id: "ONLINE", title: "🟢 Online", description: "Go online" },
    { id: "OFFLINE", title: "🔴 Offline", description: "Go offline" },
  ];

export const DEFAULT_TEMPLATE_NAME = "trip_offer_driver";
export const DEFAULT_LANGUAGE = "en";