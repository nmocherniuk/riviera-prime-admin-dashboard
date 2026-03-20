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
  { value: FILTER_ALL, label: "Status: All" },
  { value: "pending", label: "Pending" },
  { value: "authorized", label: "Authorized" },
  { value: "paid", label: "Paid" },
  { value: "failed", label: "Failed" },
  { value: "refunded", label: "Refunded" },
];

export const DRIVER_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: "Driver: All" },
  { value: "clara", label: "Clara" },
  { value: "marcus", label: "Marcus" },
];

export const VEHICLE_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: "Vehicle: All" },
  { value: "bmw", label: "BMW 7 Series" },
  { value: "mercedes", label: "Mercedes S-Class" },
  { value: "audi", label: "Audi A8" },
  { value: "range", label: "Range Rover" },
];
