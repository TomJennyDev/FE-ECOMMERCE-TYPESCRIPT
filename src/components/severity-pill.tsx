import { styled } from "@mui/material/styles";
import { ReactNode } from "react";
import { ColorSchemaWithoutDefault } from "../interface/mui";

interface SeverityPillRootProps {
  ownerState: { color: ColorSchemaWithoutDefault };
}

const SeverityPillRoot = styled("span")<SeverityPillRootProps>(
  ({ theme, ownerState }) => {
    const backgroundColor = theme.palette[ownerState.color].main;
    const color = theme.palette[ownerState.color].contrastText;

    return {
      alignItems: "center",
      backgroundColor,
      borderRadius: 12,
      color,
      cursor: "default",
      display: "inline-flex",
      flexGrow: 0,
      flexShrink: 0,
      fontFamily: theme.typography.fontFamily,
      fontSize: theme.typography.pxToRem(12),
      lineHeight: 2,
      fontWeight: 600,
      justifyContent: "center",
      letterSpacing: 0.5,
      minWidth: 20,
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
      textTransform: "uppercase",
      whiteSpace: "nowrap",
    };
  }
);

interface SeverityPillProps {
  color: ColorSchemaWithoutDefault;
  children: ReactNode;
}

export const SeverityPill = (props: SeverityPillProps) => {
  const { color = "primary", children, ...other } = props;

  const ownerState = { color };

  return (
    <SeverityPillRoot ownerState={ownerState} {...other}>
      {children}
    </SeverityPillRoot>
  );
};
