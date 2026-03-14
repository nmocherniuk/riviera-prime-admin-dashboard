import { Box, Container } from "@mui/material";
import { useState, useCallback } from "react";
import PricingHeader from "./components/PricingHeader";
import PricingTable from "./components/PricingTable";
import PricingEditModal from "./components/PricingEditModal";
import { buildPricingList } from "./data/pricingData";
import type { VehiclePricing } from "./data/pricingData";

export default function PricingPage() {
  const [rows, setRows] = useState<VehiclePricing[]>(() => buildPricingList());
  const [editRow, setEditRow] = useState<VehiclePricing | null>(null);

  const onEditRow = useCallback((row: VehiclePricing) => {
    setEditRow(row);
  }, []);

  const onSaveEdit = useCallback(
    (vehicleId: string, perHour: string, perKm: string) => {
      setRows((prev) =>
        prev.map((r) =>
          r.vehicle.id === vehicleId ? { ...r, perHour, perKm } : r,
        ),
      );
    },
    [],
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        <PricingHeader />
        <Box sx={{ mt: 2 }}>
          <PricingTable rows={rows} onEditRow={onEditRow} />
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
