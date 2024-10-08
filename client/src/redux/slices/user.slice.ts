import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type err = {
  message: string
}

export interface User {
  user: {
    id: string;
    name: string;
    email: string;
    token: string;
  };
  deletedTokens: {
    message: string;
    remainingTokens: number;
  };
  util: {
    error: err;
    loading: boolean;
  };
}

const initialState: User = {
  user: {
    id: "",
    name: "",
    email: "",
    token: "",
  },
  deletedTokens: {
    message: "",
    remainingTokens: 0,
  },
  util: {
    error: { message: "" },
    loading: false,
  },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signInStarts: (state) => {
      state.util.loading = true;
    },
    signInSuccess: (state, action: PayloadAction<{ user: User["user"]; deletedTokens: { message: string; remainingTokens: number } }>) => {

      state.user = {
        id: action.payload.user.id,
        name: action.payload.user.name,
        email: action.payload.user.email,
        token: action.payload.user.token,
      };
      state.deletedTokens = {
        message: action.payload.deletedTokens.message,
        remainingTokens: action.payload.deletedTokens.remainingTokens,
      };
      state.util.loading = false;
      state.util.error = { message: "" };
    },
    signInFailure: (state, action) => {
      state.util.loading = false;
      state.util.error = action.payload;
    },
    signOutSuccess: (state) => {

      state.user = {
        id: "",
        name: "",
        email: "",
        token: "",
      };
      state.deletedTokens = {
        message: "",
        remainingTokens: 0,
      };
      state.util.loading = false;
      state.util.error = { message: "" };
    },
    signUpStart(state) {
      state.util.loading = true;
      state.util.error = { message: "" };
    },
    signUpSuccess(state) {
      state.util.loading = false;
      state.util.error = { message: "" };
    },
    signUpFailure(state, action) {
      state.util.loading = false;
      state.util.error = action.payload;
    },
  },
});

export const {
  signInStarts, signInFailure, signInSuccess, signOutSuccess, signUpSuccess, signUpFailure, signUpStart
} = userSlice.actions;

export default userSlice.reducer;

