import { api } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: string;
};

export type LoginResponse = {
  accessToken: string;
  user: AuthUser;
};

export type RefreshResponse = {
  accessToken: string;
};

export type MeResponse = {
  user: AuthUser;
};

export const loginRequest = (email: string, password: string) =>
  api.post<LoginResponse>("/auth/login", { email, password });

export const refreshRequest = () => api.post<RefreshResponse>("/auth/refresh");

export const meRequest = () => api.get<MeResponse>("/auth/me");

export const logoutRequest = () => api.post("/auth/logout");