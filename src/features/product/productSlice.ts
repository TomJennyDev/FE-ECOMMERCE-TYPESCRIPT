import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { AppDispatch, RootState } from "../../app/store";
import { Product } from "../interface";


interface  initialStateProduct {
  isLoading: boolean,
  error: Error |null,
  products: Product[],
  product: Product,
  totalPage: number,
  currentPage: number,
  filters: {
    sortBy: "",
  },
}


const initialState  :initialStateProduct= {
  isLoading: false,
  error:  null,
  products: Product[],
  product: {},
  totalPage: 1,
  currentPage: 1,
  filters: {
    sortBy: "",
  },
};

const slice = createSlice({
  name: "product",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getAllProductsSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.products = action.payload.results;
      state.totalPage = action.payload.totalPages;
      state.currentPage = action.payload.page;
    },
    getProductSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.product = action.payload;
    },
    handleClearProduct(state) {
      state.product = {};
    },
    handleChangeFilters(state, action) {
      state.isLoading = false;
      state.error = null;
      state.filters = { ...state.filters, ...action.payload };
    },
    handleClearFilters(state) {
      state.isLoading = false;
      state.error = null;
      state.filters = {};
    },
    sendProductReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { productId, reactions } = action.payload;
      const { totalRatings, rateAverage } = reactions;
      state.products.forEach((product) => {
        if (product._id === productId) {
          product.totalRatings = totalRatings;
          product.rateAverage = rateAverage;
        }
      });
    },
  },
});

export const {
  startLoading,
  handleChangeFilters,
  handleClearFilters,
  getAllProductsSuccess,
  getProductSuccess,
  sendProductReactionSuccess,
  handleClearProduct,

  hasError,
} = slice.actions;

export const getAllProducts =
  (filters: {}) => async (dispatch: AppDispatch, getState: () => RootState ) => {
    dispatch(startLoading());
    try {
      filters = { ...filters, ...getState().product.filters };

      const response = await apiService.get("/product/public", {
        params: filters,
      });
      if (response.success) {
        dispatch(getAllProductsSuccess(response.data));
      }
    } catch (error) {
      dispatch(hasError(error));
      toast.error(error.message);
    }
  };

export const getProduct = (id :string, filters: { page: number; limit: number; id: string | undefined; } | undefined) => async (dispatch: AppDispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiService.get(`/product/public/${id}`);

    await dispatch(getAllProducts(filters));

    if (response.success) {
      dispatch(getProductSuccess(response.data));
    }
  } catch (error) {
    dispatch(hasError(error));
    toast.error(error.message);
  }
};

export const sendReviewReaction =
  ({ productId, rate }: { productId : string, rate: string }) =>
  async (dispatch: AppDispatch) => {
    try {
      const response = await apiService.post(`/reaction`, {
        refPaths: "Products",
        targetId: productId,
        rate,
      });
      dispatch(
        sendProductReactionSuccess({
          productId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export default slice.reducer;
