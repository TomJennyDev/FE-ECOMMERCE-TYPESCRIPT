import { Box } from "@mui/material";
import { SxProps, Theme } from "@mui/material/styles";
import { Link as RouterLink } from "react-router-dom";
import logoImg from "../logo.png";

interface LogoProps {
  disabledLink?: boolean;
  sx?: SxProps<Theme>;
}

function Logo({ disabledLink = false, sx }: LogoProps) {
  const logo = (
    <Box sx={{ width: 40, height: 40, ...sx }}>
      <img src={logoImg} alt="logo" width="100%" />
    </Box>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return <RouterLink to="/">{logo}</RouterLink>;
}

export default Logo;
