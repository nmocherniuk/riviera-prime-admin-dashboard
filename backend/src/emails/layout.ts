/**
 * Shared Aurevia HTML email shell (header, footer, typography).
 * Domain modules only provide inner body content via wrapEmailLayout().
 */

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function wrapEmailLayout(content: string): string {
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
