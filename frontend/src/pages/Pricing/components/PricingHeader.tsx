import { Box, Typography } from "@mui/material";

export default function PricingHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        flexWrap: "wrap",
        alignItems: { xs: "stretch", sm: "flex-start" },
        justifyContent: "space-between",
        gap: 2,
      }}
    >
      <Box>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            color: "text.primary",
            letterSpacing: "-0.02em",
            fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
          }}
        >
          Pricing
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 0.5, color: "text.secondary", fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Set price per hour or per kilometre for each vehicle
        </Typography>
      </Box>
    </Box>
  );
}
