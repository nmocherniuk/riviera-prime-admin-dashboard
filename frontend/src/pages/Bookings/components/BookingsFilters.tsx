import {
  Box,
  InputAdornment,
  MenuItem,
  Paper,
  Select,
  TextField,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

export default function BookingsFilters() {
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
        <Select size="small" defaultValue="all">
          <MenuItem value="all">Status: All</MenuItem>
          <MenuItem value="pending">Status: Pending</MenuItem>
          <MenuItem value="confirmed">Status: Confirmed</MenuItem>
        </Select>

        <Select size="small" defaultValue="all">
          <MenuItem value="all">Driver: All</MenuItem>
          <MenuItem value="clara">Driver: Clara</MenuItem>
          <MenuItem value="marcus">Driver: Marcus</MenuItem>
        </Select>

        <Select size="small" defaultValue="all">
          <MenuItem value="all">Vehicle: All</MenuItem>
          <MenuItem value="sedan">Vehicle: Sedan</MenuItem>
          <MenuItem value="van">Vehicle: Van</MenuItem>
        </Select>

        <Select size="small" defaultValue="all">
          <MenuItem value="all">Payment: All</MenuItem>
          <MenuItem value="paid">Payment: Paid</MenuItem>
          <MenuItem value="unpaid">Payment: Unpaid</MenuItem>
        </Select>

        <TextField
          size="small"
          placeholder="Search client, id, or location"
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
