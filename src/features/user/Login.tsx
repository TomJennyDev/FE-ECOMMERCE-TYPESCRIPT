import { yupResolver } from "@hookform/resolvers/yup";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Container,
  Divider,
  IconButton,
  InputAdornment,
  Link,
  Stack,
} from "@mui/material";
import { Box } from "@mui/system";
import React, { useState } from "react";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import { GoogleLogin } from "react-google-login";
import { useForm } from "react-hook-form";
import { FaFacebookF, FaGoogle } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { FACEBOOK_APP_ID, GOOGLE_CLIENT_ID } from "../../app/config";
import { FCheckbox, FormProvider, FTextField } from "../../components/form";
import useAuth from "../../hooks/useAuth";

const LoginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const defaultValues = {
  email: "",
  password: "",
  remember: true,
};

function Login({ setCurrentTab }) {
  const navigate = useNavigate();
  const location = useLocation();
  const auth = useAuth();
  const from = location.state?.from?.pathname || "/";

  const [showPassword, setShowPassword] = useState(false);

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
    let { email, password } = data;

    try {
      await auth.login({ email, password }, () => {
        navigate(from, { replace: true });
      });
    } catch (error) {
      reset();
      setError("responseError", error);
    }
  };
  const loginWithFacebook = async (response) => {
    await auth.loginFacebook(response, () => {
      navigate(from, { replace: true });
    });
  };

  const loginWithGoogle = async (response) => {
    await auth.loginGoogle(response, () => {
      navigate(from, { replace: true });
    });
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

          <FTextField
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ my: 2 }}
        >
          <FCheckbox name="remember" label="Remember me" />
          <Link
            variant="subtitle2"
            sx={{ cursor: "pointer" }}
            onClick={() => {
              setCurrentTab("recovery");
            }}
          >
            Forgot password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
        >
          Login
        </LoadingButton>
        <Divider textAlign="center" sx={{ m: 2 }}>
          or
        </Divider>
        <Stack display="flex" flexDirection="row">
          <FacebookLogin
            appId={FACEBOOK_APP_ID}
            callback={loginWithFacebook}
            onFailure={(err) => {
              console.log("FB LOGIN ERROR:", err);
            }}
            render={(renderProps) => (
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                sx={{ backgroundColor: "#4267B2", fontSize: "1.2rem" }}
                onClick={renderProps.onClick}
              >
                <FaFacebookF />
              </LoadingButton>
            )}
          />
          <Box sx={{ mx: 1 }} />
          <GoogleLogin
            clientId={GOOGLE_CLIENT_ID}
            buttonText="Login with Google"
            onSuccess={loginWithGoogle}
            onFailure={(err) => {
              console.log("GOOGLE LOGIN ERROR:", err);
            }}
            render={(renderProps) => (
              <LoadingButton
                fullWidth
                size="large"
                variant="contained"
                sx={{
                  borderColor: "#4285F4",
                  backgroundColor: "#4285F4",
                  fontSize: "1.2rem",
                  py: 1.2,
                }}
                onClick={renderProps.onClick}
                disabled={renderProps.disabled}
              >
                <FaGoogle />
              </LoadingButton>
            )}
            cookiePolicy={"single_host_origin"}
          />
        </Stack>
      </FormProvider>
    </Container>
  );
}

export default Login;
