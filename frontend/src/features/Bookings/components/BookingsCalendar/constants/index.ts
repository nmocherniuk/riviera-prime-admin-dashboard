import type { BookingStatus } from "../data/dummyBookings";
import { bookingContent } from "../../../../../content/booking";

export const STATUS_STYLES: Record<
  BookingStatus,
  { borderColor: string; accentColor: string; bgColor: string }
> = {
  pending: {
    borderColor: "#F59E0B",
    accentColor: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.08)",
  },
  assigned: {
    borderColor: "#3B82F6",
    accentColor: "#3B82F6",
    bgColor: "rgba(59, 130, 246, 0.08)",
  },
  completed: {
    borderColor: "#22C55E",
    accentColor: "#22C55E",
    bgColor: "rgba(34, 197, 94, 0.08)",
  },
  cancelled: {
    borderColor: "#EF4444",
    accentColor: "#EF4444",
    bgColor: "rgba(239, 68, 68, 0.08)",
  },
};

export const DEFAULT_STATUS_STYLE = {
  borderColor: "rgba(255,255,255,0.3)",
  accentColor: "#3B82F6",
  bgColor: "rgba(255,255,255,0.06)",
};

export const STATUS_LABELS: Record<BookingStatus, string> = {
  pending: bookingContent.filters.status.pending,
  assigned: bookingContent.filters.status.assigned,
  completed: bookingContent.filters.status.completed,
  cancelled: bookingContent.filters.status.cancelled,
};
