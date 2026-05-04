/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Fixed to match your API response exactly
export type TUser = {
  id: number;
  name: string;
  email: string;
  role: string;
  is_email_verified: boolean;
  created_at: string;
};

type TAuthState = {
  userToggle: boolean;
  user: TUser | null;
  token: string | null;
  profileLoading?: boolean;
};

const initialState: TAuthState = {
  userToggle: false,
  user: null,
  token: null,
  profileLoading: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    userTrack: (state) => {
      state.userToggle = !state.userToggle;
    },

    // Updated to accept the specific keys used in your login/profile responses
    setUser: (state, action: PayloadAction<{ user: TUser; token: string }>) => {
      const { user, token } = action.payload;
      state.user = user;
      state.token = token;
      state.profileLoading = false;
    },

    logout: (state) => {
      state.user = null;
      state.token = null;
      state.profileLoading = false;
      // Clean up local storage if you aren't doing it in the component
      localStorage.removeItem("access_token");
    },

    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.profileLoading = action.payload;
    },
  },
});

export const { userTrack, setUser, logout, setProfileLoading } =
  authSlice.actions;

export default authSlice.reducer;
