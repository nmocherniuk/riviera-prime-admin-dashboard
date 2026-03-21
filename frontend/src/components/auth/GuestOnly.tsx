import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

/** Redirect authenticated users away from /login */
export default function GuestOnly() {
  const accessToken = useAuthStore((s) => s.accessToken);

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
