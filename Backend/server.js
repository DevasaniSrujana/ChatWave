import express from "express";
import { connectDB } from "./db/connection1.db.js";
import cors from "cors";
import { app, server } from "./socket/socket.js";

const DEFAULT_PORT = 5000;
const getPort = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_PORT;
};
let PORT = getPort(process.env.PORT);

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import cookieParser from "cookie-parser";

connectDB();

app.use(
  cors({
    origin: [process.env.CLIENT_URL, "http://localhost:5173"],
    credentials: true,
  }),
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cookieParser());
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

app.use(errorMiddleware);

app.get("/", (req, res, next) => {
  res.send("Hello World");
});
const startServer = (port) => {
  server.listen(port, () => {
    PORT = port;
    console.log(`Server listening at port ${PORT}`);
  });
};

server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    const nextPort = PORT + 1;
    startServer(nextPort);
    return;
  }
  process.exit(1);
});

startServer(PORT);
