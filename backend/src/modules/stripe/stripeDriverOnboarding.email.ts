/**
 * HTML email: driver opens Stripe Connect onboarding (same layout as booking emails).
 */
export function buildDriverStripeOnboardingEmailHtml(options: {
  driverName: string;
  onboardingUrl: string;
}): string {
  const { driverName, onboardingUrl } = options;
  const safeName = driverName.trim() || "there";

  return `<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#f5f5f4;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif">
  <div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,.08)">
    <div style="background:#141414;padding:24px 32px">
      <span style="color:#D4AF35;font-size:22px;font-weight:700;letter-spacing:1px">AUREVIA</span>
    </div>
    <div style="padding:32px">
      <h2 style="margin:0 0 8px;color:#141414">Complete your payout setup</h2>
      <p style="color:#555;line-height:1.6">
        Hello <strong>${escapeHtml(safeName)}</strong>,<br>
        To receive payouts, open the secure link below on your phone or computer and complete
        Stripe onboarding. You do not need a driver portal or admin login —
        the link is all you need. Bank details are collected only by Stripe.
      </p>
      <div style="text-align:center;margin:28px 0">
        <a href="${escapeHtml(onboardingUrl)}"
           style="display:inline-block;padding:14px 28px;background:transparent;color:#D4AF35;
                  font-weight:700;font-size:15px;text-decoration:none;border-radius:8px;
                  border:2px solid #D4AF35;letter-spacing:0.06em;text-transform:uppercase">
          Stripe account — connect payouts
        </a>
      </div>
      <p style="color:#888;font-size:13px;line-height:1.5">
        If the button does not work, copy this link into your browser:<br>
        <span style="word-break:break-all;color:#555">${escapeHtml(onboardingUrl)}</span>
      </p>
    </div>
    <div style="padding:16px 32px;background:#fafafa;text-align:center;color:#aaa;font-size:12px">
      &copy; ${new Date().getFullYear()} Aurevia. All rights reserved.
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
