import { z } from "zod";

export const publicDriverStatusSchema = z.enum([
  "AVAILABLE",
  "ON RIDE",
  "OFFLINE",
]);

export const driverIdParamsSchema = z.object({
  id: z.string().uuid(),
});

export const driverListQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
});

export const driverByIdQuerySchema = z.object({
  organizationId: z.string().uuid().optional(),
});

export const createDriverSchema = z.object({
  organizationId: z.string().uuid(),
  name: z.string().min(1),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  address: z.string().optional(),
  nationality: z.string().optional(),
  birthDate: z.coerce.date().optional(),
  languages: z.array(z.string()).optional(),
  emergencyContact: z.string().optional(),
  employmentStatus: z.enum(["EMPLOYEE", "FREELANCE", "SUBCONTRACTOR"]).optional(),
  vtcCardNumber: z.string().optional(),
  vtcCardIssuedAt: z.coerce.date().optional(),
  vtcCardExpiresAt: z.coerce.date().optional(),
  driverLicenseNumber: z.string().optional(),
  licenseCategory: z.string().optional(),
  licenseIssuedAt: z.coerce.date().optional(),
  licenseExpiresAt: z.coerce.date().optional(),
  drivingExperienceYears: z.coerce.number().int().nonnegative().optional(),
  hasVipExperience: z.boolean().optional(),
  hasEventExperience: z.boolean().optional(),
  languageLevel: z.string().optional(),
  dressCodeReady: z.boolean().optional(),
  passportProvided: z.boolean().optional(),
  driverLicenseProvided: z.boolean().optional(),
  vtcCardProvided: z.boolean().optional(),
  criminalRecordProvided: z.boolean().optional(),
  medicalCertificateProvided: z.boolean().optional(),
  insuranceProofProvided: z.boolean().optional(),
  profilePhotoProvided: z.boolean().optional(),
  signedContractProvided: z.boolean().optional(),
  baseCity: z.string().optional(),
  workingRadiusKm: z.coerce.number().int().nonnegative().optional(),
  acceptsLongDistance: z.boolean().optional(),
  acceptsNightTrips: z.boolean().optional(),
  acceptsAirportTransfers: z.boolean().optional(),
  acceptsVipClients: z.boolean().optional(),
  availabilityDays: z.array(z.string()).optional(),
  availabilityHours: z.string().optional(),
  hasOwnVehicle: z.boolean().optional(),
  vehicle: z.string().min(1),
  vehiclePlate: z.string().min(1),
  vehicleColor: z.string().min(1),
  status: publicDriverStatusSchema,
  rides: z.number().int().nonnegative().default(0),
  todayShift: z.string().default(""),
});

export const updateDriverSchema = createDriverSchema.omit({
  organizationId: true,
});
