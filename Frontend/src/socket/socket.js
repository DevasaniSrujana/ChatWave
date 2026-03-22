// src/socket/socket.js
import { io } from "socket.io-client";
import { getServerOrigin } from "../components/utilities/serverOrigin.js";

let socket = null;
let lastConnectedUserId = null;

export const initializeSocket = (userId) => {
  const origin = getServerOrigin();
  if (!origin) {
    if (import.meta.env.PROD) {
      console.error(
        "ChatWave: Set VITE_API_URL (or VITE_DB_ORIGIN) on Vercel so Socket.IO can reach your API.",
      );
    }
    return null;
  }

  const sid = userId != null ? String(userId) : "";
  if (!sid) return null;

  if (socket && lastConnectedUserId !== sid) {
    socket.disconnect();
    socket = null;
  }

  if (!socket) {
    socket = io(origin, {
      path: "/socket.io/",
      query: { userId: sid },
      transports: ["polling", "websocket"],
      withCredentials: true,
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 8000,
      timeout: 20000,
    });
    lastConnectedUserId = sid;
  }
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
    lastConnectedUserId = null;
  }
};
