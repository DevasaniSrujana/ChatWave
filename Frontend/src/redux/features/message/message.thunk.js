import { createAsyncThunk } from "@reduxjs/toolkit";
import { axiosInstance } from "../../../components/utilities/axiosInstance.js";

export const sendMessageThunk = createAsyncThunk(
  "message/send",
  async ({ receiverId, message }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(`/message/send/${receiverId}`, {
        message,
      });
      return response.data;
    } catch (error) {
      const msg = error.response?.data?.message || "Send failed";
      return rejectWithValue(msg);
    }
  },
);

export const getMessageThunk = createAsyncThunk(
  "message/get",
  async ({ receiverId }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get(
        `/message/get-message/${receiverId}`,
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message;
      return rejectWithValue(message);
    }
  },
);
