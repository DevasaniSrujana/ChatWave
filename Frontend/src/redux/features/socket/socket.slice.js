import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  socket: null,
  onlineUsers: null,
};

export const socketSlice = createSlice({
  name: "socketSlice",
  initialState,
  reducers: {
    checkOnlineUsers: (state, action) => {
      const payload = action.payload;
      state.onlineUsers = Array.isArray(payload)
        ? payload.map((id) => String(id))
        : null;
    },
    disconnectSocket: (state) => {
      state.socket = null;
      state.onlineUsers = null;
    },
  },
});

export const { checkOnlineUsers, disconnectSocket } = socketSlice.actions;
export default socketSlice.reducer;
