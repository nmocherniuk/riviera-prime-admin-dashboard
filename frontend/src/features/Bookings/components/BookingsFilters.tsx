import { Box } from "@mui/material";
import SearchField from "../../../components/SearchField";
import FilterPaper from "../../../components/FilterPaper";
import FormSelect from "../../../components/FormSelect";
import type { BookingsFilterState } from "../constants/filters";
import {
  STATUS_FILTER_OPTIONS,
  DRIVER_FILTER_OPTIONS,
  VEHICLE_FILTER_OPTIONS,
  PAYMENT_FILTER_OPTIONS,
} from "../constants/filters";
import { searchFieldPlaceholder } from "../../../content/common";

type BookingsFiltersProps = {
  filters: BookingsFilterState;
  onFilterChange: <K extends keyof BookingsFilterState>(
    key: K,
    value: BookingsFilterState[K]
  ) => void;
};

export default function BookingsFilters({
  filters,
  onFilterChange,
}: BookingsFiltersProps) {
  return (
    <FilterPaper>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(5, minmax(0, 1fr))",
          },
        }}
      >
        <FormSelect
          options={STATUS_FILTER_OPTIONS}
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value as string)}
        />
        <FormSelect
          options={DRIVER_FILTER_OPTIONS}
          value={filters.driver}
          onChange={(e) => onFilterChange("driver", e.target.value as string)}
        />
        <FormSelect
          options={VEHICLE_FILTER_OPTIONS}
          value={filters.vehicle}
          onChange={(e) => onFilterChange("vehicle", e.target.value as string)}
        />
        <FormSelect
          options={PAYMENT_FILTER_OPTIONS}
          value={filters.payment}
          onChange={(e) => onFilterChange("payment", e.target.value as string)}
        />
        <SearchField
          placeholder={searchFieldPlaceholder()}
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}
        />
      </Box>
    </FilterPaper>
  );
}
