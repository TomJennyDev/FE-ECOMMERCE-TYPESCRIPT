import BallotIcon from "@mui/icons-material/Ballot";
import { Container, Stack, Typography } from "@mui/material";
import React from "react";
import OrderList from "../features/order/OrderList";
import { TitleStyle } from "../theme/customizations/TitleStyle";

export default function OrderPage() {
  return (
    <Container sx={{ my: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" sx={{ pb: 2 }}>
          <TitleStyle>
            <BallotIcon sx={{ width: "35px", height: "35px" }} />
            <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
              Order
            </Typography>
          </TitleStyle>
        </Stack>
      </Stack>
      <OrderList />
    </Container>
  );
}
