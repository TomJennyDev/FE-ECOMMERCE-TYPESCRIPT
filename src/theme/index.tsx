import { CssBaseline } from "@mui/material";
import {
  createTheme,
  ThemeOptions,
  ThemeProvider as MUIThemeProvider,
} from "@mui/material/styles";
import { ReactNode } from "react";
import customizeComponents from "./customizations";
import palette from "./palette";

interface ThemeProviderProps {
  children: ReactNode;
}

function ThemeProvider({ children }: ThemeProviderProps) {
  const themeOptions: ThemeOptions = {
    palette: palette,
    shape: { borderRadius: 8 },
    zIndex: {
      tooltip: 999999,
    },
  };
  const theme = createTheme(themeOptions);
  theme.components = customizeComponents(theme);

  return (
    <MUIThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MUIThemeProvider>
  );
}

export default ThemeProvider;
