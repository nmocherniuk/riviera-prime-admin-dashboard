import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../../../components/PageHeader";
import {
  bookingContent,
  formatBookingsPageSubtitle,
} from "../../../content/booking";

type Props = { onNewBooking?: () => void; activeTransfersToday: number };

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

export default function BookingsHeader({
  onNewBooking,
  activeTransfersToday,
}: Props) {
  return (
    <PageHeader
      title={bookingContent.page.title}
      subtitle={formatBookingsPageSubtitle(activeTransfersToday)}
      sx={{ pt: { xs: 1, md: 2 } }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onNewBooking}
          sx={primaryButtonSx}
        >
          {bookingContent.actions.newBooking}
        </Button>
      }
    />
  );
}
