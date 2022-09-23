import CategoryIcon from "@mui/icons-material/Category";
import ReviewsIcon from "@mui/icons-material/Reviews";
import { Box, Stack, Tab, Tabs } from "@mui/material";
import { styled } from "@mui/material/styles";
import { capitalCase } from "change-case";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";

const TabsWrapperStyle = styled("div")(({ theme }) => ({
  display: "flex",
  justifyContent: "center",
  paddingBottom: theme.spacing(2),
}));

function ProductTabs() {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState("Descriptions");
  const { id: productId } = useParams();
  const handleChangeTab = (newValue) => {
    setCurrentTab(newValue);
  };

  const PROFILE_TABS = [
    {
      value: "Descriptions",
      icon: <CategoryIcon sx={{ fontSize: 24 }} />,
      component: <ProductDescription setCurrentTab={setCurrentTab} />,
    },
    {
      value: "Reviews",
      icon: <ReviewsIcon sx={{ fontSize: 24 }} />,
      component: (
        <ProductReviews productId={productId} setCurrentTab={setCurrentTab} />
      ),
    },
  ];

  return (
    <Box
      sx={{
        display: "flex",
        width: 1,
        minHeight: "100vh",
        mt: 5,
        backgroundColor: "white",
      }}
    >
      <Stack flexGrow="1">
        <Box
          sx={{
            height: "80%",
            width: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "left",
          }}
        >
          <Box
            sx={{
              position: "relative",
            }}
          >
            <Box
              sx={{
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "background.paper",
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
            </Box>
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
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}

export default ProductTabs;
