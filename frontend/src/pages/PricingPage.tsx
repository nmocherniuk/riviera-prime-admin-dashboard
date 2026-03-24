import { Box, Container, Alert, CircularProgress } from "@mui/material";
import { useState, useCallback, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import PricingHeader from "../features/Pricing/components/PricingHeader";
import PricingTable from "../features/Pricing/components/PricingTable";
import PricingEditModal from "../features/Pricing/components/PricingEditModal";
import type { VehiclePricing } from "../features/Pricing/data/pricingData";
import {
  dtoToVehiclePricing,
  listPricingRows,
  savePricingRow,
} from "../api/pricing";
import { getApiErrorMessage, isNotFoundError } from "../api/organizations";
import { queryKeys } from "../api/queryKeys";

export default function PricingPage() {
  const queryClient = useQueryClient();
  const [error, setError] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<VehiclePricing | null>(null);

  const pricingQuery = useQuery({
    queryKey: queryKeys.pricing.list(),
    queryFn: listPricingRows,
  });

  const rows = useMemo(() => {
    if (
      pricingQuery.isError &&
      pricingQuery.error &&
      isNotFoundError(pricingQuery.error)
    ) {
      return [];
    }
    if (!pricingQuery.data) return [];
    return pricingQuery.data.map(dtoToVehiclePricing);
  }, [pricingQuery.data, pricingQuery.isError, pricingQuery.error]);

  const loading = pricingQuery.isPending;
  const listError =
    pricingQuery.error && !isNotFoundError(pricingQuery.error)
      ? getApiErrorMessage(pricingQuery.error, "Failed to load pricing")
      : null;

  const onEditRow = useCallback((row: VehiclePricing) => {
    setEditRow(row);
  }, []);

  const onSaveEdit = useCallback(
    async (vehicleId: string, perHour: string, perKm: string) => {
      try {
        setError(null);
        await savePricingRow(vehicleId, perHour, perKm);
        await queryClient.invalidateQueries({ queryKey: queryKeys.pricing.all });
      } catch (e) {
        setError(getApiErrorMessage(e, "Failed to save pricing"));
        throw e;
      }
    },
    [queryClient],
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
              Unable to load pricing.
            </Box>
          ) : rows.length === 0 ? (
            <Box sx={{ py: 8, textAlign: "center", color: "text.secondary" }}>
              No results
            </Box>
          ) : (
            <PricingTable rows={rows} onEditRow={onEditRow} />
          )}
        </Box>
        <PricingEditModal
          open={!!editRow}
          onClose={() => setEditRow(null)}
          row={editRow}
          onSave={onSaveEdit}
        />
      </Container>
    </Box>
  );
}
