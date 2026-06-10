import type { EmailLocale } from "../locale.js";

export type StripeOnboardingEmailCopy = {
  subject: string;
  heading: string;
  greeting: (name: string) => string;
  body: string;
  cta: string;
  linkFallback: string;
};

const COPY: Record<EmailLocale, StripeOnboardingEmailCopy> = {
  en: {
    subject: "Riviera Prime — connect your Stripe account for payouts",
    heading: "Complete your payout setup",
    greeting: (name) => `Hello <strong>${name}</strong>,`,
    body: "To receive payouts, open the secure link below on your phone or computer and complete Stripe onboarding. You do not need a driver portal or admin login — the link is all you need. Bank details are collected only by Stripe.",
    cta: "Stripe account — connect payouts",
    linkFallback: "If the button does not work, copy this link into your browser:",
  },
  fr: {
    subject: "Riviera Prime — connectez votre compte Stripe pour les paiements",
    heading: "Finalisez la configuration des paiements",
    greeting: (name) => `Bonjour <strong>${name}</strong>,`,
    body: "Pour recevoir vos paiements, ouvrez le lien sécurisé ci-dessous sur votre téléphone ou ordinateur et complétez l'onboarding Stripe. Aucun portail chauffeur ni connexion admin n'est requis — le lien suffit. Les coordonnées bancaires sont collectées uniquement par Stripe.",
    cta: "Compte Stripe — activer les paiements",
    linkFallback: "Si le bouton ne fonctionne pas, copiez ce lien dans votre navigateur :",
  },
};

export function getStripeOnboardingEmailCopy(
  locale: EmailLocale,
): StripeOnboardingEmailCopy {
  return COPY[locale];
}
