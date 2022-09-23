import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Alert, Container, Link, Stack } from "@mui/material";
import React from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import * as Yup from "yup";
import { FormProvider, FTextField } from "../../components/form";
import useAuth from "../../hooks/useAuth";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function ResetPassword({ setCurrentTab }) {
  const location = useLocation();
  const auth = useAuth();

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    let { email } = data;

    try {
      await auth.resetPassword({ email });
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };

  return (
    <Container maxWidth="xs">
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={3}>
          {!!errors.responseError && (
            <Alert severity="error">{errors.responseError.message}</Alert>
          )}
          <Alert severity="info">
            Don’t have an account?{" "}
            <Link
              variant="subtitle2"
              sx={{ cursor: "pointer" }}
              onClick={() => {
                setCurrentTab("register");
              }}
            >
              Get started
            </Link>
          </Alert>

          <FTextField name="email" label="Email address" />
        </Stack>

        <LoadingButton
          sx={{ my: 2 }}
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Send
        </LoadingButton>
      </FormProvider>
    </Container>
  );
}

export default ResetPassword;
