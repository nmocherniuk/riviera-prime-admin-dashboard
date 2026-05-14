import { toNumber } from "../../../../../utils/transform";
import type { SecurityOrganization, SecurityOrganizationFormValues } from "../../data/types";
import { defaultFormValues } from "./securityOrganizationForm.types";

export function securityOrganizationToFormValues(
  org: SecurityOrganization | null,
): SecurityOrganizationFormValues {
  if (!org) return defaultFormValues;

  return {
    // Basic Information
    id: org.id || "",
    organizationName: org.organizationName,
    email: org.email,
    phone: org.phone,
    serviceAreas: org.serviceAreas,
    contactPerson: org.contactPerson,
    status: org.status,

    // Company Information
    legalForm: org.securityDetails?.legalForm ?? "",
    sirenOrSiret: org.securityDetails?.sirenOrSiret ?? "",
    licenseNumber: org.securityDetails?.licenseNumber ?? "",
    cnapsNumber: org.securityDetails?.cnapsNumber ?? "",
    registrationDate: org.securityDetails?.registrationDate ?? "",
    registeredAddress: org.securityDetails?.registeredAddress ?? "",
    officeAddress: org.securityDetails?.officeAddress ?? "",
    websiteUrl: org.securityDetails?.websiteUrl ?? "",
    directorFullName: org.securityDetails?.directorFullName ?? "",

    // Documents metadata
    kbisUploaded: org.securityDetails?.kbisUploaded ?? false,
    licenseUploaded: org.securityDetails?.licenseUploaded ?? false,
    rcProInsuranceUploaded: org.securityDetails?.rcProInsuranceUploaded ?? false,
    cnapsAuthorizationUploaded:
      org.securityDetails?.cnapsAuthorizationUploaded ?? false,
    bankDetailsProvided: org.securityDetails?.bankDetailsProvided ?? false,
    directorIdCopyProvided: org.securityDetails?.directorIdCopyProvided ?? false,
    signedPartnershipAgreement:
      org.securityDetails?.signedPartnershipAgreement ?? false,
    additionalCertifications: org.securityDetails?.additionalCertifications ?? "",

    // Operations
    serviceTypes: org.securityDetails?.serviceTypes ?? [],
    support24_7: org.securityDetails?.support24_7 ?? false,
    minBookingHours:
      org.securityDetails?.minBookingHours != null
        ? String(org.securityDetails.minBookingHours)
        : "",
    mobilizationTimeMinutes:
      org.securityDetails?.mobilizationTimeMinutes != null
        ? String(org.securityDetails.mobilizationTimeMinutes)
        : "",
    agentsCount:
      org.securityDetails?.agentsCount != null ? String(org.securityDetails.agentsCount) : "",
    languagesSpoken: org.securityDetails?.languagesSpoken ?? [],
    hasTeamLeader: org.securityDetails?.hasTeamLeader ?? false,
    armedPersonnelAllowed: org.securityDetails?.armedPersonnelAllowed ?? false,
    unarmedPersonnelAllowed: org.securityDetails?.unarmedPersonnelAllowed ?? true,
    internationalMissions: org.securityDetails?.internationalMissions ?? false,
    specialRequirements: org.securityDetails?.specialRequirements ?? "",

    // Financial
    hourlyRate:
      org.securityDetails?.hourlyRate != null ? String(org.securityDetails?.hourlyRate) : "",
    dailyRate:
      org.securityDetails?.dailyRate != null ? String(org.securityDetails?.dailyRate) : "",
    nightRate:
      org.securityDetails?.nightRate != null ? String(org.securityDetails?.nightRate) : "",
    eventRate:
      org.securityDetails?.eventRate != null ? String(org.securityDetails?.eventRate) : "",
    executiveProtectionRate:
      org.securityDetails?.executiveProtectionRate != null
        ? String(org.securityDetails.executiveProtectionRate)
        : "",
    minimumBookingAmount:
      org.securityDetails?.minimumBookingAmount != null
        ? String(org.securityDetails.minimumBookingAmount)
        : "",
    commissionPercent:
      org.securityDetails?.commissionPercent != null
        ? String(org.securityDetails.commissionPercent)
        : "",
    paymentTerms: org.securityDetails?.paymentTerms ?? "",
    bankAccountIban: org.securityDetails?.bankAccountIban ?? "",
    currency:
      org.securityDetails?.currency === "EUR" ||
        org.securityDetails?.currency === "USD" ||
        org.securityDetails?.currency === "GBP"
        ? org.securityDetails?.currency
        : "EUR",
  };
}


export function formValuesToSecurityOrganization(
  values: SecurityOrganizationFormValues,
): SecurityOrganization {
  return {
    id: values.id || undefined,
    organizationName: values.organizationName,
    email: values.email,
    phone: values.phone,
    serviceAreas: values.serviceAreas,
    contactPerson: values.contactPerson,
    status: values.status,
    type: "SECURITY",
    securityDetails: {
      legalForm: values.legalForm?.trim() || undefined,
      sirenOrSiret: values.sirenOrSiret?.trim() || undefined,
      licenseNumber: values.licenseNumber?.trim() || undefined,
      cnapsNumber: values.cnapsNumber?.trim() || undefined,
      registrationDate: values.registrationDate?.trim() || undefined,
      registeredAddress: values.registeredAddress?.trim() || undefined,
      officeAddress: values.officeAddress?.trim() || undefined,
      websiteUrl: values.websiteUrl?.trim() || undefined,
      directorFullName: values.directorFullName?.trim() || undefined,

      kbisUploaded: values?.kbisUploaded,
      licenseUploaded: values?.licenseUploaded,
      rcProInsuranceUploaded: values?.rcProInsuranceUploaded,
      cnapsAuthorizationUploaded:
        values.cnapsAuthorizationUploaded,
      bankDetailsProvided: values?.bankDetailsProvided,
      directorIdCopyProvided: values?.directorIdCopyProvided,
      signedPartnershipAgreement:
        values?.signedPartnershipAgreement,
      additionalCertifications: values?.additionalCertifications?.trim() || undefined,

      serviceTypes: values.serviceTypes ?? [],
      support24_7: values.support24_7,
      minBookingHours: toNumber(values.minBookingHours),
      mobilizationTimeMinutes: toNumber(values.mobilizationTimeMinutes),
      agentsCount: toNumber(values.agentsCount),
      languagesSpoken: values.languagesSpoken,
      hasTeamLeader: values.hasTeamLeader,
      armedPersonnelAllowed: values.armedPersonnelAllowed,
      unarmedPersonnelAllowed: values.unarmedPersonnelAllowed,
      internationalMissions: values.internationalMissions,
      specialRequirements: values.specialRequirements?.trim() || undefined,

      hourlyRate: toNumber(values?.hourlyRate),
      dailyRate: toNumber(values?.dailyRate),
      nightRate: toNumber(values?.nightRate),
      eventRate: toNumber(values?.eventRate),
      executiveProtectionRate: toNumber(values?.executiveProtectionRate),
      minimumBookingAmount: toNumber(values?.minimumBookingAmount),
      commissionPercent: toNumber(values?.commissionPercent),
      paymentTerms: values?.paymentTerms,
      bankAccountIban: values?.bankAccountIban,
      currency: values?.currency,
    }
  };
}
