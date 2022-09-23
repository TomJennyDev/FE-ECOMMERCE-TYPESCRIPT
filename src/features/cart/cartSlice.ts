import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import CartApi from "../../api/cartApi";
import { AppDispatch } from "../../app/store";
import { Cart, CartProduct } from "../../interface";

interface CartInitialState {
  isLoading: boolean;
  error: Error | null;
  cart: Partial<Cart>;
  products: CartProduct[];
  totalProduct: number;
  totalPage: number;
  activeStep: number;
}

const initialState: CartInitialState = {
  isLoading: false,
  error: null,
  cart: {},
  products: [],
  totalProduct: 0,
  totalPage: 1,
  activeStep: 0,
};

const slice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    setActiveStep(state, action) {
      state.activeStep = action.payload;
    },
    getCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.cart = action.payload.cart;
      state.products = action.payload.products.results;
      state.totalPage = action.payload.products.totalPages;
    },
    updateCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.cart = action.payload;
    },
    getTotalProducts(state, action) {
      state.isLoading = false;
      state.error = null;
      state.totalProduct = action.payload;
    },
    clearTotalProducts(state) {
      state.totalProduct = 0;
    },
    updateProductToCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.totalProduct = action.payload.totalProduct;

      state.products = state.products.map((cartProduct) => {
        if (cartProduct.productId._id === action.payload.productId) {
          let quantity = cartProduct.quantity;
          action.payload.action ? (quantity += 1) : (quantity -= 1);
          return { ...cartProduct, quantity };
        }
        return cartProduct;
      });
    },

    removeProductCartSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.totalProduct = action.payload.totalProduct;

      const { products } = action.payload;
      state.products = state.products.filter(
        (product) => !products.includes(product.productId._id)
      );
    },
  },
});

export const {
  startLoading,
  getCartSuccess,
  updateCartSuccess,
  getTotalProducts,
  updateProductToCartSuccess,
  removeProductCartSuccess,
  clearTotalProducts,
  hasError,
  setActiveStep,
} = slice.actions;

export const getCart = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading());
  try {
    const response = await CartApi.getCartAll();

    if (response.success) {
      dispatch(getCartSuccess(response.data));
    }
  } catch (error) {
    dispatch(hasError(error));
    toast.error((error as Error).message);
  }
};

export const updateCart =
  (cart: Partial<Cart>) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const response = await CartApi.updateCart(cart);
      if (response.success) {
        dispatch(updateCartSuccess(response.data));
      }
    } catch (error) {
      dispatch(hasError(error));
      toast.error((error as Error).message);
    }
  };

export const updateQuantityProductCart =
  ({ productId, action }: { productId: string; action: boolean }) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const response = await CartApi.updateQuantityProductCart(
        productId,
        action
      );

      if (response.success) {
        dispatch(
          updateProductToCartSuccess({
            productId,
            action,
            totalProduct: response.data,
          })
        );
      }
    } catch (error) {
      dispatch(hasError(error));
      toast.error((error as Error).message);
    }
  };

export const removeProductCart =
  ({ productId }: { productId: string[] }) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());

    try {
      const response = await CartApi.removeProductCart(productId);
      if (response.success) {
        dispatch(
          removeProductCartSuccess({
            products: productId,
            totalProduct: response.data,
          })
        );
      }
    } catch (error) {
      dispatch(hasError(error));
      toast.error((error as Error).message);
    }
  };

export default slice.reducer;
