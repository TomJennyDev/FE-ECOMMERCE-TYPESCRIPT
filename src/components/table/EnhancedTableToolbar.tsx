import { alpha } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { ReactNode } from "react";

interface EnhancedTableToolbarProps {
  numSelected: number;
  children: ReactNode;
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, children } = props;

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        }),
      }}
    >
      {children}
    </Toolbar>
  );
}

export default EnhancedTableToolbar;
