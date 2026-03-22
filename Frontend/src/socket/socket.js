// src/socket/socket.js
import { io } from "socket.io-client";
import { getServerOrigin } from "../components/utilities/serverOrigin.js";

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket && userId) {
    const origin = getServerOrigin();
    if (origin) {
      socket = io(origin, {
        query: { userId: String(userId) },
        transports: ["websocket", "polling"],
        withCredentials: true,
      });
    }
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
