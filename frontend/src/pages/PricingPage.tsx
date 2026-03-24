import { Box, Container, Alert, CircularProgress } from "@mui/material";
import { useState, useCallback, useEffect } from "react";
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

export default function PricingPage() {
  const [rows, setRows] = useState<VehiclePricing[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editRow, setEditRow] = useState<VehiclePricing | null>(null);

  const loadRows = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await listPricingRows();
      setRows(data.map(dtoToVehiclePricing));
    } catch (e) {
      if (isNotFoundError(e)) {
        setRows([]);
      } else {
        setError(getApiErrorMessage(e, "Failed to load pricing"));
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadRows();
  }, [loadRows]);

  const onEditRow = useCallback((row: VehiclePricing) => {
    setEditRow(row);
  }, []);

  const onSaveEdit = useCallback(
    async (vehicleId: string, perHour: string, perKm: string) => {
      try {
        setError(null);
        await savePricingRow(vehicleId, perHour, perKm);
        await loadRows();
      } catch (e) {
        setError(getApiErrorMessage(e, "Failed to save pricing"));
        throw e;
      }
    },
    [loadRows],
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        {error ? (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        ) : null}

        <PricingHeader />
        <Box sx={{ mt: 2 }}>
          {loading ? (
            <Box sx={{ py: 8, display: "flex", justifyContent: "center" }}>
              <CircularProgress />
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
