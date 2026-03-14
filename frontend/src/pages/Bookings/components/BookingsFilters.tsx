import {
  Box,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import type { BookingsFilterState } from "../constants/filters";
import {
  STATUS_FILTER_OPTIONS,
  DRIVER_FILTER_OPTIONS,
  VEHICLE_FILTER_OPTIONS,
  PAYMENT_FILTER_OPTIONS,
} from "../constants/filters";

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
    <Paper
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
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
        <Select
          size="small"
          value={filters.status}
          onChange={(e) => onFilterChange("status", e.target.value)}
          displayEmpty
        >
          {STATUS_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={filters.driver}
          onChange={(e) => onFilterChange("driver", e.target.value)}
          displayEmpty
        >
          {DRIVER_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={filters.vehicle}
          onChange={(e) => onFilterChange("vehicle", e.target.value)}
          displayEmpty
        >
          {VEHICLE_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        <Select
          size="small"
          value={filters.payment}
          onChange={(e) => onFilterChange("payment", e.target.value)}
          displayEmpty
        >
          {PAYMENT_FILTER_OPTIONS.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>
              {opt.label}
            </MenuItem>
          ))}
        </Select>

        <TextField
          size="small"
          placeholder="Пошук: клієнт, id або маршрут"
          value={filters.search}
          onChange={(e) => onFilterChange("search", e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
          sx={{ gridColumn: { xs: "1 / -1", md: "auto" } }}
        />
      </Box>
    </Paper>
  );
}
