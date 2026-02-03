// src/socket/socket.js
import { io } from "socket.io-client";

let socket = null;

export const initializeSocket = (userId) => {
  if (!socket && userId) {
    socket = io(import.meta.env.VITE_DB_ORIGIN, {
      query: { userId },
    });
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
