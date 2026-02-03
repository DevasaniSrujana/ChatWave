import dotenv from "dotenv";
dotenv.config();
import cors from "cors";
import cookieParser from "cookie-parser";

import { connectDB } from "./db/connection1.db.js";
import { app, server } from "./socket/socket.js";

import userRoute from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";

const DEFAULT_PORT = 5000;
const getPort = (value) => {
  const n = Number(value);
  return Number.isFinite(n) && n > 0 ? n : DEFAULT_PORT;
};
let PORT = getPort(process.env.PORT);

connectDB();

// ✅ CORS middleware
const allowedOrigins = [
  process.env.CLIENT_URL, // deployed frontend
  "http://localhost:5173", // local frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman, curl, etc
      if (allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error(`CORS policy: Origin ${origin} not allowed`));
    },
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static("uploads"));

// API routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/message", messageRoute);

// error handling
app.use(errorMiddleware);

// test route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Start server
const startServer = (port) => {
  server.listen(port, () => {
    PORT = port;
    console.log(`Server listening at port ${PORT}`);
  });
};

// handle port in use
server.on("error", (err) => {
  if (err?.code === "EADDRINUSE") {
    startServer(PORT + 1);
    return;
  }
  process.exit(1);
});

startServer(PORT);
