import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
  },
});
const userSocketMap = {};

io.on("connection", (socket) => {
  const userId = String(socket.handshake.query.userId || "");
  if (!userId || userId === "undefined") {
    socket.disconnect();
    return;
  }
  if (!userSocketMap[userId]) {
    userSocketMap[userId] = new Set();
  }

  userSocketMap[userId].add(socket.id);
  io.emit("onlineUsers", Object.keys(userSocketMap));

  socket.on("disconnect", () => {
    userSocketMap[userId].delete(socket.id);

    if (userSocketMap[userId].size === 0) {
      delete userSocketMap[userId];
    }
    io.emit("onlineUsers", Object.keys(userSocketMap));
  });
});
const getId = (userId) => {
  return userSocketMap[String(userId)];
};

export { io, app, server, getId };
