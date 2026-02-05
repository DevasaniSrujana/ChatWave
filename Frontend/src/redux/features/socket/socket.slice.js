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
      if (!action.payload) return;
      if (state.socket) return;

      const socket = io(import.meta.env.VITE_API_URL, {
        query: { userId: action.payload },
        transports: ["websocket"],
        withCredentials: true,
      });

      socket.on("connect", () => {
        console.log("Socket connected:", socket.id);
      });

      socket.on("onlineUsers", (users) => {
        state.onlineUsers = users;
      });

      state.socket = socket; // ✅ STORE SOCKET
    },
  },
});
export const { initializeSocket, checkOnlineUsers, disconnectSocket } =
  socketSlice.actions;
export default socketSlice.reducer;
