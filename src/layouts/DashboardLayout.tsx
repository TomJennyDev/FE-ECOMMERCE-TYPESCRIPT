// material
import { Stack } from "@mui/material";
import { styled } from "@mui/material/styles";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import AlertMsg from "../components/AlertMsg";
import DashboardSidebar from "../components/dashboard/DashboardSidebar";
import MainFooter from "./MainFooter";
import MainHeader from "./MainHeader";

// ----------------------------------------------------------------------

const APP_BAR_MOBILE = 40;
const APP_BAR_DESKTOP = 80;

const RootStyle = styled("div")(({ theme }) => ({
  display: "flex",
  minHeight: "100vh",
  overflow: "hidden",
  backgroundColor: "#43484e",
}));

const MainStyle = styled("div")(({ theme }) => ({
  flexGrow: 1,
  overflow: "auto",
  minHeight: "100vh",
  paddingTop: APP_BAR_MOBILE + 30,
  paddingBottom: theme.spacing(10),
  [theme.breakpoints.up("lg")]: {
    paddingTop: APP_BAR_DESKTOP + 24,
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  paddingLeft: theme.spacing(2),
  paddingRight: theme.spacing(2),
}));

export default function DashboardLayout() {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <RootStyle>
      <AlertMsg />

      <DashboardSidebar
        isOpenSidebar={open}
        onCloseSidebar={() => setOpen(false)}
      />
      <MainStyle>
        <Stack direction="column">
          <MainHeader onOpenSidebar={() => setOpen(true)} />
          <Outlet />
          <MainFooter />
        </Stack>
      </MainStyle>
    </RootStyle>
  );
}
