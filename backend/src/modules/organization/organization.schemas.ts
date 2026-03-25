import { z } from "zod";

export const organizationTypeSchema = z.enum(["CHAUFFEUR", "SECURITY"]);

export const organizationStatusInputSchema = z.enum(["active", "inactive"]);

export const chauffeurOrganizationDetailsInputSchema = z
  .object({
    // Company Information
    companyName: z.string().optional(),
    legalForm: z.string().optional(),
    sirenOrSiret: z.string().optional(),
    vatNumber: z.string().optional(),
    registrationDate: z.coerce.date().optional(),
    registrationCountry: z.string().optional(),
    registeredAddress: z.string().optional(),
    mailingAddress: z.string().optional(),
    sameAsRegisteredAddress: z.boolean().optional(),
    websiteUrl: z.string().url().optional(),
    generalEmail: z.string().email().optional(),
    companyPhoneNumber: z.string().optional(),
    directorFullName: z.string().optional(),
    directorPosition: z.string().optional(),
    primaryContactName: z.string().optional(),
    primaryContactEmail: z.string().email().optional(),
    primaryContactPhone: z.string().optional(),

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
    serviceAreas: z.string().optional(),
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

export const createOrganizationSchema = z.object({
  title: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  contactPerson: z.string().min(1),
  serviceArea: z.string().default(""),
  status: organizationStatusInputSchema,
  type: organizationTypeSchema,
  chauffeurDetails: chauffeurOrganizationDetailsInputSchema.optional(),
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
