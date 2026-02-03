import { createSlice } from "@reduxjs/toolkit";
import { getMessageThunk, sendMessageThunk } from "./message.thunk";
const initialState = {
  buttonLoading: false,
  messages: [],
};
export const messageSlice = createSlice({
  name: "messageSlice",
  initialState,
  reducers: {
    addIncomingMessage: (state, action) => {
      if (!action.payload) return;
      const incomingId = action.payload?._id;
      if (
        incomingId &&
        state.messages?.some((m) => m && typeof m === "object" && m._id === incomingId)
      ) {
        return;
      }
      state.messages = [...state.messages, action.payload];
    },
  },
  extraReducers: (builder) => {
    builder.addCase(sendMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(sendMessageThunk.fulfilled, (state, action) => {
      const incoming = action.payload;
      if (!incoming) {
        state.buttonLoading = false;
        return;
      }

      const incomingId = incoming?._id;
      if (
        incomingId &&
        state.messages?.some((m) => m && typeof m === "object" && m._id === incomingId)
      ) {
        state.buttonLoading = false;
        return;
      }
      state.messages = [...state.messages, incoming];
      state.buttonLoading = false;
    });
    builder.addCase(sendMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    builder.addCase(getMessageThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(getMessageThunk.fulfilled, (state, action) => {
      state.messages = action.payload;
      state.buttonLoading = false;
    });
    builder.addCase(getMessageThunk.rejected, (state) => {
      state.buttonLoading = false;
    });
  },
});

export const { addIncomingMessage } = messageSlice.actions;
export default messageSlice.reducer;
