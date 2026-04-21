import nodemailer from "nodemailer";

const transporter = createTransport();

const defaultFrom =
  process.env.SMTP_FROM || "Aurevia <no-reply@aurevia.com>";

function createTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || "587");
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {
    console.warn(
      "[email] SMTP not configured (SMTP_HOST / SMTP_USER / SMTP_PASS). Emails will be logged to console.",
    );
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

export async function sendEmail(options: {
  to: string;
  subject: string;
  html: string;
}) {
  if (!transporter) {
    console.log("[email] (no SMTP) To:", options.to);
    console.log("[email] (no SMTP) Subject:", options.subject);
    console.log("[email] (no SMTP) HTML:", options.html);
    return;
  }

  try {
    await transporter.sendMail({
      from: defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`[email] Sent to ${options.to}: ${options.subject}`);
  } catch (err) {
    console.error("[email] Send failed:", err);
  }
}

export function isSmtpConfigured(): boolean {
  return transporter != null;
}

/** Same as sendEmail but fails if SMTP is missing or send throws (for critical admin actions). */
export async function sendEmailOrThrow(options: {
  to: string;
  subject: string;
  html: string;
}): Promise<void> {
  if (!transporter) {
    throw new Error("SMTP is not configured");
  }
  try {
    await transporter.sendMail({
      from: defaultFrom,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    console.log(`[email] Sent to ${options.to}: ${options.subject}`);
  } catch (err) {
    console.error("[email] Send failed:", err);
    throw err instanceof Error ? err : new Error("Failed to send email");
  }
}

