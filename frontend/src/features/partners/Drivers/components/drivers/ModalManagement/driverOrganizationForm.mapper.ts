import type { DriverOrganization } from "../../../data/types";
import { defaultFormValues } from "./driverOrganizationForm.types";

export function orgToFormValues(
  DriverOrg: DriverOrganization | null,
): DriverOrganization {
  if (!DriverOrg) return defaultFormValues as DriverOrganization;

  return {
    id: DriverOrg.id,
    legalForm: DriverOrg?.legalForm ?? "",
    sirenOrSiret: DriverOrg?.sirenOrSiret ?? "",
    vatNumber: DriverOrg?.vatNumber ?? "",
    registrationDate: DriverOrg?.registrationDate
      ? String(DriverOrg.registrationDate).slice(0, 10)
      : "",
    registrationCountry: DriverOrg?.registrationCountry ?? "France",
    registeredAddress: DriverOrg?.registeredAddress ?? "",
    mailingAddress: DriverOrg?.mailingAddress ?? "",
    sameAsRegisteredAddress: DriverOrg?.sameAsRegisteredAddress ?? false,
    websiteUrl: DriverOrg?.websiteUrl ?? "",
    generalEmail: DriverOrg?.generalEmail ?? "",
    companyPhoneNumber: DriverOrg?.companyPhoneNumber ?? "",
    directorFullName: DriverOrg?.directorFullName ?? "",
    directorPosition: DriverOrg?.directorPosition ?? "",
    primaryContactName: DriverOrg?.primaryContactName ?? "",
    primaryContactEmail: DriverOrg?.primaryContactEmail ?? "",
    primaryContactPhone: DriverOrg?.primaryContactPhone ?? "",

    kbisUploaded: DriverOrg?.kbisUploaded ?? false,
    rcProInsuranceUploaded: DriverOrg?.rcProInsuranceUploaded ?? false,
    transportInsuranceUploaded: DriverOrg?.transportInsuranceUploaded ?? false,
    operatingLicenseProvided: DriverOrg?.operatingLicenseProvided ?? false,
    bankDetailsProvided: DriverOrg?.bankDetailsProvided ?? false,
    directorIdCopyProvided: DriverOrg?.directorIdCopyProvided ?? false,
    signedPartnershipAgreement: DriverOrg?.signedPartnershipAgreement ?? false,
    additionalCertifications: DriverOrg?.additionalCertifications ?? "",
    documentNotes: DriverOrg?.documentNotes ?? "",

    serviceAreas: DriverOrg?.serviceAreas ?? "",
    serviceTypes: DriverOrg?.serviceTypes ?? [],
    workingHours: DriverOrg?.workingHours ?? "",
    support24_7: DriverOrg?.support24_7 ?? false,
    languagesSpoken: DriverOrg?.languagesSpoken ?? [],
    maxConcurrentBookings:
      DriverOrg?.maxConcurrentBookings != null
        ? String(DriverOrg.maxConcurrentBookings)
        : "",
    minAdvanceBookingHours:
      DriverOrg?.minAdvanceBookingHours != null
        ? String(DriverOrg.minAdvanceBookingHours)
        : "",
    acceptsUrgentBookings: DriverOrg?.acceptsUrgentBookings ?? false,
    cancellationPolicy: DriverOrg?.cancellationPolicy ?? "",
    specialConditionsNotes: DriverOrg?.specialConditionsNotes ?? "",

    cooperationType: DriverOrg?.cooperationType ?? null,
    bankAccountIban: DriverOrg?.bankAccountIban ?? "",
    paymentTerms: DriverOrg?.paymentTerms ?? "",
    commissionPercent:
      DriverOrg?.commissionPercent != null
        ? String(DriverOrg.commissionPercent)
        : "",
    currency:
      DriverOrg?.currency === "EUR" ||
      DriverOrg?.currency === "USD" ||
      DriverOrg?.currency === "GBP"
        ? DriverOrg.currency
        : "EUR",
    minimumFare:
      DriverOrg?.minimumFare != null ? String(DriverOrg.minimumFare) : "",
    hourlyRate:
      DriverOrg?.hourlyRate != null ? String(DriverOrg.hourlyRate) : "",
    transferBaseRate:
      DriverOrg?.transferBaseRate != null
        ? String(DriverOrg.transferBaseRate)
        : "",
    nightSurchargePercent:
      DriverOrg?.nightSurchargePercent != null
        ? String(DriverOrg.nightSurchargePercent)
        : "",
    holidaySurchargePercent:
      DriverOrg?.holidaySurchargePercent != null
        ? String(DriverOrg.holidaySurchargePercent)
        : "",
    waitingTimeFee:
      DriverOrg?.waitingTimeFee != null ? String(DriverOrg.waitingTimeFee) : "",
  };
}
