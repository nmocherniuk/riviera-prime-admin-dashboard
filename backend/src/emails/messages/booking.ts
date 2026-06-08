import type { EmailLocale } from "../locale.js";

export type BookingEmailCopy = {
  common: {
    route: string;
    date: string;
    duration: string;
    amountPaid: string;
    paymentReference: string;
    bookingId: string;
    paymentLinkNote: (payBefore: string) => string;
  };
  pending: {
    subject: string;
    heading: string;
    greeting: (name: string) => string;
    body: string;
    followUp: string;
    cta: string;
  };
  accepted: {
    subject: string;
    heading: string;
    greeting: (name: string) => string;
    body: string;
    cta: string;
  };
  rejected: {
    subject: string;
    heading: string;
    greeting: (name: string) => string;
    body: string;
    followUp: string;
    cta: string;
  };
  receipt: {
    subject: string;
    heading: string;
    greeting: (name: string) => string;
    body: string;
    thanks: string;
  };
};

const COPY: Record<EmailLocale, BookingEmailCopy> = {
  en: {
    common: {
      route: "Route",
      date: "Date",
      duration: "Duration",
      amountPaid: "Amount paid",
      paymentReference: "Payment reference",
      bookingId: "Booking ID",
      paymentLinkNote: (payBefore) =>
        `Please complete payment by ${payBefore}. This link is unique to your booking.`,
    },
    pending: {
      subject: "Aurevia — your booking request is being processed",
      heading: "We received your booking request",
      greeting: (name) => `Hello <strong>${name}</strong>,`,
      body: "Thank you for your request. We are currently checking driver availability for your trip.",
      followUp:
        "As soon as a driver confirms, we will email you with the next steps for payment.",
      cta: "Back to website",
    },
    accepted: {
      subject: "Your Aurevia trip is ready — complete payment",
      heading: "Your trip is confirmed!",
      greeting: (name) => `Hello <strong>${name}</strong>,`,
      body: "Great news — a driver has been assigned to your trip. To complete your reservation, please proceed with payment.",
      cta: "Pay & Reserve",
    },
    rejected: {
      subject: "Aurevia — no drivers available for your trip",
      heading: "No available drivers",
      greeting: (name) => `Hello <strong>${name}</strong>,`,
      body: "Unfortunately, no drivers are currently available for your requested trip. We apologize for the inconvenience.",
      followUp:
        "Please try booking again later — our driver network is constantly expanding and someone may become available soon.",
      cta: "Try Again",
    },
    receipt: {
      subject: "Your reservation is confirmed",
      heading: "Your reservation is confirmed",
      greeting: (name) => `Hello <strong>${name}</strong>,`,
      body: "Your payment has been received and your reservation is confirmed.",
      thanks: "Thank you for choosing Riviera Prime.",
    },
  },
  fr: {
    common: {
      route: "Trajet",
      date: "Date",
      duration: "Durée",
      amountPaid: "Montant payé",
      paymentReference: "Référence de paiement",
      bookingId: "Référence réservation",
      paymentLinkNote: (payBefore) =>
        `Veuillez finaliser le paiement avant le ${payBefore}. Ce lien est unique à votre réservation.`,
    },
    pending: {
      subject: "Aurevia — votre demande est en cours de traitement",
      heading: "Nous avons bien reçu votre demande",
      greeting: (name) => `Bonjour <strong>${name}</strong>,`,
      body: "Merci pour votre demande. Nous vérifions actuellement la disponibilité d'un chauffeur pour votre trajet.",
      followUp:
        "Dès qu'un chauffeur confirme, nous vous enverrons un e-mail avec les étapes de paiement.",
      cta: "Retour au site",
    },
    accepted: {
      subject: "Votre trajet Aurevia est prêt — finalisez le paiement",
      heading: "Votre trajet est confirmé !",
      greeting: (name) => `Bonjour <strong>${name}</strong>,`,
      body: "Bonne nouvelle — un chauffeur a été assigné à votre trajet. Pour finaliser votre réservation, veuillez procéder au paiement.",
      cta: "Payer et réserver",
    },
    rejected: {
      subject: "Aurevia — aucun chauffeur disponible",
      heading: "Aucun chauffeur disponible",
      greeting: (name) => `Bonjour <strong>${name}</strong>,`,
      body: "Malheureusement, aucun chauffeur n'est disponible pour votre trajet pour le moment. Nous nous excusons pour la gêne occasionnée.",
      followUp:
        "Veuillez réessayer plus tard — notre réseau de chauffeurs s'agrandit régulièrement.",
      cta: "Réessayer",
    },
    receipt: {
      subject: "Votre réservation est confirmée",
      heading: "Votre réservation est confirmée",
      greeting: (name) => `Bonjour <strong>${name}</strong>,`,
      body: "Votre paiement a bien été reçu et votre réservation est confirmée.",
      thanks: "Merci d'avoir choisi Riviera Prime.",
    },
  },
};

export function getBookingEmailCopy(locale: EmailLocale): BookingEmailCopy {
  return COPY[locale];
}
