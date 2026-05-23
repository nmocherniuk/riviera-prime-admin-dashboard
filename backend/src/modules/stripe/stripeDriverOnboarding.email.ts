import {
  emailButton,
  emailHeading,
  emailMutedParagraph,
  emailParagraph,
  escapeHtml,
  getStripeOnboardingEmailCopy,
  parseEmailLocale,
  wrapEmailLayout,
  type EmailLocale,
} from "../../emails/index.js";

export function buildDriverStripeOnboardingEmailHtml(options: {
  driverName: string;
  onboardingUrl: string;
  locale?: EmailLocale | string | null;
}): string {
  const { driverName, onboardingUrl } = options;
  const locale = parseEmailLocale(options.locale);
  const copy = getStripeOnboardingEmailCopy(locale);
  const safeName = driverName.trim() || (locale === "fr" ? "à vous" : "there");

  return wrapEmailLayout(`
    ${emailHeading(copy.heading)}
    ${emailParagraph(`${copy.greeting(escapeHtml(safeName))}<br>${copy.body}`)}
    ${emailButton(onboardingUrl, copy.cta, "outline")}
    ${emailMutedParagraph(
      `${copy.linkFallback}<br>
      <span style="word-break:break-all;color:#555">${escapeHtml(onboardingUrl)}</span>`,
    )}
  `);
}
