import {
  commonContent,
  filterOptionAllLabel,
} from "../../../content/common";
import { bookingContent } from "../../../content/booking";

export const FILTER_ALL = "all";

export type BookingsFilterState = {
  status: string;
  driver: string;
  vehicle: string;
  payment: string;
  search: string;
};

export const DEFAULT_BOOKINGS_FILTERS: BookingsFilterState = {
  status: FILTER_ALL,
  driver: FILTER_ALL,
  vehicle: FILTER_ALL,
  payment: FILTER_ALL,
  search: "",
};

export type FilterOption = { value: string; label: string };

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: filterOptionAllLabel("status") },
  { value: "pending", label: bookingContent.filters.status.pending },
  { value: "assigned", label: bookingContent.filters.status.assigned },
  { value: "completed", label: bookingContent.filters.status.completed },
  { value: "cancelled", label: bookingContent.filters.status.cancelled },
];

export const DRIVER_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: filterOptionAllLabel("driver") },
  { value: "clara", label: "Clara" },
  { value: "marcus", label: "Marcus" },
];

export const VEHICLE_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: filterOptionAllLabel("vehicle") },
  { value: "bmw", label: "BMW 7 Series" },
  { value: "mercedes", label: "Mercedes S-Class" },
  { value: "audi", label: "Audi A8" },
  { value: "range", label: "Range Rover" },
];

export const PAYMENT_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: filterOptionAllLabel("payment") },
  { value: "paid", label: commonContent.paymentStatus.paid },
  { value: "unpaid", label: commonContent.paymentStatus.unpaid },
];
