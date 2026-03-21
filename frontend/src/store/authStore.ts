import { create } from "zustand";
import {
    readStoredAccessToken,
    writeAccessTokenCookie,
    clearAccessTokenCookie,
} from "../utils/authCookie";

type AuthState = {
    accessToken: string | null;
    setAccessToken: (token: string | null) => void;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
    accessToken: readStoredAccessToken(),
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
    logout: () => {
        try {
            clearAccessTokenCookie();
        } catch {
            console.error("Failed to logout");
        }
        set({ accessToken: null });
    },
}));
