import { sendEmail, sendEmailOrThrow } from "../../lib/email.js";
import type { SecurityRequestBody } from "./securityRequest.schemas.js";

const SERVICE_CATEGORY_LABELS: Record<SecurityRequestBody["serviceCategory"], string> =
  {
    executive_protection: "Executive protection",
    event_security: "Event security",
    property_private: "Property & private",
    business_commercial: "Business & commercial",
    advanced_specialized: "Advanced & specialized",
  };

const DURATION_LABELS: Record<SecurityRequestBody["duration"], string> = {
  "4": "4 hours",
  "8": "8 hours",
  "12": "12 hours",
  "24": "24 hours",
  multi: "Multi-day",
};

const DRESS_CODE_LABELS: Record<string, string> = {
  "": "—",
  business: "Business",
  formal: "Formal",
  discreet: "Discreet",
  casual: "Casual",
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function yesNoLabel(value: string): string {
  if (value === "yes") return "Yes";
  if (value === "no") return "No";
  return "—";
}

function wrapLayout(content: string): string {
  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#141414;padding:24px 32px">
      <span style="color:#D4AF35;font-size:22px;font-weight:700;letter-spacing:1px">AUREVIA</span>
    </div>
    <div style="padding:32px">
      ${content}
    </div>
    <div style="padding:16px 32px;background:#fafafa;text-align:center;color:#aaa;font-size:12px">
      &copy; ${new Date().getFullYear()} Aurevia. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

function row(label: string, value: string): string {
  const safe = escapeHtml(value || "—");
  return `<tr><td style="padding:8px 0;color:#888;vertical-align:top;width:38%">${escapeHtml(label)}</td><td style="padding:8px 0">${safe}</td></tr>`;
}

function buildDetailsTable(body: SecurityRequestBody): string {
  const serviceTypeDisplay =
    body.serviceType === "other"
      ? `Other: ${body.serviceTypeOther.trim()}`
      : body.serviceType;

  const schedule =
    body.duration === "multi"
      ? `${body.date} ${body.time} → ${body.endDate}`
      : `${body.date} at ${body.time}`;

  const coords =
    body.locationLat.trim() && body.locationLng.trim()
      ? `${body.locationLat}, ${body.locationLng}`
      : "—";

  return `
    <table style="width:100%;border-collapse:collapse;margin:16px 0">
      ${row("Service category", SERVICE_CATEGORY_LABELS[body.serviceCategory])}
      ${row("Service type", serviceTypeDisplay)}
      ${row("Location", body.location)}
      ${row("Coordinates", coords)}
      ${row("Schedule", schedule)}
      ${row("Duration", DURATION_LABELS[body.duration])}
      ${row("Agents", body.agentCount)}
      ${row("Client", `${body.firstName} ${body.lastName}`)}
      ${row("Email", body.email)}
      ${row("Phone", body.phone)}
      ${row("Company", body.company.trim() || "—")}
      ${row("Languages", body.languagesRequired.trim() || "—")}
      ${row("Dress code", DRESS_CODE_LABELS[body.dressCode] ?? body.dressCode)}
      ${row("Vehicle required", yesNoLabel(body.vehicleRequired))}
      ${row("Armed required", yesNoLabel(body.armedRequired))}
      ${row("Special requirements", body.specialRequirements.trim() || "—")}
    </table>`;
}

function resolveAdminEmail(): string {
  const email = process.env.ADMIN_EMAIL?.trim();
  if (!email) {
    throw new Error("ADMIN_EMAIL is not configured");
  }
  return email;
}

export async function sendSecurityRequestAdminEmail(
  body: SecurityRequestBody,
): Promise<void> {
  const adminTo = resolveAdminEmail();
  const clientName = `${body.firstName} ${body.lastName}`.trim();

  const html = wrapLayout(`
    <h2 style="margin:0 0 8px;color:#141414">New security request</h2>
    <p style="color:#555;line-height:1.6">
      A new security service request was submitted from the landing page.
    </p>
    ${buildDetailsTable(body)}
    <p style="color:#999;font-size:13px;margin-top:20px">
      Submitted at ${escapeHtml(new Date().toISOString())}
    </p>
  `);

  await sendEmailOrThrow({
    to: adminTo,
    subject: `Security request — ${clientName} (${SERVICE_CATEGORY_LABELS[body.serviceCategory]})`,
    html,
  });
}

export async function sendSecurityRequestClientConfirmationEmail(
  body: SecurityRequestBody,
): Promise<void> {
  const clientName = body.firstName.trim();
  const html = wrapLayout(`
    <h2 style="margin:0 0 8px;color:#141414">Request received</h2>
    <p style="color:#555;line-height:1.6">
      Hello <strong>${escapeHtml(clientName)}</strong>,<br>
      Thank you for your security service request. Your application is now
      <strong>being processed</strong>.
    </p>
    <p style="color:#555;line-height:1.6">
      Our team will contact you as soon as possible at
      <strong>${escapeHtml(body.email)}</strong> or
      <strong>${escapeHtml(body.phone)}</strong>.
    </p>
    ${buildDetailsTable(body)}
    <p style="color:#555;line-height:1.6;margin-top:16px">
      If you need to update your request, reply to this email or contact Aurevia support.
    </p>
  `);

  await sendEmail({
    to: body.email,
    subject: "Aurevia — your security request is being processed",
    html,
  });
}
