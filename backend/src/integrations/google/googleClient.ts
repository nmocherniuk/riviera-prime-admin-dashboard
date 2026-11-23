/**
 * Shared plumbing for server-side Google Maps Platform calls.
 * The API key is read from env, sent only as the `X-Goog-Api-Key` header and
 * never logged, returned to clients or put into a URL.
 */

export class GoogleApiError extends Error {
  /** HTTP status we return to our own clients. */
  readonly httpStatus: number;
  /** Google's error status (e.g. "PERMISSION_DENIED"), when available. */
  readonly googleStatus: string | undefined;

  constructor(message: string, httpStatus: number, googleStatus?: string) {
    super(message);
    this.name = "GoogleApiError";
    this.httpStatus = httpStatus;
    this.googleStatus = googleStatus;
  }
}

export function getGoogleApiKey(): string | null {
  const key = process.env.GOOGLE_MAPS_API_KEY?.trim();
  return key ? key : null;
}

export function requireGoogleApiKey(): string {
  const key = getGoogleApiKey();
  if (!key) {
    console.error("[google] GOOGLE_MAPS_API_KEY is not configured");
    throw new GoogleApiError("Address service is not configured", 503);
  }
  return key;
}

/** ISO 3166-1 alpha-2 region for ranking/formatting (e.g. "fr"). */
export function getRegionCode(): string | undefined {
  const region = process.env.GOOGLE_PLACES_REGION?.trim().toLowerCase();
  return region || undefined;
}

type GoogleErrorBody = {
  error?: { code?: number; message?: string; status?: string };
};

/**
 * Performs the request, logs Google's status/message on failure (never the key)
 * and throws GoogleApiError with a client-safe message.
 */
export async function googleFetchJson<T>(
  service: string,
  url: string,
  init: { method: "GET" | "POST"; headers: Record<string, string>; body?: string },
  clientMessage: string,
): Promise<T> {
  let res: Response;
  try {
    res = await fetch(url, {
      method: init.method,
      headers: init.headers,
      ...(init.body != null ? { body: init.body } : {}),
      signal: AbortSignal.timeout(10_000),
    });
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    console.error(`[google:${service}] network error: ${reason}`);
    throw new GoogleApiError(clientMessage, 502);
  }

  if (!res.ok) {
    let googleStatus: string | undefined;
    let googleMessage = "";
    try {
      const body = (await res.json()) as GoogleErrorBody;
      googleStatus = body.error?.status;
      googleMessage = body.error?.message ?? "";
    } catch {
      /* non-JSON error body */
    }
    console.error(
      `[google:${service}] HTTP ${res.status} ${googleStatus ?? ""} ${googleMessage}`.trim(),
    );
    // Bad client input (e.g. unknown place id) → 400/404 for us;
    // key/permission/quota/server problems → 502/503 (not the caller's fault).
    // Note: Google answers an invalid key with 400 INVALID_ARGUMENT "API key not valid".
    const keyProblem = /api key/i.test(googleMessage);
    const httpStatus =
      res.status === 404
        ? 404
        : res.status === 400 && !keyProblem
          ? 400
          : res.status === 429
            ? 503
            : 502;
    throw new GoogleApiError(clientMessage, httpStatus, googleStatus);
  }

  return (await res.json()) as T;
}
