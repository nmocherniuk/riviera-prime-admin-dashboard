import type { Payment } from "../../../api/payments";
import type { PaymentsFilterState } from "../constants/filters";

export function filterPayments(
  payments: Payment[],
  filters: PaymentsFilterState
): Payment[] {
  return payments.filter((p) => {
    if (filters.status !== "all" && p.paymentStatus !== filters.status) return false;
    if (filters.driver !== "all") {
      const driverMatch = p.driverName?.toLowerCase() === filters.driver.toLowerCase();
      if (!driverMatch) return false;
    }
    if (filters.vehicle !== "all") {
      const v = p.vehicle?.toLowerCase() ?? "";
      if (!v.includes(filters.vehicle.toLowerCase())) return false;
    }
    if (filters.dateFrom && p.date < filters.dateFrom) return false;
    if (filters.dateTo && p.date > filters.dateTo) return false;
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      const match =
        p.clientName.toLowerCase().includes(q) ||
        p.bookingId.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });
}
