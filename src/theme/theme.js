import { createTheme } from "@mui/material/styles";
import colors from "./colors";

const theme = createTheme({
  palette: {
    primary: {
      main: colors.primary,
    },
    secondary: {
      main: colors.secondary,
    },
    background: {
      default: colors.background,
    },
    text: {
      primary: colors.text,
    },
  },
  typography: {
    fontFamily: "Arial, sans-serif",
  },
});

export default theme;
