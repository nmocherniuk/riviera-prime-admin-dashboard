import { Box, TextField } from "@mui/material";
import SearchField from "../../../components/SearchField";
import FilterPaper from "../../../components/FilterPaper";
import FormSelect from "../../../components/FormSelect";
import type { PaymentsFilterState } from "../constants/filters";
import {
  PAYMENT_STATUS_OPTIONS,
  DRIVER_FILTER_OPTIONS,
  VEHICLE_FILTER_OPTIONS,
} from "../constants/filters";

type PaymentsFiltersProps = {
  filters: PaymentsFilterState;
  onFilterChange: <K extends keyof PaymentsFilterState>(
    key: K,
    value: PaymentsFilterState[K]
  ) => void;
};

const textFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.04)",
  },
};

export default function PaymentsFilters({
  filters,
  onFilterChange,
}: PaymentsFiltersProps) {
  return (
    <FilterPaper>
      <Box
        sx={{
          display: "grid",
          gap: 1.5,
          gridTemplateColumns: {
            xs: "1fr 1fr",
            md: "repeat(6, minmax(0, 1fr))",
          },
        }}
      >
        <FormSelect
          options={PAYMENT_STATUS_OPTIONS}
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value as string)}
        />
        <TextField
          size="small"
          label="From"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => onFilterChange("dateFrom", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={textFieldSx}
        />
        <TextField
          size="small"
          label="To"
          type="date"
          value={filters.dateTo}
          onChange={(e) => onFilterChange("dateTo", e.target.value)}
          InputLabelProps={{ shrink: true }}
          sx={textFieldSx}
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
        <SearchField
          placeholder="Client or booking ID"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}
        />
      </Box>
    </FilterPaper>
  );
}
