import { toNumber } from "../../../../../utils/transform";
import type { DriverOrganization, DriverOrganizationFormValues } from "../../data/types";
import { defaultFormValues } from "./driverOrganizationForm.types";

export function driverOrganizationToFormValues(
  org: DriverOrganization | null,
): DriverOrganizationFormValues {
  if (!org) return defaultFormValues as DriverOrganizationFormValues;

  return {
    // Basic Information
    id: org.id,
    organizationName: org.organizationName,
    email: org.email,
    phone: org.phone,
    serviceAreas: org.serviceAreas,
    contactPerson: org.contactPerson,
    status: org.status,

    // Company Information
    legalForm: org.chauffeurDetails?.legalForm ?? "",
    sirenOrSiret: org.chauffeurDetails?.sirenOrSiret ?? "",
    vatNumber: org.chauffeurDetails?.vatNumber ?? "",
    registrationDate: org.chauffeurDetails?.registrationDate ?? "",
    registrationCountry: org.chauffeurDetails?.registrationCountry ?? "France",
    registeredAddress: org.chauffeurDetails?.registeredAddress ?? "",
    sameAsRegisteredAddress: org.chauffeurDetails?.sameAsRegisteredAddress ?? false,
    websiteUrl: org.chauffeurDetails?.websiteUrl ?? "",
    directorFullName: org.chauffeurDetails?.directorFullName ?? "",
    directorPosition: org.chauffeurDetails?.directorPosition ?? "",

    // Documents metadata
    kbisUploaded: org.chauffeurDetails?.kbisUploaded ?? false,
    rcProInsuranceUploaded: org.chauffeurDetails?.rcProInsuranceUploaded ?? false,
    transportInsuranceUploaded: org.chauffeurDetails?.transportInsuranceUploaded ?? false,
    operatingLicenseProvided: org.chauffeurDetails?.operatingLicenseProvided ?? false,
    bankDetailsProvided: org.chauffeurDetails?.bankDetailsProvided ?? false,
    directorIdCopyProvided: org.chauffeurDetails?.directorIdCopyProvided ?? false,
    signedPartnershipAgreement: org.chauffeurDetails?.signedPartnershipAgreement ?? false,
    additionalCertifications: org.chauffeurDetails?.additionalCertifications ?? "",
    documentNotes: org.chauffeurDetails?.documentNotes ?? "",

    // Operations
    serviceTypes: org.chauffeurDetails?.serviceTypes ?? [],
    workingHours: org.chauffeurDetails?.workingHours ?? "",
    support24_7: org.chauffeurDetails?.support24_7 ?? false,
    languagesSpoken: org.chauffeurDetails?.languagesSpoken ?? [],
    maxConcurrentBookings:
      org.chauffeurDetails?.maxConcurrentBookings != null
        ? String(org.chauffeurDetails?.maxConcurrentBookings)
        : "",
    minAdvanceBookingHours:
      org.chauffeurDetails?.minAdvanceBookingHours != null
        ? String(org.chauffeurDetails?.minAdvanceBookingHours)
        : "",
    acceptsUrgentBookings: org.chauffeurDetails?.acceptsUrgentBookings ?? false,
    cancellationPolicy: org.chauffeurDetails?.cancellationPolicy ?? "",
    specialConditionsNotes: org.chauffeurDetails?.specialConditionsNotes ?? "",

    // Commercial & Financial
    cooperationType: org.chauffeurDetails?.cooperationType ?? "",
    bankAccountIban: org.chauffeurDetails?.bankAccountIban ?? "",
    paymentTerms: org.chauffeurDetails?.paymentTerms ?? "",
    commissionPercent:
      org.chauffeurDetails?.commissionPercent != null
        ? String(org.chauffeurDetails?.commissionPercent)
        : "",
    currency:
      org.chauffeurDetails?.currency === "EUR" ||
        org.chauffeurDetails?.currency === "USD" ||
        org.chauffeurDetails?.currency === "GBP"
        ? org.chauffeurDetails?.currency
        : "EUR",
    minimumFare:
      org.chauffeurDetails?.minimumFare != null ? String(org.chauffeurDetails?.minimumFare) : "",
    hourlyRate:
      org.chauffeurDetails?.hourlyRate != null ? String(org.chauffeurDetails?.hourlyRate) : "",
    transferBaseRate:
      org.chauffeurDetails?.transferBaseRate != null
        ? String(org.chauffeurDetails?.transferBaseRate)
        : "",
    nightSurchargePercent:
      org.chauffeurDetails?.nightSurchargePercent != null
        ? String(org.chauffeurDetails?.nightSurchargePercent)
        : "",
    holidaySurchargePercent:
      org.chauffeurDetails?.holidaySurchargePercent != null
        ? String(org.chauffeurDetails?.holidaySurchargePercent)
        : "",
    waitingTimeFee:
      org.chauffeurDetails?.waitingTimeFee != null ? String(org.chauffeurDetails?.waitingTimeFee) : "",
  };
}

export function formValuesToDriverOrganization(
  values: DriverOrganizationFormValues,
): DriverOrganization {
  return {
    id: values.id ?? undefined,
    organizationName: values.organizationName.trim(),
    status: values.status,
    phone: values.phone,
    email: values.email,
    contactPerson: values.contactPerson,
    serviceAreas: values.serviceAreas,
    type: "CHAUFFEUR",
    chauffeurDetails: {
      legalForm: values.legalForm?.trim() || undefined,
      sirenOrSiret: values.sirenOrSiret?.trim() || undefined,
      vatNumber: values.vatNumber?.trim() || undefined,
      registrationDate: values.registrationDate?.trim() || undefined,
      registrationCountry: values.registrationCountry?.trim() || undefined,
      registeredAddress: values.registeredAddress?.trim() || undefined,
      sameAsRegisteredAddress: values.sameAsRegisteredAddress,
      websiteUrl: values.websiteUrl?.trim() || undefined,
      directorFullName: values.directorFullName?.trim() || undefined,
      directorPosition: values.directorPosition?.trim() || undefined,

      kbisUploaded: values.kbisUploaded,
      rcProInsuranceUploaded: values.rcProInsuranceUploaded,
      transportInsuranceUploaded: values.transportInsuranceUploaded,
      operatingLicenseProvided: values.operatingLicenseProvided,
      bankDetailsProvided: values.bankDetailsProvided,
      directorIdCopyProvided: values.directorIdCopyProvided,
      signedPartnershipAgreement: values.signedPartnershipAgreement,
      additionalCertifications: values.additionalCertifications?.trim() || undefined,
      documentNotes: values.documentNotes?.trim() || undefined,

      serviceAreas: values.serviceAreas?.trim() || undefined,
      serviceTypes: values.serviceTypes,
      workingHours: values.workingHours?.trim() || undefined,
      support24_7: values.support24_7,
      languagesSpoken: values.languagesSpoken,
      maxConcurrentBookings: toNumber(values.maxConcurrentBookings),
      minAdvanceBookingHours: toNumber(values.minAdvanceBookingHours),
      acceptsUrgentBookings: values.acceptsUrgentBookings,
      cancellationPolicy: values.cancellationPolicy?.trim() || undefined,
      specialConditionsNotes: values.specialConditionsNotes?.trim() || undefined,

      cooperationType: values.cooperationType || undefined,
      bankAccountIban: values.bankAccountIban?.trim() || undefined,
      paymentTerms: values.paymentTerms?.trim() || undefined,
      commissionPercent:
        values.cooperationType === "COMMISSION"
          ? toNumber(values.commissionPercent)
          : undefined,
      currency: values.currency ?? undefined,
      minimumFare: toNumber(values.minimumFare),
      hourlyRate: toNumber(values.hourlyRate),
      transferBaseRate: toNumber(values.transferBaseRate),
      nightSurchargePercent: toNumber(values.nightSurchargePercent),
      holidaySurchargePercent: toNumber(values.holidaySurchargePercent),
      waitingTimeFee: toNumber(values.waitingTimeFee),
    },
  };
}