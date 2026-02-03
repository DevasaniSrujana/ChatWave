import { createAsyncThunk } from "@reduxjs/toolkit";

import { axiosInstance } from "../../../components/utilities/axiosInstance.js";
import { toast } from "react-hot-toast";

export const loginThunk = createAsyncThunk(
  "users/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/login", data);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const registerThunk = createAsyncThunk(
  "users/register",
  async (data, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      formData.append("fullname", data.fullname);
      formData.append("username", data.username);
      formData.append("password", data.password);
      formData.append("gender", data.gender);

      if (data.photo) {
        formData.append("photo", data.photo);
      }

      const response = await axiosInstance.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      return response.data;
    } catch (error) {
      toast.error(error.response?.data?.message);
      return rejectWithValue(error.response?.data);
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "users/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post("/user/logout");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  },
);

export const getProfileThunk = createAsyncThunk(
  "users/get-profile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-profile");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      return rejectWithValue(message);
    }
  },
);

export const getOtherUsersThunk = createAsyncThunk(
  "users/get-other-users",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get("/user/get-other-users");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      return rejectWithValue(message);
    }
  },
);
