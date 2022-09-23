import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import apiService from "../../app/apiService";
import { AppDispatch } from "../../app/store";
import { User } from "../../interface/user";
import { cloudinaryUpload } from "../../utils/cloudinary";
import { RootState } from "./../../app/store";

interface UserInitialState {
  isLoading: boolean;
  error: string | null;
  updatedProfile: null;
  selectedUser: null;
  users: User[];
  totalPage: number;
  totalUsers: number;
  currentPage: number;
  filters: {};
}

const initialState: UserInitialState = {
  isLoading: false,
  error: null,
  updatedProfile: null,
  selectedUser: null,
  users: [],
  totalPage: 0,
  totalUsers: 0,
  currentPage: 1,
  filters: {},
};

const slice = createSlice({
  name: "user",
  initialState,
  reducers: {
    startLoading(state) {
      state.isLoading = true;
    },

    hasError(state, action) {
      state.isLoading = false;
      state.error = action.payload;
    },

    updateUserProfileSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      const updatedUser = action.payload;
      state.updatedProfile = updatedUser;
    },
    getUserSuccess(state, action) {
      state.isLoading = false;
      state.error = null;

      state.selectedUser = action.payload;
    },
    deactiveUserSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    updateUserSuccess(state) {
      state.isLoading = false;
      state.error = null;
    },
    getUserListSuccess(state, action) {
      state.isLoading = false;
      state.error = null;
      state.totalUsers = action.payload.totalResults;
      state.users = action.payload.results;
      state.currentPage = action.payload.page;
    },
    handleChangeUserFilters(state, action) {
      state.isLoading = false;
      state.error = null;
      state.filters = { ...state.filters, ...action.payload };
    },
    handleClearUserFilters(state) {
      state.isLoading = false;
      state.error = null;
      state.filters = {};
    },
  },
});

export default slice.reducer;
export const {
  startLoading,
  hasError,
  updateUserProfileSuccess,
  getUserSuccess,
  getUserListSuccess,
  deactiveUserSuccess,
  updateUserSuccess,
  handleChangeUserFilters,
  handleClearUserFilters,
} = slice.actions;

export const updateUserProfile =
  ({
    name,
    email,
    password,
    phone,
    address,
    avatarUrl,
    role,
    creditCards,
  }: Partial<User>) =>
  async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const data = {
        name,
        email,
        password,
        phone,
        address,
        avatarUrl,
        role,
        creditCards,
      };
      if (!password) delete data.password;
      if (avatarUrl instanceof File) {
        const imageUrl = await cloudinaryUpload(avatarUrl);
        data.avatarUrl = imageUrl;
      }
      const response = await apiService.put(`/users/me/update`, { ...data });
      dispatch(updateUserProfileSuccess(response.data));
      dispatch(getCurrentUserProfile());
      toast.success("Update Profile successfully");
    } catch (error: any) {
      dispatch(hasError(error.message));
      toast.error(error.message);
    }
  };

export const getUser = (id: string) => async (dispatch: AppDispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiService.get(`/users/${id}`);
    dispatch(getUserSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
    toast.error(error.message);
  }
};

export const getCurrentUserProfile = () => async (dispatch: AppDispatch) => {
  dispatch(startLoading());
  try {
    const response = await apiService.get("/users/me");
    dispatch(updateUserProfileSuccess(response.data));
  } catch (error) {
    dispatch(hasError(error));
  }
};

export const getUserList =
  (filters: {}) => async (dispatch: AppDispatch, getState: () => RootState) => {
    dispatch(startLoading());
    try {
      filters = { ...filters, ...getState().user.filters };

      const response = await apiService.get("/users", { params: filters });
      dispatch(getUserListSuccess(response.data));
    } catch (error) {
      dispatch(hasError(error));
    }
  };

export const deactiveUser = (id, filters) => async (dispatch: AppDispatch) => {
  dispatch(startLoading());
  try {
    const repsonse = await apiService.delete(`/users/delete/${id}`);
    if (repsonse) {
      dispatch(deactiveUserSuccess());
      dispatch(getUserList(filters));
    }
    toast.success("You are deactive user sucessfully!");
  } catch (error) {
    dispatch(hasError(error));
    toast.error(error.message);
  }
};

export const updateUser =
  (id, updateContent, filters) => async (dispatch: AppDispatch) => {
    dispatch(startLoading());
    try {
      const repsonse = await apiService.put(`/users/update/${id}`, {
        ...updateContent,
      });
      if (repsonse) {
        dispatch(updateUserSuccess());

        dispatch(getUserList(filters));

        toast.success("You are updated user sucessfully!");
      }
    } catch (error) {
      dispatch(hasError(error));
      toast.error(error.message);
    }
  };
