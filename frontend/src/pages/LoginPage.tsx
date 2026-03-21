import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import { formContainerSx, formTextFieldSx } from "../components/ui/formStyles";

export default function LoginPage() {
  const theme = useTheme();

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
      <Container maxWidth="md" >
        <Box sx={formContainerSx()}>
          <Box sx={{
            px: { xs: 3, md: 5 },
            py: { xs: 4, md: 3 },
          }}>
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
                Aurevia Chauffeur
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
            <Box sx={{ display: "flex", flexDirection: "column", gap: { xs: 2, md: 2.5 } }}>
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
                  Email
                </Typography>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter email"
                  type="email"
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
                  Password
                </Typography>

                <TextField
                  fullWidth
                  size="small"
                  placeholder="Enter password"
                  type="password"
                  sx={formTextFieldSx(theme)}
                />
              </Box>

              <Button
                type="submit"
                fullWidth
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
                Login
              </Button>
            </Box>
          </Box>
          <Box sx={{
            flexGrow: 1,
            display: { xs: "none", md: "block" },
            position: "relative",
            minHeight: 500,
            borderRadius: 2,
            backgroundImage:
              "url('pierre-blache.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }} />
        </Box>

      </Container>
    </Box>
  );
}