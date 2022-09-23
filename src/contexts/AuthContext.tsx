import { createContext, ReactNode, useEffect, useReducer } from "react";
import { toast } from "react-toastify";
import apiService from "../app/apiService";
import { useAppDispatch, useAppSelector } from "../app/hook";
import { getTotalProducts } from "../features/cart/cartSlice";
import { User } from "../interface/user";
import { isValidToken } from "../utils/jwt";

interface AuthInitialState {
  isInitialized: boolean;
  isAuthenticated: boolean;
  user: User | null;
}

type Login = (
  { email, password }: Pick<User, "email" | "password">,
  callback: () => void
) => Promise<void>;

type LoginFacebook = (res: any, callback: () => void) => Promise<void>;

type LoginGoogle = (res: any, callback: () => void) => Promise<void>;

type Register = (
  { name, email, password }: Pick<User, "name" | "email" | "password">,
  callback: () => void
) => Promise<void>;

type Logout = (callback: () => void) => Promise<void>;

type ResetPassword = (
  { email }: { email: string },
  callback: () => void
) => Promise<void>;

interface IAuthContext extends AuthInitialState {
  login: Login;
  loginFacebook: LoginFacebook;
  loginGoogle: LoginGoogle;
  register: Register;
  logout: Logout;
  resetPassword: ResetPassword;
}

interface AuthAction {
  type:
    | "AUTH.INITIALIZE"
    | "AUTH.LOGIN_SUCCESS"
    | "AUTH.REGISTER_SUCCESS"
    | "AUTH.LOGOUT"
    | "AUTH.UPDATE_PROFILE";
  payload: any;
}

const initialState: AuthInitialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
const LOGOUT = "AUTH.LOGOUT";
const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";

const reducer = (state: AuthInitialState, action: AuthAction) => {
  switch (action.type) {
    case INITIALIZE:
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isInitialized: true,
        isAuthenticated,
        user,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case UPDATE_PROFILE:
      const {
        name,
        email,
        password,
        isDeleted,
        phone,
        address,
        avatarUrl,
        role,
        creditCards,
      } = action.payload;
      return {
        ...state,
        user: {
          ...state.user,
          name,
          email,
          password,
          isDeleted,
          phone,
          address,
          avatarUrl,
          role,
          creditCards,
        },
      };
    default:
      return state;
  }
};

export const setSession = async (accessToken: string | null) => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService.defaults.headers.common.Authorization;
  }
};

const AuthContext = createContext<Partial<IAuthContext>>({ ...initialState });

interface AuthProviderProps {
  children?: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps) {
  const dispatchCart = useAppDispatch();

  const [state, dispatch] = useReducer(reducer, initialState);

  const updatedProfile = useAppSelector((state) => state.user?.updatedProfile);

  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          await setSession(accessToken);

          const response = await apiService.get("/users/me");
          const user = response.data;

          dispatchCart(getTotalProducts(user?.cartId?.totalItem));

          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user },
          });
        } else {
          setSession(null);

          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, user: null },
          });
        }
      } catch (err) {
        console.error(err);

        setSession(null);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, [dispatchCart]);

  useEffect(() => {
    if (updatedProfile)
      dispatch({ type: UPDATE_PROFILE, payload: updatedProfile });
  }, [updatedProfile]);

  const login: Login = async ({ email, password }, callback) => {
    const response = await apiService.post("/auth/login", { email, password });

    const { user, accessToken } = response.data;

    setSession(accessToken);

    dispatchCart(getTotalProducts(user?.cartId?.totalItem));

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user },
    });
    callback();
  };

  const register = async (
    { name, email, password }: Pick<User, "name" | "email" | "password">,
    callback: () => void
  ) => {
    const response = await apiService.post("/users", {
      name,
      email,
      password,
    });

    const { user, accessToken } = response.data;
    setSession(accessToken);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { user },
    });

    callback();
  };

  const logout: Logout = async (callback) => {
    setSession(null);
    dispatch({
      type: LOGOUT,
      payload: undefined,
    });
    callback();
  };

  const resetPassword: ResetPassword = async ({ email }, callback) => {
    const response = await apiService.post("/auth/resetpassword", { email });
    if (response) toast.success("Please check your email!");
    callback();
  };

  const loginFacebook: LoginFacebook = async (res, callback) => {
    const response = await apiService.post("/auth/facebook", {
      access_token: res.accessToken,
    });

    const { user, accessToken } = response.data;

    setSession(accessToken);
    dispatchCart(getTotalProducts(user?.cartId?.totalItem));

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user },
    });

    callback();
  };
  const loginGoogle: LoginGoogle = async (res, callback) => {
    const response = await apiService.post("/auth/google", {
      access_token: res.accessToken,
    });
    const { user, accessToken } = response.data;

    setSession(accessToken);
    dispatchCart(getTotalProducts(user?.cartId?.totalItem));

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user },
    });

    callback();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        loginFacebook,
        loginGoogle,
        register,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
export { AuthContext, AuthProvider };
