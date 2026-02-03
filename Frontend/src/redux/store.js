import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/user/user.slice.js";
import messageReducer from "./features/message/message.slice.js";
import socketReducer from "./features/socket/socket.slice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    message: messageReducer,
    socket: socketReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredPaths: ["socket.socket"],
      },
    }),
});
