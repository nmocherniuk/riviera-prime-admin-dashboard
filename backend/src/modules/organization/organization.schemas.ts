import { z } from "zod";

export const organizationTypeSchema = z.enum(["CHAUFFEUR", "SECURITY"]);

export const chauffeurOrganizationDetailsInputSchema = z
  .object({
    // Company Information
    legalForm: z.string().optional(),
    sirenOrSiret: z.string().optional(),
    vatNumber: z.string().optional(),
    registrationDate: z.coerce.date().optional(),
    registrationCountry: z.string().optional(),
    registeredAddress: z.string().optional(),
    sameAsRegisteredAddress: z.boolean().optional(),
    mailingAddress: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    directorFullName: z.string().optional(),
    directorPosition: z.string().optional(),

    // Documents metadata
    kbisUploaded: z.boolean().optional(),
    rcProInsuranceUploaded: z.boolean().optional(),
    transportInsuranceUploaded: z.boolean().optional(),
    operatingLicenseProvided: z.boolean().optional(),
    bankDetailsProvided: z.boolean().optional(),
    directorIdCopyProvided: z.boolean().optional(),
    signedPartnershipAgreement: z.boolean().optional(),
    additionalCertifications: z.string().optional(),
    documentNotes: z.string().optional(),

    // Operations
    serviceTypes: z.array(z.string()).optional(),
    workingHours: z.string().optional(),
    support24_7: z.boolean().optional(),
    languagesSpoken: z.array(z.string()).optional(),
    maxConcurrentBookings: z.coerce.number().int().optional(),
    minAdvanceBookingHours: z.coerce.number().int().optional(),
    acceptsUrgentBookings: z.boolean().optional(),
    cancellationPolicy: z.string().optional(),
    specialConditionsNotes: z.string().optional(),

    // Commercial & Financial
    cooperationType: z
      .enum(["COMMISSION", "FIXED_RATE", "CUSTOM"])
      .optional(),
    bankAccountIban: z.string().optional(),
    paymentTerms: z.string().optional(),
    commissionPercent: z.coerce.number().optional(),
    currency: z.string().optional(),
    minimumFare: z.coerce.number().optional(),
    hourlyRate: z.coerce.number().optional(),
    transferBaseRate: z.coerce.number().optional(),
    nightSurchargePercent: z.coerce.number().optional(),
    holidaySurchargePercent: z.coerce.number().optional(),
    waitingTimeFee: z.coerce.number().optional(),
  })
  .partial();

export const securityOrganizationDetailsInputSchema = z
  .object({
    // Company Information
    legalForm: z.string().optional(),
    sirenOrSiret: z.string().optional(),
    licenseNumber: z.string().optional(),
    cnapsNumber: z.string().optional(),
    registrationDate: z.coerce.date().optional(),
    registeredAddress: z.string().optional(),
    officeAddress: z.string().optional(),
    websiteUrl: z.string().url().optional(),
    directorFullName: z.string().optional(),

    // Documents metadata
    kbisUploaded: z.boolean().optional(),
    licenseUploaded: z.boolean().optional(),
    rcProInsuranceUploaded: z.boolean().optional(),
    cnapsAuthorizationUploaded: z.boolean().optional(),
    bankDetailsProvided: z.boolean().optional(),
    directorIdCopyProvided: z.boolean().optional(),
    signedPartnershipAgreement: z.boolean().optional(),
    additionalCertifications: z.string().optional(),

    // Operations
    serviceTypes: z.array(z.string()).optional(),
    support24_7: z.boolean().optional(),
    minBookingHours: z.coerce.number().int().optional(),
    mobilizationTimeMinutes: z.coerce.number().int().optional(),
    agentsCount: z.coerce.number().int().optional(),
    languagesSpoken: z.array(z.string()).optional(),
    hasTeamLeader: z.boolean().optional(),
    armedPersonnelAllowed: z.boolean().optional(),
    unarmedPersonnelAllowed: z.boolean().optional(),
    internationalMissions: z.boolean().optional(),
    specialRequirements: z.string().optional(),

    // Financial
    hourlyRate: z.coerce.number().optional(),
    dailyRate: z.coerce.number().optional(),
    nightRate: z.coerce.number().optional(),
    eventRate: z.coerce.number().optional(),
    executiveProtectionRate: z.coerce.number().optional(),
    minimumBookingAmount: z.coerce.number().optional(),
    commissionPercent: z.coerce.number().optional(),
    paymentTerms: z.string().optional(),
    bankAccountIban: z.string().optional(),
    currency: z.string().optional(),
  })
  .partial();

export const createOrganizationSchema = z.object({
  organizationName: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  contactPerson: z.string().min(1),
  serviceAreas: z.string().default(""),
  status: z.boolean(),
  type: organizationTypeSchema,
  chauffeurDetails: chauffeurOrganizationDetailsInputSchema.optional(),
  securityDetails: securityOrganizationDetailsInputSchema.optional(),
});

export const updateOrganizationSchema = createOrganizationSchema.omit({
  type: true,
});

export const organizationListQuerySchema = z.object({
  type: organizationTypeSchema,
});

export const organizationByIdQuerySchema = z.object({
  type: organizationTypeSchema.optional(),
});

export const organizationIdParamsSchema = z.object({
  id: z.string().uuid(),
});
