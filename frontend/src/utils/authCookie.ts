/** Must match access JWT lifetime on the backend (15m). */
const ACCESS_MAX_AGE_SEC = 15 * 60;

const COOKIE_NAME = "aurevia_access_token";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const match = document.cookie.match(new RegExp(`(?:^|; )${escaped}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function cookieFlags() {
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? ";Secure"
      : "";
  return `path=/;max-age=${ACCESS_MAX_AGE_SEC};SameSite=Lax${secure}`;
}

export function writeAccessTokenCookie(token: string) {
  if (typeof document === "undefined") return;
  const value = encodeURIComponent(token);
  document.cookie = `${COOKIE_NAME}=${value};${cookieFlags()}`;
}

export function clearAccessTokenCookie() {
  if (typeof document === "undefined") return;
  const secure =
    typeof window !== "undefined" && window.location.protocol === "https:"
      ? ";Secure"
      : "";
  document.cookie = `${COOKIE_NAME}=;path=/;max-age=0;SameSite=Lax${secure}`;
}

export function readStoredAccessToken(): string | null {
  try {
    return getCookie(COOKIE_NAME);
  } catch {
    return null;
  }
}
