import { yupResolver } from "@hookform/resolvers/yup";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentIcon from "@mui/icons-material/Payment";
import { LoadingButton } from "@mui/lab";
import {
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { addDays } from "date-fns";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import { FormProvider, FRadioGroup, FTextField } from "../../components/form";
import { Cart, Shipping } from "../../interface";
import { TitleStyle } from "../../theme/customizations/TitleStyle";
import CartSideBar from "./CartSideBar";
import { setActiveStep, updateCart } from "./cartSlice";

const DeliverySchema = yup.object().shape({
  email: yup.string().email().required("Email is required"),
  phone: yup.number().required("Phone is required"),
  city: yup.string().required("City is required"),
  district: yup.string().required("District is required"),
  ward: yup.string().required("Ward is required"),
  address1: yup.string().required("Address is required"),
  address2: yup.string(),
});

export const shippingMethodLabel = {
  7: "Free (expect to recive in 5-7 days)",
  5: "Express (expect to receive in 3-5 days)",
  1: "Next Day",
};
const shippingMethod = [7, 5, 1];

const defaultData: Partial<Shipping> = {
  email: "",
  phone: 0,
  city: "",
  district: "",
  ward: "",
  address1: "",
  address2: "",
  method: 1,
};

function CartDelivery() {
  const dispatch = useAppDispatch();
  const { cart, isLoading, activeStep } = useAppSelector((state) => state.cart);
  const { shipping } = cart;
  let defaultValues = shipping;

  let methods = useForm<Partial<Shipping>>({
    defaultValues,
    shouldUnregister: false,
    resolver: yupResolver(DeliverySchema),
  });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = (data: Partial<Shipping>) => {
    const { method, ...restData } = data;

    const deliveryTime = addDays(new Date(), Number(method)).toISOString();

    const cartUpdate: Partial<Cart> = {
      ...cart,
      shipping: { ...restData, deliveryTime, method: Number(method) },
      status: "Delivery",
    };
    dispatch(updateCart(cartUpdate));
    dispatch(setActiveStep(activeStep + 1));
  };

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box component={Paper} sx={{ width: 1, pb: 2, p: 1 }}>
              <Stack direction="row" alignItems="center" sx={{ pb: 2 }}>
                <TitleStyle>
                  <LocalShippingIcon sx={{ width: "35px", height: "35px" }} />
                  <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
                    Delivery
                  </Typography>
                </TitleStyle>
              </Stack>
              <Typography variant="h6" textAlign="left" sx={{ p: 1 }}>
                Address
              </Typography>
              <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                <FTextField name="email" label="Email" />
                <FTextField name="phone" label="Phone" />
              </Stack>
              <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                <FTextField name="city" label="City" />
                <FTextField name="district" label="District" />
                <FTextField name="ward" label="Ward" />
              </Stack>
              <Stack direction="row" spacing={3} sx={{ p: 2 }}>
                <FTextField name="address1" label="Address1" />
                <FTextField name="address2" label="Address2" />
              </Stack>
              <Stack direction="column" spacing={3} sx={{ p: 2 }}>
                <Typography variant="h6" textAlign="left">
                  Shipping Method
                </Typography>
                <FRadioGroup
                  name="method"
                  options={shippingMethod}
                  getOptionLabel={shippingMethodLabel}
                />
              </Stack>
              <Stack
                direction="row"
                justifyContent="flex-end"
                spacing={3}
                sx={{ p: 2 }}
              >
                <Button
                  variant="outlined"
                  onClick={() => {
                    reset(defaultData);
                  }}
                  startIcon={<ClearAllIcon />}
                >
                  Clear
                </Button>
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <CartSideBar />
            <Stack sx={{ py: 3 }}>
              <LoadingButton
                type="submit"
                variant="contained"
                startIcon={<PaymentIcon />}
                loading={isLoading || isSubmitting}
              >
                Payment
              </LoadingButton>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

export default CartDelivery;
