import type { SecurityRequestBody } from "./securityRequest.schemas.js";
import {
  sendSecurityRequestAdminEmail,
  sendSecurityRequestClientConfirmationEmail,
} from "./securityRequest.emails.js";

export async function submitSecurityRequestService(
  body: SecurityRequestBody,
): Promise<void> {
  await sendSecurityRequestAdminEmail(body);
  await sendSecurityRequestClientConfirmationEmail(body);
}
