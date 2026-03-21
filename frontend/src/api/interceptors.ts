import { api } from "./api";
import { useAuthStore } from "../store/authStore";

function isAuthRefreshRequest(url: string | undefined) {
    if (!url) return false;
    return url.includes("/auth/refresh");
}

api.interceptors.request.use((config) => {
    if (isAuthRefreshRequest(config.url)) {
        return config;
    }

    const token = useAuthStore.getState().accessToken;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

async function handleLogout() {
    try {
        await api.post("/auth/logout");
    } catch {
        console.error("Failed to logout");
    }

    const { logout } = useAuthStore.getState();
    logout();

    if (
        typeof window !== "undefined" &&
        !window.location.pathname.startsWith("/login")
    ) {
        window.location.assign("/login");
    }
}

api.interceptors.response.use(
    (res) => res,
    async (error) => {
        const original = error.config;
        const status = error.response?.status;
        const url = original?.url ?? "";

        if (!original || isAuthRefreshRequest(url) || status !== 401 || original._retry) {
            return Promise.reject(error);
        }

        original._retry = true;

        try {
            const { data } = await api.post<{ accessToken: string }>("/auth/refresh");

            useAuthStore.getState().setAccessToken(data.accessToken);

            original.headers.Authorization = `Bearer ${data.accessToken}`;
            return api(original);
        } catch {
            await handleLogout();
            return Promise.reject(error);
        }
    }
);