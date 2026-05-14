/**
 * Payments UI — keys in English, copy in French.
 * Filter “all” rows use `filterOptionAllLabel` / `commonContent` (`common.ts`).
 */

export const paymentsContent = {
  page: {
    title: "Paiements",
    subtitle: "Gérez les paiements clients et les transactions",
  },

  header: {
    withdraw: "Retirer",
    withdrawing: "Retrait en cours…",
  },

  stats: {
    todayRevenue: "Chiffre du jour",
    unpaid: "Non payés",
    paid: "Payés",
    grossSnapshots: "Brut (instantanés)",
    partnerPayoutsSnapshots: "Reversements partenaires (instantanés)",
    platformMarginSnapshots: "Marge plateforme (instantanés)",
    availableBalance: "Solde disponible",
  },

  filters: {
    dateFrom: "Du",
    dateTo: "Au",
    searchPlaceholder: "Client ou ID de réservation",
  },

  table: {
    title: "Paiements",
    columnBookingId: "ID réservation",
    columnClient: "Client",
    columnRoute: "Trajet",
    columnAmount: "Montant",
    columnPaymentStatus: "Statut du paiement",
    columnPaymentMethod: "Moyen de paiement",
    columnDate: "Date",
  },

  /** Chip labels for API `paymentStatus` values. */
  paymentStatusLabel: {
    paid: "Payé",
    unpaid: "Non payé",
  } as const,

  rowMenu: {
    capture: "Encaisser le paiement",
    refund: "Rembourser",
    resendLink: "Renvoyer le lien de paiement",
  },

  errors: {
    loadList: "Échec du chargement des paiements.",
    withdrawGeneric: "Échec du retrait du solde.",
  },

  detailModal: {
    titlePrefix: "Paiement — ",
    client: "Client",
    booking: "Réservation",
    tripRoute: "Trajet",
    vehicle: "Véhicule",
    driver: "Chauffeur",
    amountCharged: "Montant facturé",
    customerPriceSnapshot: "Prix client (instantané)",
    partnerPayoutSnapshot: "Reversement partenaire (instantané)",
    platformMarginSnapshot: "Marge plateforme (instantané)",
    stripePaymentIntent: "PaymentIntent Stripe",
    stripePaymentStatus: "Statut paiement Stripe",
    paymentMethod: "Moyen de paiement",
    timeline: "Historique du paiement",
  },

  toasts: {
    withdrawSuccessPrefix: "Retrait effectué :",
  },
} as const;

export type PaymentsContent = typeof paymentsContent;

export function paymentStatusChipLabel(status: string): string {
  const map = paymentsContent.paymentStatusLabel as Record<string, string>;
  return map[status] ?? status;
}
