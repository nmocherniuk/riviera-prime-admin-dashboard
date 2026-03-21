import { api } from "./api";

export const loginRequest = (email: string, password: string) =>
    api.post("/auth/login", { email, password });

export const refreshRequest = () =>
    api.post("/auth/refresh");