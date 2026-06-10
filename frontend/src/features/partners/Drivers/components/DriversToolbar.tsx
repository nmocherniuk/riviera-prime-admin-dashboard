import { Box, Button } from "@mui/material";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SearchField from "../../../../components/SearchField";
import FilterPaper from "../../../../components/FilterPaper";
import { commonContent } from "../../../../content/common";
import { driversContent } from "../../../../content/drivers";

const outlineButtonSx = {
  flex: 1,
  borderColor: "divider",
  color: "text.primary",
  borderRadius: 2,
  textTransform: "none" as const,
  fontWeight: 600,
};

export default function DriversToolbar() {
  return (
    <FilterPaper>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          flexWrap: "wrap",
          alignItems: "stretch",
          gap: 1.5,
        }}
      >
        <SearchField
          placeholder={driversContent.toolbar.searchPlaceholder}
          sx={{
            flex: { xs: "1 1 auto", sm: "1 1 280px" },
            minWidth: 0,
          }}
        />
        <Box
          sx={{ display: "flex", gap: 1, flex: { xs: "1 1 auto", sm: "none" } }}
        >
          <Button
            variant="outlined"
            startIcon={<FileDownloadIcon />}
            sx={outlineButtonSx}
          >
            {commonContent.dataTable.export}
          </Button>
        </Box>
      </Box>
    </FilterPaper>
  );
}
