
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
  { value: FILTER_ALL, label: "Статус: Всі" },
  { value: "pending", label: "Очікує" },
  { value: "assigned", label: "Ongoing" },
  { value: "completed", label: "Завершено" },
  { value: "cancelled", label: "Скасовано" },
];

export const DRIVER_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: "Водій: Всі" },
  { value: "clara", label: "Clara" },
  { value: "marcus", label: "Marcus" },
];

export const VEHICLE_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: "Авто: Всі" },
  { value: "bmw", label: "BMW 7 Series" },
  { value: "mercedes", label: "Mercedes S-Class" },
  { value: "audi", label: "Audi A8" },
  { value: "range", label: "Range Rover" },
];

export const PAYMENT_FILTER_OPTIONS: FilterOption[] = [
  { value: FILTER_ALL, label: "Оплата: Всі" },
  { value: "paid", label: "Оплачено" },
  { value: "unpaid", label: "Не оплачено" },
];
