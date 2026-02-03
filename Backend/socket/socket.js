import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";

const FRONTEND_URLS = [process.env.CLIENT_URL, "http://localhost:5173"];

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow non-browser requests
      if (FRONTEND_URLS.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("CORS not allowed"));
      }
    },
    credentials: true,
  },
});

const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = String(socket.handshake.query.userId || "");
  if (!userId || userId === "undefined") {
    socket.disconnect();
    return;
  }

  if (!userSocketMap[userId]) userSocketMap[userId] = new Set();
  userSocketMap[userId].add(socket.id);

  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    userSocketMap[userId].delete(socket.id);
    if (userSocketMap[userId].size === 0) delete userSocketMap[userId];
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});

const getId = (userId) => userSocketMap[String(userId)];

export { io, app, server, getId };
