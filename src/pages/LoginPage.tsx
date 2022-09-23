import AccountBoxIcon from "@mui/icons-material/AccountBox";
import ContactMailIcon from "@mui/icons-material/ContactMail";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import { Box, Card, Stack, Tab, Tabs } from "@mui/material";
import { capitalCase } from "change-case";
import React, { useState } from "react";
import Logo from "../components/Logo";
import Login from "../features/user/Login";
import Register from "../features/user/Register";
import useResponsive from "../hooks/useResponsive";
import ResetPassword from "./../features/user/ResetPassword";

function LoginPage() {
  const mdUp = useResponsive("up", "md");

  const [currentTab, setCurrentTab] = useState("login");

  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const PROFILE_TABS = [
    {
      value: "login",
      icon: <AccountBoxIcon sx={{ fontSize: 20 }} />,
      component: <Login setCurrentTab={setCurrentTab} />,
    },
    {
      value: "register",
      icon: <PeopleAltIcon sx={{ fontSize: 20 }} />,
      component: <Register setCurrentTab={setCurrentTab} />,
    },
    {
      value: "reset password",
      icon: <ContactMailIcon sx={{ fontSize: 20 }} />,
      component: <ResetPassword setCurrentTab={setCurrentTab} />,
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        width: 1,
        minHeight: "100vh",
        backgroundColor: "#F2F5F9",
      }}
    >
      {mdUp && (
        <Stack justifyContent="center" alignItems="center" width="45%">
          <img
            width="80%"
            styled={{ fill: "red" }}
            src={process.env.PUBLIC_URL + "/covers/e-5.svg"}
            alt="logo"
          />
        </Stack>
      )}
      <Stack flexGrow="1">
        <Box
          sx={{
            height: "25%",
            width: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "flex-end",
          }}
        >
          <Logo sx={{ width: 80, height: 80, mb: 3 }} />
        </Box>
        <Box
          sx={{
            height: "80%",
            width: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Card
            sx={{
              maxwidth: "sm",
              position: "relative",
            }}
          >
            <Tabs
              value={currentTab}
              scrollButtons="auto"
              allowScrollButtonsMobile
              onChange={(e, value) => handleChangeTab(value)}
            >
              {PROFILE_TABS.map((tab) => (
                <Tab
                  key={tab.value}
                  value={tab.value}
                  icon={tab.icon}
                  iconPosition="end"
                  label={capitalCase(tab.value)}
                />
              ))}
            </Tabs>

            {PROFILE_TABS.map((tab) => {
              const isMatched = tab.value === currentTab;
              return (
                isMatched && (
                  <Box key={tab.value} sx={{ px: 0.5, py: 2 }}>
                    {tab.component}
                  </Box>
                )
              );
            })}
          </Card>
        </Box>
      </Stack>
    </Box>
  );
}

export default LoginPage;
