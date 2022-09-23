import { styled } from "@mui/system";
import { ReactNode } from "react";
//Style

const Label = styled("label")({
  marginBottom: "10px",
  display: "inline-block",
  fontWeight: 500,
});

interface InputLabelProps {
  children: ReactNode;
}

export default function InputLabel({ children, ...other }: InputLabelProps) {
  return <Label {...other}>{children}</Label>;
}
