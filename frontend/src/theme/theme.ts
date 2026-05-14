import { createTheme } from "@mui/material/styles";
import { colors } from "./colors";

export const theme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#D4AF35",
    },
    secondary: {
      main: "#6C7689",
      light: "#A8A29E",
    },
    text: {
      primary: colors.white,
      secondary: colors.gray,
    },
    background: {
      default: "#E9E7E2",
      paper: "#141414",
    },

    success: {
      main: "#22C55E",
    },

    warning: {
      main: "#F59E0B",
    },

    error: {
      main: "#EF4444",
    },

    info: {
      main: "#3B82F6",
    },
  },
  typography: {
    fontFamily: "Manrope, sans-serif",
  },
});
