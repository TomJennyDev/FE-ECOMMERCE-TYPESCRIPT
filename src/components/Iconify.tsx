import { Icon, IconifyIcon } from "@iconify/react";
import { Box, BoxProps, SxProps, Theme } from "@mui/material";

interface IconifyProps extends BoxProps {
  icon: IconifyIcon | string;
  sx?: SxProps<Theme>;
}

export default function Iconify({ icon, sx, ...other }: IconifyProps) {
  return <Box component={Icon} icon={icon} sx={{ ...sx }} {...other} />;
}
