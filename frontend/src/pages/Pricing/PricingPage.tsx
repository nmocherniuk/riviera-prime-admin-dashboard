import { Box, Container } from "@mui/material";
import { useState, useCallback } from "react";
import PricingHeader from "./components/PricingHeader";
import PricingTable from "./components/PricingTable";
import { buildPricingList } from "./data/pricingData";
import type { VehiclePricing } from "./data/pricingData";

export default function PricingPage() {
  const [rows, setRows] = useState<VehiclePricing[]>(() => buildPricingList());

  const onPerHourChange = useCallback((vehicleId: string, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.vehicle.id === vehicleId ? { ...r, perHour: value } : r,
      ),
    );
  }, []);

  const onPerKmChange = useCallback((vehicleId: string, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.vehicle.id === vehicleId ? { ...r, perKm: value } : r,
      ),
    );
  }, []);

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        <PricingHeader />
        <Box sx={{ mt: 2 }}>
          <PricingTable
            rows={rows}
            onPerHourChange={onPerHourChange}
            onPerKmChange={onPerKmChange}
          />
        </Box>
      </Container>
    </Box>
  );
}
