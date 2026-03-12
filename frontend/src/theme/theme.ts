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
    },
    background: {
      default: "#E9E7E2",
      paper: "#141414",
    },
  },
  typography: {
    fontFamily: "Manrope, sans-serif",
  },
});
