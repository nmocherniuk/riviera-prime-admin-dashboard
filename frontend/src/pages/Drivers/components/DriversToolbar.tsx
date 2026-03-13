import { Box, Button, Paper, TextField } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";
import FileDownloadIcon from "@mui/icons-material/FileDownload";

export default function DriversToolbar() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 1.5, md: 2 },
        borderRadius: { xs: 2, md: 3 },
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          alignItems: "stretch",
          gap: 1.5,
        }}
      >
        <TextField
          size="small"
          placeholder="Search client, ID, or location..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
              </InputAdornment>
            ),
          }}
          sx={{
            flex: { xs: "1 1 auto", sm: "1 1 280px" },
            minWidth: 0,
            "& .MuiOutlinedInput-root": { borderRadius: 2 },
          }}
        />
        <Box sx={{ display: "flex", gap: 1, flex: { xs: "1 1 auto", sm: "none" } }}>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon />}
            sx={{
              flex: 1,
              borderColor: "divider",
              color: "text.primary",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Filter
          </Button>
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={{
              flex: 1,
              borderColor: "divider",
              color: "text.primary",
              borderRadius: 2,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            Export
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}
