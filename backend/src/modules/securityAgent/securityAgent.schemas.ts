import { z } from "zod";

export const securityAgentIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const securityAgentListQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
});

export const securityAgentByIdQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
});

const employment = z.enum(["EMPLOYEE", "FREELANCE", "SUBCONTRACTOR"]);
const physical = z.enum(["LOW", "MEDIUM", "HIGH"]);

const agentFields = {
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  birthDate: z.coerce.date().optional().nullable(),
  nationality: z.string().optional().nullable(),
  profilePhotoUrl: z.string().optional().nullable(),
  phone: z.string().optional().nullable(),
  email: z.string().optional().nullable(),
  address: z.string().optional().nullable(),
  languages: z.array(z.string()).optional(),
  emergencyContact: z.string().optional().nullable(),
  employmentStatus: employment.optional().nullable(),
  professionalCardNumber: z.string().optional().nullable(),
  cnapsNumber: z.string().optional().nullable(),
  cardIssuedAt: z.coerce.date().optional().nullable(),
  cardExpiresAt: z.coerce.date().optional().nullable(),
  specializations: z.array(z.string()).optional(),
  experienceYears: z.coerce.number().int().nonnegative().optional().nullable(),
  hasVipExperience: z.boolean().optional(),
  hasEventExperience: z.boolean().optional(),
  hasDriverLicenseB: z.boolean().optional(),
  additionalLicenses: z.string().optional().nullable(),
  physicalLevel: physical.optional().nullable(),
  hasFirstAidTraining: z.boolean().optional(),
  weaponExperience: z.boolean().optional(),
  readyForTravel: z.boolean().optional(),
  readyForNightShifts: z.boolean().optional(),
  passportProvided: z.boolean().optional(),
  professionalCardProvided: z.boolean().optional(),
  cnapsProvided: z.boolean().optional(),
  cvProvided: z.boolean().optional(),
  certificatesProvided: z.boolean().optional(),
  firstAidCertificateProvided: z.boolean().optional(),
  driverLicenseProvided: z.boolean().optional(),
  backgroundCheckProvided: z.boolean().optional(),
  profilePhotoProvided: z.boolean().optional(),
  signedContractProvided: z.boolean().optional(),
  baseCity: z.string().optional().nullable(),
  workingRadiusKm: z.coerce.number().int().nonnegative().optional().nullable(),
  availability: z.string().optional().nullable(),
  hourlyRate: z.coerce.number().nonnegative().optional().nullable(),
  dailyRate: z.coerce.number().nonnegative().optional().nullable(),
  nightRate: z.coerce.number().nonnegative().optional().nullable(),
  canWorkInTeam: z.boolean().optional(),
  canTravelWithClient: z.boolean().optional(),
  canDoDriverSecurity: z.boolean().optional(),
  status: z.boolean().optional(),
  notes: z.string().optional().nullable(),
};

export const createSecurityAgentSchema = z.object({
  organizationId: z.string().uuid(),
  ...agentFields,
});

export const updateSecurityAgentSchema = createSecurityAgentSchema
  .omit({ organizationId: true })
  .partial();
