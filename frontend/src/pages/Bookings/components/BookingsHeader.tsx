import { Box, Button, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

type Props = { onNewBooking?: () => void };

export default function BookingsHeader({ onNewBooking }: Props) {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: { xs: "flex-start", md: "center" },
        justifyContent: "space-between",
        gap: 2,
        flexWrap: "wrap",
        pt: { xs: 1, md: 2 },
      }}
    >
      <Box>
        <Typography
          variant="h5"
          component="h2"
          sx={{ fontWeight: 700, color: "background.paper", lineHeight: 1.2 }}
        >
          Bookings Calendar
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "background.paper", mt: 0.25 }}
        >
          Managing 24 active transfers today
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
          justifyContent: { xs: "flex-start", md: "flex-end" },
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewBooking}
          sx={{
            bgcolor: "primary.main",
            color: "common.black",
            fontWeight: 700,
            borderRadius: 2,
            px: 2,
            whiteSpace: "nowrap",
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          New Booking
        </Button>
      </Box>
    </Box>
  );
}
