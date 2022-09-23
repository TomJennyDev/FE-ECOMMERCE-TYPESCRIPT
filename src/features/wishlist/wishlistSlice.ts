import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoading: false,
  error: null,
  wishlist: [],
};

const slice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    addProductWishlist(state, action) {
      state.wishlist.push(action.payload);
    },

    removeProductWishlist(state, action) {
      state.wishlist = state.wishlist.filter(
        (productId) => productId === action.payload
      );
    },
  },
});

export const { removeProductWishlist, addProductWishlist } = slice.actions;
export default slice.reducer;
