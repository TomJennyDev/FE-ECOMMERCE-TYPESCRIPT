import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import {
  Avatar,
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import useAuth from "../../hooks/useAuth";
import { TitleStyle } from "../../theme/customizations/TitleStyle";
import { addDays, fDate } from "../../utils/formatTime";
import { fCurrency } from "../../utils/numberFormat";
import { createOrder } from "../order/orderSlice";
import { labelMethodPayment } from "./CartPayment";
import CheckOutSumTable from "./CartSumTable";

function CartSummary() {
  const dispatch = useAppDispatch();
  const { products, cart } = useAppSelector((state) => state.cart);
  const { shipping, payment } = cart;
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleCheckout = () => {
    const order = {
      cartId: cart._id,
      shipping,
      payment,
      products,
    };

    dispatch(createOrder(order));
    navigate("/order");
  };
  return (
    <Container>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Stack direction="row" alignItems="center" sx={{ pb: 2 }}>
          <TitleStyle>
            <FactCheckIcon sx={{ width: "35px", height: "35px" }} />
            <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
              Summary
            </Typography>
          </TitleStyle>
        </Stack>

        <Box>
          <Button
            variant="contained"
            onClick={handleCheckout}
            disabled={!shipping?.method || !products.length}
            startIcon={<DoneAllIcon />}
          >
            Checkout
          </Button>
        </Box>
      </Stack>
      <Divider sx={{ m: 1 }} />
      <Stack direction="row" spacing={3} justifyContent="space-between" my={3}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <Stack
              component={Paper}
              spacing={1}
              sx={{ p: 2, minHeight: " 300px" }}
            >
              <Avatar
                sx={{ bgcolor: "primary.main", m: 1, width: 56, height: 56 }}
                alt={user?.name}
                src={user?.avatarUrl as string}
              />
              <Typography variant="subtitle1" textAlign="left">
                Name: {user?.name}
              </Typography>
              <Typography variant="subtitle1">
                Phone: {shipping?.phone}
              </Typography>
              <Typography variant="subtitle1">
                Address:{" "}
                {shipping &&
                  `${shipping?.address1}  
                  ${shipping?.ward} ward, 
                  district ${shipping?.district}, 
                  ${shipping?.city} city.`}
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack
              component={Paper}
              spacing={1}
              sx={{ p: 2, minHeight: " 300px" }}
            >
              <Avatar
                sx={{ bgcolor: "success.main", m: 1, width: 56, height: 56 }}
              >
                <LocalShippingIcon />
              </Avatar>
              <Stack direction="row" justifyContent="space-Between" spacing={3}>
                <Typography variant="subtitle1" textAlign="center">
                  Place on:
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  {fDate(new Date())}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-Between" spacing={3}>
                <Typography variant="subtitle1" textAlign="center">
                  Delivered on:
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  {shipping?.method && addDays(new Date(), +shipping?.method)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-Between" spacing={3}>
                <Typography variant="subtitle1" textAlign="center">
                  Payment method:
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  {payment?.method && labelMethodPayment[payment?.method]}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-Between" spacing={2}>
                <Typography variant="subtitle1" textAlign="center"></Typography>
                <Typography variant="subtitle2" textAlign="center"></Typography>
              </Stack>
            </Stack>
          </Grid>
          <Grid item xs={12} md={4}>
            <Stack
              component={Paper}
              spacing={1}
              sx={{ p: 2, minHeight: " 300px" }}
            >
              <Avatar
                sx={{ bgcolor: "secondary.main", m: 1, width: 56, height: 56 }}
              >
                <AttachMoneyIcon />
              </Avatar>
              <Stack direction="row" justifyContent="space-Between" spacing={2}>
                <Typography variant="subtitle1" textAlign="center">
                  SubTotal:
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  {payment?.total?.subTotal &&
                    fCurrency(payment?.total?.subTotal)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-Between" spacing={2}>
                <Typography variant="subtitle1" textAlign="center">
                  Shipping:
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  {payment?.total?.shipping &&
                    fCurrency(payment?.total?.shipping)}
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-Between" spacing={2}>
                <Typography variant="subtitle1" textAlign="center">
                  Tax (VAT):
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  10%
                </Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-Between" spacing={2}>
                <Typography variant="subtitle1" textAlign="center">
                  Discount:
                </Typography>
                <Typography variant="subtitle2" textAlign="center">
                  __
                </Typography>
              </Stack>
              <Divider sx={{ m: 1 }} />
              <Stack direction="row" justifyContent="flex-end" spacing={2}>
                <Typography variant="h6" textAlign="center">
                  {payment?.total?.total && fCurrency(payment?.total?.total)}
                </Typography>
              </Stack>
            </Stack>
          </Grid>
        </Grid>
      </Stack>
      <CheckOutSumTable products={products} />
    </Container>
  );
}

export default CartSummary;
