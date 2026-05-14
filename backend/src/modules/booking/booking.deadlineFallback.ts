import { prisma } from "../../lib/prisma.js";
import type { Prisma } from "../../generated/prisma/client.js";
import { parseCandidateDriverIdsJson } from "./booking.repository.js";
import { sendBookingAllRejectedEmail } from "./booking.emails.js";

const DEFAULT_INTERVAL_MS = 60_000;
let missingDeadlineColumnWarned = false;

function getIntervalMs(): number {
  const raw = Number(process.env.DRIVER_DEADLINE_WATCH_INTERVAL_MS ?? "");
  if (!Number.isFinite(raw) || raw < 5_000) return DEFAULT_INTERVAL_MS;
  return raw;
}

async function processExpiredPendingBookings(): Promise<void> {
  const now = new Date();
  let expired: Array<{
    id: string;
    clientName: string;
    clientEmail: string;
    from: string;
    to: string;
    bookingAt: Date;
    durationMin: number;
    candidateDriverIds: unknown;
  }> = [];
  try {
    expired = await prisma.bookings.findMany({
      where: {
        status: "PENDING",
        driverId: null,
        driverResponseDeadline: { lte: now },
      },
      select: {
        id: true,
        clientName: true,
        clientEmail: true,
        from: true,
        to: true,
        bookingAt: true,
        durationMin: true,
        candidateDriverIds: true,
      },
      take: 100,
      orderBy: { driverResponseDeadline: "asc" },
    });
  } catch (error) {
    const isMissingColumn =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2022";
    if (isMissingColumn) {
      if (!missingDeadlineColumnWarned) {
        missingDeadlineColumnWarned = true;
        console.warn(
          "[booking-deadline-fallback] driverResponseDeadline column is missing; watcher is idle until migration is applied.",
        );
      }
      return;
    }
    throw error;
  }

  if (!expired.length) return;

  for (const booking of expired) {
    const candidates = parseCandidateDriverIdsJson(
      booking.candidateDriverIds as Prisma.JsonValue,
    );
    const nextCandidates = candidates.map((c) =>
      c.status.toLowerCase() === "pending" ? { ...c, status: "rejected" } : c,
    );

    const updated = await prisma.bookings.updateMany({
      where: {
        id: booking.id,
        status: "PENDING",
        driverId: null,
      },
      data: {
        status: "CANCELLED",
        candidateDriverIds: nextCandidates,
      },
    });

    // Update guarded by current status -> prevents duplicate fallback emails.
    if (updated.count === 0) continue;

    void sendBookingAllRejectedEmail({
      bookingId: booking.id,
      clientName: booking.clientName,
      clientEmail: booking.clientEmail,
      from: booking.from,
      to: booking.to,
      bookingAt: booking.bookingAt,
      durationMin: booking.durationMin,
    });
  }
}

export function startDriverDeadlineFallbackWatcher(): void {
  const intervalMs = getIntervalMs();
  void processExpiredPendingBookings().catch((error) => {
    console.error("[booking-deadline-fallback] initial run failed:", error);
  });
  setInterval(() => {
    void processExpiredPendingBookings().catch((error) => {
      console.error("[booking-deadline-fallback] periodic run failed:", error);
    });
  }, intervalMs);
}

