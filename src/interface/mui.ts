import { PaletteColor } from "@mui/material";

export type ColorSchema =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error"
  | "default";

export type ColorSchemaWithoutDefault =
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export type PaletteColorKey = keyof PaletteColor;

export type Variant = "filled" | "outlined" | "ghost";

export type OrderTable = "asc" | "desc";
