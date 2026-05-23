import { z } from "zod";
import { emailLocaleSchema } from "../../emails/locale.js";

const optionalString = z.string().default("");

const serviceCategoryEnum = z.enum([
  "executive_protection",
  "event_security",
  "property_private",
  "business_commercial",
  "advanced_specialized",
]);

const durationEnum = z.enum(["4", "8", "12", "24", "multi"]);

const dressCodeEnum = z.enum(["", "business", "formal", "discreet", "casual"]);
const yesNoEmptyEnum = z.enum(["", "yes", "no"]);

export const securityRequestBodySchema = z
  .object({
    serviceCategory: serviceCategoryEnum,
    serviceType: z.string().min(1),
    serviceTypeOther: optionalString,
    location: z.string().trim().min(1),
    locationLat: optionalString,
    locationLng: optionalString,
    date: z.string().min(1),
    time: z.string().min(1),
    duration: durationEnum,
    endDate: optionalString,
    agentCount: z
      .string()
      .regex(/^(?:[1-9]|1[0-9]|2[0-4])$/, "agentCount must be between 1 and 24"),
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().trim().email(),
    phone: z.string().trim().min(1),
    company: optionalString,
    specialRequirements: optionalString,
    languagesRequired: optionalString,
    dressCode: dressCodeEnum,
    vehicleRequired: yesNoEmptyEnum,
    armedRequired: yesNoEmptyEnum,
    locale: emailLocaleSchema,
  })
  .superRefine((data, ctx) => {
    if (data.serviceType === "other") {
      if (data.serviceTypeOther.trim().length < 3) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "serviceTypeOther is required (min 3 characters) when serviceType is other",
          path: ["serviceTypeOther"],
        });
      }
    }
    if (data.duration === "multi" && !data.endDate.trim()) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endDate is required when duration is multi",
        path: ["endDate"],
      });
    }
  });

export type SecurityRequestBody = z.infer<typeof securityRequestBodySchema>;
