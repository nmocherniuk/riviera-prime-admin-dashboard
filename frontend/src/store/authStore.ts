import { create } from "zustand";
import {
  readStoredAccessToken,
  writeAccessTokenCookie,
  clearAccessTokenCookie,
} from "../utils/authCookie";
import type { AuthUser } from "../api/auth";

type AuthState = {
  accessToken: string | null;
  user: AuthUser | null;
  setAccessToken: (token: string | null) => void;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: readStoredAccessToken(),
  user: null,
  setAccessToken: (token) => {
    try {
      if (token) {
        writeAccessTokenCookie(token);
      } else {
        clearAccessTokenCookie();
      }
    } catch {
      console.error("Failed to set access token");
    }
    set({ accessToken: token });
  },
  setUser: (user) => set({ user }),
  logout: () => {
    try {
      clearAccessTokenCookie();
    } catch {
      console.error("Failed to logout");
    }
    set({ accessToken: null, user: null });
  },
}));
