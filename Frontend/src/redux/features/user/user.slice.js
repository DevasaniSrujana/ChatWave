import { createSlice } from "@reduxjs/toolkit";
import {
  getOtherUsersThunk,
  getProfileThunk,
  loginThunk,
  logoutThunk,
  registerThunk,
} from "./user.thunk.js";

const initialState = {
  isAuthenticated: false,
  screenLoading: true,
  buttonLoading: false,
  userProfile: null,
  otherUsers: null,
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")),
};
export const userSlice = createSlice({
  name: "userSlice",
  initialState,
  reducers: {
    setSelectedUser: (state, action) => {
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      state.selectedUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Login Thunk
    builder.addCase(loginThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(loginThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(loginThunk.rejected, (state) => {
      state.buttonLoading = false;
    });
    // Register Thunk
    builder.addCase(registerThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(registerThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData?.user;
      state.isAuthenticated = true;
      state.buttonLoading = false;
    });
    builder.addCase(registerThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // Logout Thunk
    builder.addCase(logoutThunk.pending, (state) => {
      state.buttonLoading = true;
    });
    builder.addCase(logoutThunk.fulfilled, (state) => {
      state.socket?.disconnect();
      state.userProfile = null;
      state.selectedUser = null;
      state.otherUsers = null;
      state.isAuthenticated = false;
      state.buttonLoading = false;
      localStorage.clear();
    });
    builder.addCase(logoutThunk.rejected, (state) => {
      state.buttonLoading = false;
    });

    // Profile Thunk
    builder.addCase(getProfileThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getProfileThunk.fulfilled, (state, action) => {
      state.userProfile = action.payload?.responseData;
      state.isAuthenticated = true;
      state.screenLoading = false;
    });

    builder.addCase(getProfileThunk.rejected, (state) => {
      state.screenLoading = false;
    });

    // Other Users Thunk
    builder.addCase(getOtherUsersThunk.pending, (state) => {
      state.screenLoading = true;
    });
    builder.addCase(getOtherUsersThunk.fulfilled, (state, action) => {
      state.otherUsers = action.payload?.responseData;
      state.isAuthenticated = true;
      state.screenLoading = false;
    });

    builder.addCase(getOtherUsersThunk.rejected, (state) => {
      state.screenLoading = false;
    });
  },
});
export const { setSelectedUser } = userSlice.actions;
export default userSlice.reducer;
