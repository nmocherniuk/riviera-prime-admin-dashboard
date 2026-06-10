import { Box, Button, Chip, Typography } from "@mui/material";
import { memo, useState } from "react";
import { sectionLabelSx } from "../../../../../../../components/ui/modalStyles";
import { sendDriverStripeOnboardingEmail } from "../../../../../../../api/stripe";
import { useToast } from "../../../../../../../providers/ToastProvider";
import { getApiErrorMessage } from "../../../../../../../api/organizations";
import { getDriverEarnings } from "../../../../../../../api/drivers";
import { useQuery } from "@tanstack/react-query";
import { driverAgentsContent } from "../../../../../../../content/driverAgents";

const p = driverAgentsContent.modal.payout;

type PayoutBadge = "not_connected" | "pending" | "active";

function resolveBadge(
  stripeAccountId: string | null | undefined,
  completed: boolean | undefined,
): PayoutBadge {
  if (completed) return "active";
  if (stripeAccountId) return "pending";
  return "not_connected";
}

const badgeProps: Record<
  PayoutBadge,
  { label: string; color: "default" | "warning" | "success" }
> = {
  not_connected: { label: p.badges.notConnected, color: "default" },
  pending: { label: p.badges.pending, color: "warning" },
  active: { label: p.badges.active, color: "success" },
};

type Props = {
  readOnly: boolean;
  driverId?: string;
  driverEmail?: string | null;
  stripeAccountId?: string | null;
  stripeOnboardingCompleted?: boolean;
};

function DriverPayoutSection({
  readOnly,
  driverId,
  driverEmail,
  stripeAccountId,
  stripeOnboardingCompleted,
}: Props) {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);

  const badge = resolveBadge(stripeAccountId, stripeOnboardingCompleted);
  const { label: badgeLabel, color: badgeColor } = badgeProps[badge];
  const hasEmail = Boolean(driverEmail?.trim());
  const showCta =
    !stripeOnboardingCompleted && !readOnly && Boolean(driverId) && hasEmail;
  const { data: earnings } = useQuery({
    queryKey: ["drivers", "earnings", driverId],
    queryFn: () => getDriverEarnings(driverId!),
    enabled: Boolean(driverId),
  });

  const handleSendEmail = async () => {
    if (!driverId) return;
    setLoading(true);
    try {
      await sendDriverStripeOnboardingEmail(driverId);
      showToast({
        message: p.toastSuccess,
        severity: "success",
      });
    } catch (e) {
      showToast({
        message: getApiErrorMessage(e, p.toastError),
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Typography sx={sectionLabelSx}>{p.sectionTitle}</Typography>
      <Typography variant="body2" sx={{ mb: 1.5, color: "text.secondary" }}>
        {p.description}
      </Typography>

      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <Chip
          size="small"
          label={badgeLabel}
          color={badgeColor}
          sx={{ fontWeight: 700, fontSize: "0.7rem" }}
        />
      </Box>

      {earnings ? (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {p.totalEarned} <strong>{earnings.totalEarned.toFixed(2)} {earnings.currency}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {p.availableToWithdraw} <strong>{earnings.availableBalance.toFixed(2)} {earnings.currency}</strong>
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            {p.pendingTrips} <strong>{earnings.pending.toFixed(2)} {earnings.currency}</strong>
          </Typography>
        </Box>
      ) : null}

      {stripeOnboardingCompleted ? (
        <Typography
          variant="body2"
          sx={{ color: "success.main", fontWeight: 600 }}
        >
          {p.connectedMessage}
        </Typography>
      ) : null}

      {!stripeOnboardingCompleted && driverId && !hasEmail ? (
        <Typography variant="body2" color="warning.main" sx={{ mb: 1 }}>
          {p.addEmailWarning}
        </Typography>
      ) : null}

      {showCta ? (
        <Button
          fullWidth
          variant="outlined"
          disabled={loading}
          onClick={() => void handleSendEmail()}
          sx={{
            mt: stripeOnboardingCompleted ? 0 : 1,
            borderRadius: 1.5,
            py: 1.5,
            textTransform: "uppercase",
            fontWeight: 700,
            letterSpacing: "0.04em",
            borderColor: "primary.main",
            color: "primary.main",
            "&:hover": {
              borderColor: "primary.dark",
              bgcolor: "rgba(212, 175, 53, 0.08)",
            },
          }}
        >
          {loading ? p.sending : p.sendButton}
        </Button>
      ) : null}

      {readOnly && !stripeOnboardingCompleted ? (
        <Typography variant="body2" color="text.secondary">
          {stripeAccountId
            ? p.readOnlyPending
            : p.readOnlyNotSetup}
        </Typography>
      ) : null}
    </>
  );
}

export default memo(DriverPayoutSection);
