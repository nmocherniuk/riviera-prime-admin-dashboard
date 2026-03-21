import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { api } from "../../api/api";
import { useAuthStore } from "../../store/authStore";

/**
 * Tries silent refresh when there is no access token in storage but refresh cookie may exist.
 */
export default function AuthBootstrap({
  children,
}: {
  children: React.ReactNode;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        if (!useAuthStore.getState().accessToken) {
          const { data } = await api.post<{ accessToken: string }>(
            "/auth/refresh",
          );
          if (!cancelled) {
            useAuthStore.getState().setAccessToken(data.accessToken);
          }
        }
      } catch {
        console.error("Failed to refresh access token");
      } finally {
        if (!cancelled) {
          setReady(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress color="primary" />
      </Box>
    );
  }

  return <>{children}</>;
}
