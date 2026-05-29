import { sendEmail, sendEmailOrThrow } from "../../lib/email.js";
import {
  emailDetailRow,
  emailDetailTable,
  emailHeading,
  emailParagraph,
  escapeHtml,
  getSecurityCategoryLabel,
  getSecurityDurationLabel,
  getSecurityDressCodeLabel,
  getSecurityEmailCopy,
  parseEmailLocale,
  wrapEmailLayout,
  yesNoLabel,
} from "../../emails/index.js";
import type { SecurityRequestBody } from "./securityRequest.schemas.js";

function buildDetailsTable(
  body: SecurityRequestBody,
  locale: ReturnType<typeof parseEmailLocale>,
): string {
  const copy = getSecurityEmailCopy(locale);
  const labels = copy.labels;

  const serviceTypeDisplay =
    body.serviceType === "other"
      ? `${labels.otherPrefix}: ${body.serviceTypeOther.trim()}`
      : body.serviceType;

  const schedule =
    body.duration === "multi"
      ? `${body.date} ${body.time} → ${body.endDate}`
      : `${body.date} at ${body.time}`;

  const coords =
    body.locationLat.trim() && body.locationLng.trim()
      ? `${body.locationLat}, ${body.locationLng}`
      : labels.dash;

  return emailDetailTable(
    [
      emailDetailRow(
        labels.serviceCategory,
        getSecurityCategoryLabel(locale, body.serviceCategory),
      ),
      emailDetailRow(labels.serviceType, serviceTypeDisplay),
      emailDetailRow(labels.location, body.location),
      emailDetailRow(labels.coordinates, coords),
      emailDetailRow(labels.schedule, schedule),
      emailDetailRow(labels.duration, getSecurityDurationLabel(locale, body.duration)),
      emailDetailRow(labels.agents, body.agentCount),
      emailDetailRow(labels.client, `${body.firstName} ${body.lastName}`),
      emailDetailRow(labels.email, body.email),
      emailDetailRow(labels.phone, body.phone),
      emailDetailRow(labels.company, body.company.trim() || labels.dash),
      emailDetailRow(labels.languages, body.languagesRequired.trim() || labels.dash),
      emailDetailRow(
        labels.dressCode,
        getSecurityDressCodeLabel(locale, body.dressCode),
      ),
      emailDetailRow(labels.vehicleRequired, yesNoLabel(locale, body.vehicleRequired)),
      emailDetailRow(labels.armedRequired, yesNoLabel(locale, body.armedRequired)),
      emailDetailRow(
        labels.specialRequirements,
        body.specialRequirements.trim() || labels.dash,
      ),
    ].join(""),
  );
}

function resolveAdminEmail(): string {
  const email = process.env.SMTP_USER?.trim();
  if (!email) {
    throw new Error("SMTP_USER is not configured");
  }
  return email;
}

export async function sendSecurityRequestAdminEmail(
  body: SecurityRequestBody,
): Promise<void> {
  const locale = parseEmailLocale(body.locale);
  const copy = getSecurityEmailCopy(locale);
  const adminTo = resolveAdminEmail();
  const clientName = `${body.firstName} ${body.lastName}`.trim();
  const category = getSecurityCategoryLabel(locale, body.serviceCategory);

  const html = wrapEmailLayout(`
    ${emailHeading(copy.admin.heading)}
    ${emailParagraph(copy.admin.intro)}
    ${buildDetailsTable(body, locale)}
    <p style="color:#999;font-size:13px;margin-top:20px">
      ${escapeHtml(copy.admin.submittedAt(new Date().toISOString()))}
    </p>
  `);

  await sendEmailOrThrow({
    to: adminTo,
    subject: copy.admin.subject(clientName, category),
    html,
  });
}

export async function sendSecurityRequestClientConfirmationEmail(
  body: SecurityRequestBody,
): Promise<void> {
  const locale = parseEmailLocale(body.locale);
  const copy = getSecurityEmailCopy(locale);
  const clientName = body.firstName.trim();

  const html = wrapEmailLayout(`
    ${emailHeading(copy.client.heading)}
    ${emailParagraph(
      `${copy.client.greeting(escapeHtml(clientName))}<br>${copy.client.processing}`,
    )}
    ${emailParagraph(
      copy.client.contactSoon(escapeHtml(body.email), escapeHtml(body.phone)),
    )}
    ${buildDetailsTable(body, locale)}
    ${emailParagraph(copy.client.footer)}
  `);

  await sendEmail({
    to: body.email,
    subject: copy.client.subject,
    html,
  });
}
