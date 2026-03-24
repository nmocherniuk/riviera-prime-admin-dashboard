import { z } from "zod";

export const organizationTypeSchema = z.enum(["CHAUFFEUR", "SECURITY"]);

export const organizationStatusInputSchema = z.enum(["active", "inactive"]);

export const createOrganizationSchema = z.object({
  title: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  contactPerson: z.string().min(1),
  serviceArea: z.string().default(""),
  status: organizationStatusInputSchema,
  type: organizationTypeSchema,
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
