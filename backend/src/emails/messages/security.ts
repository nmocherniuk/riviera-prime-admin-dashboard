import type { EmailLocale } from "../locale.js";
import type { SecurityRequestBody } from "../../modules/securityRequest/securityRequest.schemas.js";

const SERVICE_CATEGORY_LABELS: Record<
  EmailLocale,
  Record<SecurityRequestBody["serviceCategory"], string>
> = {
  en: {
    executive_protection: "Executive protection",
    event_security: "Event security",
    property_private: "Property & private",
    business_commercial: "Business & commercial",
    advanced_specialized: "Advanced & specialized",
  },
  fr: {
    executive_protection: "Protection rapprochée",
    event_security: "Sécurité événementielle",
    property_private: "Propriété & privé",
    business_commercial: "Entreprise & commercial",
    advanced_specialized: "Spécialisé avancé",
  },
};

const DURATION_LABELS: Record<
  EmailLocale,
  Record<SecurityRequestBody["duration"], string>
> = {
  en: {
    "4": "4 hours",
    "8": "8 hours",
    "12": "12 hours",
    "24": "24 hours",
    multi: "Multi-day",
  },
  fr: {
    "4": "4 heures",
    "8": "8 heures",
    "12": "12 heures",
    "24": "24 heures",
    multi: "Plusieurs jours",
  },
};

const DRESS_CODE_LABELS: Record<EmailLocale, Record<string, string>> = {
  en: {
    "": "—",
    business: "Business",
    formal: "Formal",
    discreet: "Discreet",
    casual: "Casual",
  },
  fr: {
    "": "—",
    business: "Business",
    formal: "Formel",
    discreet: "Discret",
    casual: "Décontracté",
  },
};

export type SecurityEmailCopy = {
  labels: {
    serviceCategory: string;
    serviceType: string;
    location: string;
    coordinates: string;
    schedule: string;
    duration: string;
    agents: string;
    client: string;
    email: string;
    phone: string;
    company: string;
    languages: string;
    dressCode: string;
    vehicleRequired: string;
    armedRequired: string;
    specialRequirements: string;
    yes: string;
    no: string;
    dash: string;
    otherPrefix: string;
  };
  admin: {
    subject: (clientName: string, category: string) => string;
    heading: string;
    intro: string;
    submittedAt: (iso: string) => string;
  };
  client: {
    subject: string;
    heading: string;
    greeting: (name: string) => string;
    processing: string;
    contactSoon: (email: string, phone: string) => string;
    footer: string;
  };
};

const COPY: Record<EmailLocale, SecurityEmailCopy> = {
  en: {
    labels: {
      serviceCategory: "Service category",
      serviceType: "Service type",
      location: "Location",
      coordinates: "Coordinates",
      schedule: "Schedule",
      duration: "Duration",
      agents: "Agents",
      client: "Client",
      email: "Email",
      phone: "Phone",
      company: "Company",
      languages: "Languages",
      dressCode: "Dress code",
      vehicleRequired: "Vehicle required",
      armedRequired: "Armed required",
      specialRequirements: "Special requirements",
      yes: "Yes",
      no: "No",
      dash: "—",
      otherPrefix: "Other",
    },
    admin: {
      subject: (clientName, category) =>
        `Security request — ${clientName} (${category})`,
      heading: "New security request",
      intro: "A new security service request was submitted from the landing page.",
      submittedAt: (iso) => `Submitted at ${iso}`,
    },
    client: {
      subject: "Aurevia — your security request is being processed",
      heading: "Request received",
      greeting: (name) => `Hello <strong>${name}</strong>,`,
      processing:
        "Thank you for your security service request. Your application is now <strong>being processed</strong>.",
      contactSoon: (email, phone) =>
        `Our team will contact you as soon as possible at <strong>${email}</strong> or <strong>${phone}</strong>.`,
      footer:
        "If you need to update your request, reply to this email or contact Aurevia support.",
    },
  },
  fr: {
    labels: {
      serviceCategory: "Catégorie de service",
      serviceType: "Type de service",
      location: "Lieu",
      coordinates: "Coordonnées",
      schedule: "Planning",
      duration: "Durée",
      agents: "Agents",
      client: "Client",
      email: "E-mail",
      phone: "Téléphone",
      company: "Société",
      languages: "Langues",
      dressCode: "Tenue",
      vehicleRequired: "Véhicule requis",
      armedRequired: "Armement requis",
      specialRequirements: "Exigences particulières",
      yes: "Oui",
      no: "Non",
      dash: "—",
      otherPrefix: "Autre",
    },
    admin: {
      subject: (clientName, category) =>
        `Demande sécurité — ${clientName} (${category})`,
      heading: "Nouvelle demande sécurité",
      intro:
        "Une nouvelle demande de service de sécurité a été envoyée depuis le site.",
      submittedAt: (iso) => `Envoyée le ${iso}`,
    },
    client: {
      subject: "Aurevia — votre demande est en cours de traitement",
      heading: "Demande reçue",
      greeting: (name) => `Bonjour <strong>${name}</strong>,`,
      processing:
        "Merci pour votre demande de service de sécurité. Votre dossier est <strong>en cours de traitement</strong>.",
      contactSoon: (email, phone) =>
        `Notre équipe vous contactera dès que possible à <strong>${email}</strong> ou au <strong>${phone}</strong>.`,
      footer:
        "Pour modifier votre demande, répondez à cet e-mail ou contactez le support Aurevia.",
    },
  },
};

export function getSecurityEmailCopy(locale: EmailLocale): SecurityEmailCopy {
  return COPY[locale];
}

export function getSecurityCategoryLabel(
  locale: EmailLocale,
  category: SecurityRequestBody["serviceCategory"],
): string {
  return SERVICE_CATEGORY_LABELS[locale][category];
}

export function getSecurityDurationLabel(
  locale: EmailLocale,
  duration: SecurityRequestBody["duration"],
): string {
  return DURATION_LABELS[locale][duration];
}

export function getSecurityDressCodeLabel(
  locale: EmailLocale,
  dressCode: string,
): string {
  return DRESS_CODE_LABELS[locale][dressCode] ?? dressCode;
}

export function yesNoLabel(locale: EmailLocale, value: string): string {
  const copy = COPY[locale].labels;
  if (value === "yes") return copy.yes;
  if (value === "no") return copy.no;
  return copy.dash;
}
