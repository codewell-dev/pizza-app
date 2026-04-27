import { StateCreator } from "zustand";
import { AuthUser } from "@/lib/auth";

export interface AuthSlice {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;

  setAuth: (user: AuthUser, token: string) => void;
  clearAuth: () => void;
}

export const createAuthSlice: StateCreator<
  AuthSlice,
  [["zustand/immer", never], ["zustand/devtools", never]],
  [],
  AuthSlice
> = (set) => ({
  user: null,
  token: null,
  isAuthenticated: false,

  setAuth: (user, token) =>
    set(
      (state) => {
        state.user = user;
        state.token = token;
        state.isAuthenticated = true;
      },
      false,
      "auth/setAuth"
    ),

  clearAuth: () =>
    set(
      (state) => {
        state.user = null;
        state.token = null;
        state.isAuthenticated = false;
      },
      false,
      "auth/clearAuth"
    ),
});
