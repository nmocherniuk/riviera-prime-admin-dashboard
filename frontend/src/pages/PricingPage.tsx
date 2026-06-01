import { Box, Container, Alert, CircularProgress } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PricingHeader from "../features/Pricing/components/PricingHeader";
import PricingTable from "../features/Pricing/components/PricingTable";
import PricingEditModal from "../features/Pricing/components/PricingEditModal";
import { listPricingRows, savePricingRow } from "../api/pricing";
import { getApiErrorMessage, isNotFoundError } from "../api/organizations";
import { queryKeys } from "../api/queryKeys";
import type { VehiclePricing } from "../features/Pricing/data/pricingData";
import { useToast } from "../providers/ToastProvider";
import { pricingContent } from "../content/pricing";
import { useModalFormErrors } from "../hooks/useModalFormErrors";

export default function PricingPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<VehiclePricing | null>(null);
  const { showToast } = useToast();
  const {
    fieldErrors,
    clearFieldError,
    clearAllFieldErrors,
    applySubmitError,
  } = useModalFormErrors();
  const { data: pricingData = [], isPending, error: pricingError } = useQuery({
    queryKey: queryKeys.pricing.list(),
    queryFn: listPricingRows,
  });

  const loading = isPending;
  const listError =
    pricingError && !isNotFoundError(pricingError)
      ? getApiErrorMessage(pricingError, pricingContent.errors.loadList)
      : null;

  const onEditRow = useCallback((row: VehiclePricing) => {
    clearAllFieldErrors();
    setEditRow(row);
  }, [clearAllFieldErrors]);

  const onSaveEdit = useCallback(
    async (
      vehicleId: string,
      payload: {
        perHour: string;
        perKm: string;
        minimumFare: string;
        holidaySurchargePercent: string;
        nightSurchargePercent: string;
      },
    ) => {
      try {
        clearAllFieldErrors();
        await savePricingRow(vehicleId, {
          perHour: Number(payload.perHour),
          perKm: Number(payload.perKm),
          minimumFare: Number(payload.minimumFare || 0),
          holidaySurchargePercent: Number(payload.holidaySurchargePercent || 0),
          nightSurchargePercent: Number(payload.nightSurchargePercent || 0),
        });
        await queryClient.invalidateQueries({ queryKey: queryKeys.pricing.all });
        showToast({
          message: pricingContent.toasts.saved,
          severity: "success",
        });
      } catch (e) {
        const msg = applySubmitError(e, pricingContent.toasts.saveFailed);
        showToast({
          message: msg,
          severity: "error",
        });
        throw e;
      }
    },
    [queryClient, clearAllFieldErrors, applySubmitError, showToast],
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        {error ?? listError ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error ?? listError}
          </Alert>
        ) : null}

        <PricingHeader />
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
            </Box>
          ) : listError ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              {pricingContent.empty.unableToLoad}
            </Box>
          ) : pricingData.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              {pricingContent.empty.noResults}
            </Box>
          ) : (
            <PricingTable pricingData={pricingData} onEditRow={onEditRow} />
          )}
        </Box>
        <PricingEditModal
          open={!!editRow}
          onClose={() => {
            clearAllFieldErrors();
            setEditRow(null);
          }}
          row={editRow}
          fieldErrors={fieldErrors}
          onClearFieldError={clearFieldError}
          onSave={onSaveEdit}
        />
      </Container>
    </Box>
  );
}
