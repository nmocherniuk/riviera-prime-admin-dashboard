import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
} from "@mui/material";

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "stretch",
        justifyContent: "center",
      }}
    >
      <Container
        maxWidth={false}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          px: { xs: 0, md: 0 },
        }}
      >
        <Box
          sx={{
            flexBasis: { xs: "100%", md: "40%" },
            maxWidth: { md: 520 },
            bgcolor: "#F6D9D1",
            px: { xs: 3, sm: 5, md: 7 },
            py: { xs: 4, sm: 6, md: 8 },
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
                color: "#141414",
              }}
            >
              Aurevia Chauffeur
            </Typography>

            <Box sx={{ mt: { xs: 5, md: 8 }, maxWidth: 360 }}>
              <Typography
                component="h1"
                sx={{
                  fontSize: { xs: "1.7rem", sm: "2rem", md: "2.3rem" },
                  lineHeight: 1.1,
                  fontWeight: 800,
                  color: "#141414",
                }}
              >
                Connectez-vous à votre compte
              </Typography>

              <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2.5 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mb: 0.75,
                      fontWeight: 600,
                      color: "#141414",
                    }}
                  >
                    Email
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter email"
                    type="email"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        bgcolor: "rgba(255,255,255,0.8)",
                      },
                    }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mb: 0.75,
                      fontWeight: 600,
                      color: "#141414",
                    }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Enter password"
                    type="password"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: 999,
                        bgcolor: "rgba(255,255,255,0.8)",
                      },
                    }}
                  />
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  sx={{
                    mt: 1,
                    borderRadius: 999,
                    py: 1.3,
                    fontWeight: 700,
                    textTransform: "none",
                    fontSize: "0.9rem",
                    bgcolor: "#D4AF35",
                    color: "#141414",
                    "&:hover": {
                      bgcolor: "#c49f2f",
                    },
                  }}
                >
                  Login ↗
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box
          sx={{
            flexGrow: 1,
            display: { xs: "none", md: "block" },
            backgroundImage:
              "url('https://images.pexels.com/photos/286763/pexels-photo-286763.jpeg?auto=compress&cs=tinysrgb&w=1600')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
      </Container>
    </Box>
  );
}

