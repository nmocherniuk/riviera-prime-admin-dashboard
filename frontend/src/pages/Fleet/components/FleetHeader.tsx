import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = { onAddFleet?: () => void };

export default function FleetHeader({ onAddFleet }: Props) {
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
          Fleet Management
        </Typography>
        <Typography
          variant="body1"
          sx={{ mt: 0.5, color: "text.secondary", fontSize: { xs: "0.875rem", md: "1rem" } }}
        >
          Manage your elite fleet and performance metrics
        </Typography>
      </Box>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        fullWidth={false}
        onClick={onAddFleet}
        sx={{
          width: { xs: "100%", sm: "auto" },
          bgcolor: "primary.main",
          color: "grey.900",
          fontWeight: 700,
          borderRadius: 2,
          px: 2,
          py: 1.25,
          "&:hover": { bgcolor: "primary.dark" },
        }}
      >
        Add New Fleet
      </Button>
    </Box>
  );
}
