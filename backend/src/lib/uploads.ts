import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const backendRoot = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../..",
);

/** Root directory for uploaded files (served at `/uploads/...`). */
export const UPLOADS_ROOT = path.resolve(
  process.env.UPLOADS_DIR?.trim() || path.join(backendRoot, "uploads"),
);

export const VEHICLE_UPLOADS_DIR = path.join(UPLOADS_ROOT, "vehicles");

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;

export const ALLOWED_IMAGE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

export { MAX_IMAGE_BYTES };

export function ensureUploadDirs(): void {
  fs.mkdirSync(VEHICLE_UPLOADS_DIR, { recursive: true });
}

/** Public origin for absolute URLs (no `/api` suffix). */
export function getApiPublicOrigin(): string {
  const explicit = process.env.API_PUBLIC_ORIGIN?.trim();
  if (explicit) return explicit.replace(/\/$/, "");
  const port = process.env.PORT || "5000";
  return `http://localhost:${port}`;
}

export function getPublicFileUrl(relativePath: string): string {
  const normalized = relativePath.startsWith("/")
    ? relativePath
    : `/${relativePath}`;
  return `${getApiPublicOrigin()}${normalized}`;
}

/** Ensure landing/clients always get a fetchable absolute URL. */
export function resolveImageUrlForClient(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl?.trim()) return null;
  const value = imageUrl.trim();
  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value;
  }
  if (value.startsWith("/uploads/")) {
    return getPublicFileUrl(value);
  }
  return value;
}

function safeBasename(p: string): string | null {
  const base = path.posix.basename(p);
  if (!base || base === "." || base === "..") return null;
  // Basic hardening: ensure no separators remain.
  if (base.includes("/") || base.includes("\\")) return null;
  return base;
}

/**
 * Resolve an `imageUrl` to an absolute on-disk path, but only if it points to
 * a file under `/uploads/vehicles/<filename>`.
 *
 * Returns `null` for external URLs, other `/uploads/*` folders, or malformed paths.
 */
export function resolveVehicleUploadPathFromImageUrl(
  imageUrl: string | null | undefined,
): string | null {
  if (!imageUrl?.trim()) return null;
  const raw = imageUrl.trim();

  let pathname: string;
  try {
    if (raw.startsWith("http://") || raw.startsWith("https://")) {
      pathname = new URL(raw).pathname;
    } else {
      pathname = raw;
    }
  } catch {
    return null;
  }

  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  const prefix = "/uploads/vehicles/";
  if (!normalized.startsWith(prefix)) return null;

  const filename = safeBasename(normalized);
  if (!filename) return null;

  return path.join(VEHICLE_UPLOADS_DIR, filename);
}

export async function deleteVehicleUploadForImageUrl(
  imageUrl: string | null | undefined,
): Promise<void> {
  const filePath = resolveVehicleUploadPathFromImageUrl(imageUrl);
  if (!filePath) return;
  try {
    await fs.promises.unlink(filePath);
  } catch (e: any) {
    // Ignore already-missing files.
    if (e?.code === "ENOENT") return;
    throw e;
  }
}
