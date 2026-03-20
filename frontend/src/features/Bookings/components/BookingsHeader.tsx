import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../../../components/PageHeader";

type Props = { onNewBooking?: () => void };

const primaryButtonSx = {
  width: { xs: "100%", sm: "auto" },
  bgcolor: "primary.main",
  color: "grey.900",
  fontWeight: 700,
  borderRadius: 2,
  px: 2,
  py: 1.25,
  "&:hover": { bgcolor: "primary.dark" },
};

export default function BookingsHeader({ onNewBooking }: Props) {
  return (
    <PageHeader
      title="Bookings Calendar"
      subtitle="Managing 24 active transfers today"
      sx={{ pt: { xs: 1, md: 2 } }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewBooking}
          sx={primaryButtonSx}
        >
          New Booking
        </Button>
      }
    />
  );
}
