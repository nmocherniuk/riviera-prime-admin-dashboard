import { useEffect, useState } from "react";
import { Box, CircularProgress } from "@mui/material";
import { meRequest, refreshRequest } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";

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
        const auth = useAuthStore.getState();
        if (!auth.accessToken) {
          const { data } = await refreshRequest();
          if (!cancelled) auth.setAccessToken(data.accessToken);
        }

        if (useAuthStore.getState().accessToken) {
          const me = await meRequest();
          if (!cancelled) useAuthStore.getState().setUser(me.data.user);
        }
      } catch {
        useAuthStore.getState().logout();
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
