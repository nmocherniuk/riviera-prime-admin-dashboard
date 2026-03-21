import { alpha } from "@mui/material/styles";
import type { Theme } from "@mui/material/styles";

export const formContainerSx = () => ({
    bgcolor: "background.paper",
    border: 1,
    borderColor: "divider",
    borderRadius: 3,
    display: { xs: "block", md: "flex" },
    alignItems: { xs: "center", md: "center" },
    gap: { xs: 0, md: 4 }
});

export const formTextFieldSx = (theme: Theme) => ({
    "& .MuiOutlinedInput-root": {
        borderRadius: 2,
        bgcolor: alpha(theme.palette.common.white, 0.04),
        border: `1px solid ${alpha(theme.palette.common.white, 0.08)}`,
        transition: "all 0.2s ease",
    },
});