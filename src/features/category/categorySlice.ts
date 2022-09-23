import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import categoryApi from "../../api/categoryApi";
import { AppDispatch } from "../../app/store";
import { Category } from "../../interface";

interface CategoryInitialState {
  isLoading: boolean;
  error: Error | null;
  categories: Category[];
  subCategories?: Category[];
}

const initialState: CategoryInitialState = {
  isLoading: false,
  error: null,
  categories: [],
  subCategories: [],
};

const slice = createSlice({
  name: "category",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },
    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },
    getAllCategoriesSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.categories = action.payload;
    },
    getSubCategories(state, action) {
      const categories = state.categories;
      const subCategories = categories?.find(
        (cate) => cate._id === action.payload
      );

      state!.subCategories = subCategories ? subCategories.children : [];
    },
  },
});

export const {
  getSubCategories,
  hasError,
  getAllCategoriesSuccess,
  startLoading,
} = slice.actions;

export const getAllCategories = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading());
  try {
    const response = await categoryApi.getCategoryAll();

    dispatch(getAllCategoriesSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    toast.error((error as Error).message);
  }
};

export default slice.reducer;
