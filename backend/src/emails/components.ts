import { escapeHtml } from "./layout.js";

export function emailHeading(text: string): string {
  return `<h2 style="margin:0 0 8px;color:#141414">${escapeHtml(text)}</h2>`;
}

/** Inner HTML must already be escaped when it contains user data. */
export function emailParagraph(innerHtml: string): string {
  return `<p style="color:#555;line-height:1.6">${innerHtml}</p>`;
}

export function emailMutedParagraph(innerHtml: string): string {
  return `<p style="color:#999;font-size:13px;line-height:1.5">${innerHtml}</p>`;
}

export function emailDetailRow(label: string, value: string): string {
  const safeLabel = escapeHtml(label);
  const safeValue = escapeHtml(value || "—");
  return `<tr><td style="padding:8px 0;color:#888;vertical-align:top;width:38%">${safeLabel}</td><td style="padding:8px 0">${safeValue}</td></tr>`;
}

export function emailDetailTable(rowsHtml: string): string {
  return `<table style="width:100%;border-collapse:collapse;margin:16px 0">${rowsHtml}</table>`;
}

type EmailButtonVariant = "gold" | "dark" | "outline";

export function emailButton(
  href: string,
  label: string,
  variant: EmailButtonVariant = "gold",
): string {
  const safeHref = escapeHtml(href);
  const safeLabel = escapeHtml(label);
  const styles: Record<EmailButtonVariant, string> = {
    gold: "display:inline-block;padding:14px 40px;background:#D4AF35;color:#141414;font-weight:700;font-size:16px;text-decoration:none;border-radius:8px",
    dark: "display:inline-block;padding:14px 40px;background:#141414;color:#D4AF35;font-weight:700;font-size:16px;text-decoration:none;border-radius:8px",
    outline:
      "display:inline-block;padding:14px 28px;background:transparent;color:#D4AF35;font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;border:2px solid #D4AF35;letter-spacing:0.06em;text-transform:uppercase",
  };
  return `<div style="text-align:center;margin:28px 0"><a href="${safeHref}" style="${styles[variant]}">${safeLabel}</a></div>`;
}
