import { yupResolver } from "@hookform/resolvers/yup";
import ClearAllIcon from "@mui/icons-material/ClearAll";
import GradingIcon from "@mui/icons-material/Grading";
import PaymentsIcon from "@mui/icons-material/Payments";
import {
  Button,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { useAppDispatch, useAppSelector } from "../../app/hook";
import {
  FormProvider,
  FRadioGroup,
  FSelect,
  FTextField,
} from "../../components/form";
import {
  CreditCard,
  KeyPaymentMethod,
  ListCardIssuer,
  PaymentMethod,
} from "../../interface";
import { TitleStyle } from "../../theme/customizations/TitleStyle";
import CartSideBar from "./CartSideBar";
import { setActiveStep, updateCart } from "./cartSlice";

const PaymentSchema = yup.object().shape({
  method: yup.string(),
  cardHolder: yup.string().max(255).required("card Holder is required"),
  cardNumber: yup
    .string()
    .max(16, "Not a valid card Number")
    // Visa, MasterCard, American Express, Diners Club, Discover, and JCB cards
    .matches(
      /^(?:4[0-9]{12}(?:[0-9]{3})?|[25][1-7][0-9]{14}|6(?:011|5[0-9][0-9])[0-9]{12}|3[47][0-9]{13}|3(?:0[0-5]|[68][0-9])[0-9]{11}|(?:2131|1800|35\d{3})\d{11})$/,
      "Not a valid card Number"
    )
    .required("Card Number is required"),
  expDate: yup
    .string()
    .max(5, "Not a valid expiration date. Example: MM/YY")
    .matches(
      /^(0[1-9]|1[0-2])\/?([0-9]{4}|[0-9]{2})$/,
      "Not a valid expiration date. Example: MM/YY"
    )
    .required("expiry Month and Year is required"),
  cardCVV: yup
    .string()
    .max(4, "Not a valid card CVV")
    .matches(
      /^[0-9]{3,4}$/,
      // ^: Start of string anchor
      // [0-9]: Digit between 0 and 9 (you could also use \d here)
      // {3,4}: A quantifier meaning between 3 and 4.
      // $: End of string anchor
      "Not a valid card CVV"
    )
    .required("card CVV is required"),
  cardIssuer: yup.string().required("card Issuer is required"),
});

const PaymentCreditSchema = yup.object().shape({
  method: yup.string(),
});

export const methodPayment: KeyPaymentMethod[] = [
  "credit",
  "cash",
  "bankOnline",
];

export const labelMethodPayment: PaymentMethod = {
  credit: "Credit Cards",
  cash: "Cash",
  bankOnline: "Bank Online",
};

export const listCartIssuer: ListCardIssuer[] = [
  "Visa",
  "MasterCard",
  "American Express",
  "Diners Club",
  "Discover",
  "JCB",
];

interface CartPaymentForm extends CreditCard {
  method: KeyPaymentMethod;
}

const defaultData: CartPaymentForm = {
  method: "credit",
  cardHolder: "",
  cardNumber: "",
  expDate: "",
  cardCVV: "",
  cardIssuer: "American Express",
};

function CartPayment() {
  const dispatch = useAppDispatch();
  const { cart, isLoading, activeStep } = useAppSelector((state) => state.cart);
  const [method, setMethod] = useState(cart.payment?.method);

  let creditCards = cart.payment?.creditCards;

  const payment = { method, ...creditCards };

  const defaultValues = payment.method ? payment : defaultData;

  const methods = useForm<CartPaymentForm>({
    defaultValues,
    resolver: yupResolver(
      method === "credit" ? PaymentSchema : PaymentCreditSchema
    ),
    mode: "onChange",
  });
  const { handleSubmit, reset, watch } = methods;

  const methodValues = watch("method");

  const onSubmit = (data: Partial<CartPaymentForm>) => {
    const { method, ...restData } = data;

    const creditCards = restData;

    let payment = { method, total: cart.payment?.total };

    payment = creditCards.cardNumber ? { ...payment, creditCards } : payment;

    const cartUpdate = {
      ...cart,
      payment,
    };

    dispatch(updateCart(cartUpdate));
    dispatch(setActiveStep(activeStep + 1));
  };

  useEffect(() => {
    setMethod(methodValues);
  }, [methodValues]);

  return (
    <Container>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={8}>
            <Box component={Paper} sx={{ width: 1, p: 2, pb: 4 }}>
              <Stack direction="row" alignItems="center" sx={{ pb: 2 }}>
                <TitleStyle>
                  <PaymentsIcon sx={{ width: "35px", height: "35px" }} />
                  <Typography variant="h6" textAlign="left" sx={{ pl: 1 }}>
                    Payment
                  </Typography>
                </TitleStyle>
              </Stack>

              <Stack spacing={3}>
                <FRadioGroup
                  name="method"
                  options={methodPayment}
                  getOptionLabel={labelMethodPayment}
                />
                {methodValues === "credit" && (
                  <>
                    <Stack direction="row" spacing={3}>
                      <FTextField name="cardHolder" label="Card Holder" />
                    </Stack>
                    <Stack direction="row" spacing={3}>
                      <FTextField name="cardNumber" label="Card Number" />
                      <FTextField name="expDate" label="Exp (MM/YY)" />
                    </Stack>
                    <Stack direction="row" spacing={3}>
                      <FTextField name="cardCVV" label="CVV" />

                      <FSelect
                        name="cardIssuer"
                        label="Card Issuer"
                        variant="standard"
                      >
                        {listCartIssuer.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </FSelect>
                    </Stack>
                    <Stack
                      direction="row"
                      justifyContent="flex-end"
                      spacing={3}
                      sx={{ p: 1 }}
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
                  </>
                )}
              </Stack>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <CartSideBar />
            <Stack sx={{ py: 3 }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<GradingIcon />}
              >
                Summary
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}

export default CartPayment;
