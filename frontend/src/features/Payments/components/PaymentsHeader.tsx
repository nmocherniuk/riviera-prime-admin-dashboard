import { Button } from "@mui/material";
import PageHeader from "../../../components/PageHeader";

type Props = {
  onWithdraw?: () => void;
  withdrawing?: boolean;
  withdrawDisabled?: boolean;
};

export default function PaymentsHeader({
  onWithdraw,
  withdrawing = false,
  withdrawDisabled = false,
}: Props) {
  return (
    <PageHeader
      title="Payments"
      subtitle="Manage customer payments and transactions"
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      sx={{ pt: { xs: 1, md: 2 } }}
      action={
        <Button
          variant="contained"
          onClick={onWithdraw}
          disabled={withdrawDisabled || withdrawing}
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
          {withdrawing ? "Withdrawing..." : "Withdraw"}
        </Button>
      }
    />
  );
}
