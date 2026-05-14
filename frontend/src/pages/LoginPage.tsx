import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
  Alert,
} from "@mui/material";
import { formContainerSx, formTextFieldSx } from "../components/ui/formStyles";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { loginRequest } from "../api/auth";
import { useAuthStore } from "../store/authStore";

export default function LoginPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await loginRequest(email, password);
      useAuthStore.getState().setAccessToken(data.accessToken);
      useAuthStore.getState().setUser(data.user);
      navigate(from, { replace: true });
    } catch (error) {
      console.log(error);
      setError("E-mail ou mot de passe incorrect.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Container maxWidth="md">
        <Box sx={formContainerSx()}>
          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              px: { xs: 3, md: 5 },
              py: { xs: 4, md: 3 },
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle2"
                sx={{
                  fontWeight: 700,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  color: "primary.main",
                }}
              >
                Aurevia
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  mt: 1,
                  fontWeight: 800,
                  color: "text.primary",
                }}
              >
                Connectez-vous à votre compte
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 2, md: 2.5 },
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    mb: 0.75,
                    display: "block",
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  E-mail
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Saisissez votre e-mail"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  sx={formTextFieldSx(theme)}
                />
              </Box>

              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    mb: 0.75,
                    display: "block",
                    fontWeight: 600,
                    color: "text.secondary",
                  }}
                >
                  Mot de passe
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Saisissez votre mot de passe"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  sx={formTextFieldSx(theme)}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1.5,
                  borderRadius: 2,
                  py: 1.2,
                  fontWeight: 700,
                  textTransform: "none",
                  bgcolor: "primary.main",
                  color: "#141414",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                }}
              >
                {loading ? "Connexion…" : "Se connecter"}
              </Button>
            </Box>
          </Box>
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "block" },
              position: "relative",
              minHeight: 500,
              borderRadius: 2,
              backgroundImage: "url('pierre-blache.jpg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        </Box>
      </Container>
    </Box>
  );
}
