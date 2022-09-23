import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { REACT_APP_LIMIT } from "../../app/config";
import { AppDispatch } from "../../app/store";
import { Review } from "../../interface/review";

interface ReviewInitialState {
  isLoading: boolean;
  error: Error | null;
  reviewsByProduct: {};
  totalReviewsByProduct: {};
  currentPageByProduct: [];
  reviewsById: {};
}

const initialState: ReviewInitialState = {
  isLoading: false,
  error: null,
  reviewsByProduct: {},
  totalReviewsByProduct: {},
  currentPageByProduct: [],
  reviewsById: {},
};

const slice = createSlice({
  name: "review",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    getReviewsSuccess(state, action) {
      state.isLoading = false;
      state.error = "";
      const { productId, results, totalResults, page } = action.payload;

      results.forEach((review) => (state.reviewsById[review._id] = review));
      state.reviewsByProduct[productId] = results
        .map((review) => review._id)
        .reverse();
      state.totalReviewsByProduct[productId] = totalResults;
      state.currentPageByProduct[productId] = page;
    },

    createReviewSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
    },

    sendReviewReactionSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      const { reviewId, reactions } = action.payload;

      state.reviewsById[reviewId].totalRatings = reactions.totalRatings;
      state.reviewsById[reviewId].rateAverage = reactions.rateAverage;
    },
  },
});

export default slice.reducer;

export const {
  startLoading,
  hasError,
  getReviewsSuccess,
  createReviewSuccess,
  sendReviewReactionSuccess,
} = slice.actions;

export const getReviews =
  ({ productId, page = 1, limit = REACT_APP_LIMIT }) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const params = {
        page: page,
        limit: limit,
      };

      const response = await apiService.get(`/review/public/${productId}`, {
        params,
      });
      if (response.success) {
        dispatch(
          getReviewsSuccess({
            ...response.data,
            productId,
            page,
          })
        );
      }
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export const createReview =
  ({ productId, comments }: Pick<Review, "productId" | "comments">) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const response = await apiService.post(`/review/me/create/${productId}`, {
        comments,
      });
      dispatch(createReviewSuccess(response.data));
      dispatch(getReviews({ productId }));
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export const sendReviewReaction =
  ({ reviewId, rate }: { reviewId: Pick<Review, "_id">; rate: number }) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const response = await apiService.post(`/reaction`, {
        refPaths: "Reviews",
        targetId: reviewId,
        rate,
      });
      dispatch(
        sendReviewReactionSuccess({
          reviewId,
          reactions: response.data,
        })
      );
    } catch (error) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };
