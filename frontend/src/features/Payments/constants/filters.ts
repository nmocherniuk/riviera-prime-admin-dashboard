import { filterOptionAllLabel, commonContent } from "../../../content/common";

export const FILTER_ALL = "all";

export type PaymentsFilterState = {
  status: string;
  driver: string;
  vehicle: string;
  dateFrom: string;
  dateTo: string;
  search: string;
};

export const DEFAULT_PAYMENTS_FILTERS: PaymentsFilterState = {
  status: FILTER_ALL,
  driver: FILTER_ALL,
  vehicle: FILTER_ALL,
  dateFrom: "",
  dateTo: "",
  search: "",
};

export type FilterOption = { value: string; label: string };

export const PAYMENT_STATUS_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: filterOptionAllLabel("status") },
  { value: "unpaid", label: commonContent.paymentStatus.unpaid },
  { value: "paid", label: commonContent.paymentStatus.paid },
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
