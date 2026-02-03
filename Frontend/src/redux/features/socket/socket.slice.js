import { createSlice } from "@reduxjs/toolkit";
import { io } from "socket.io-client";

const initialState = {
  socket: null,
  onlineUsers: null,
};
export const socketSlice = createSlice({
  name: "socketSlice",
  initialState,
  reducers: {
    initializeSocket: (state, action) => {
      if (!action.payload) return; // no user ID, don’t connect
      if (state.socket) return; // socket already exists

      const socket = io(import.meta.env.VITE_DB_ORIGIN, {
        query: { userId: action.payload },
      });

      socket.on("connect", () => {
      });
    },

    checkOnlineUsers: (state, action) => {
      state.onlineUsers = action.payload;
    },
    disconnectSocket: (state) => {
      if (state.socket) {
        state.socket.disconnect();
        state.socket = null;
      }
      state.onlineUsers = [];
    },
  },
});
export const { initializeSocket, checkOnlineUsers, disconnectSocket } =
  socketSlice.actions;
export default socketSlice.reducer;
