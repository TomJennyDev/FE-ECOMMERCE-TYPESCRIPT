import { Stack } from "@mui/material";
import { Outlet } from "react-router-dom";
import AlertMsg from "../components/AlertMsg";

function BlankLayout() {
  return (
    <Stack minHeight="100vh">
      <AlertMsg />

      <Outlet />
    </Stack>
  );
}

export default BlankLayout;
