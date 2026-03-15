import { Box, Container } from "@mui/material";
import { useMemo, useState, useCallback } from "react";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ScheduleIcon from "@mui/icons-material/Schedule";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import PaymentsHeader from "./components/PaymentsHeader";
import PaymentsFilters from "./components/PaymentsFilters";
import PaymentsTable from "./components/PaymentsTable";
import PaymentDetailModal from "./components/PaymentDetailModal";
import CardStat from "../../components/CardStat";
import { DUMMY_PAYMENTS } from "./data/dummyPayments";
import type { Payment } from "./data/dummyPayments";
import { DEFAULT_PAYMENTS_FILTERS } from "./constants/filters";
import type { PaymentsFilterState } from "./constants/filters";
import { filterPayments } from "./utils/filterPayments";

export default function PaymentsPage() {
  const [filters, setFilters] = useState<PaymentsFilterState>(DEFAULT_PAYMENTS_FILTERS);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const filteredPayments = useMemo(
    () => filterPayments(DUMMY_PAYMENTS, filters),
    [filters]
  );

  const stats = useMemo(
    () => [
      { label: "Today Revenue", value: "£1,240", icon: AttachMoneyIcon },
      { label: "Pending", value: "12", icon: ScheduleIcon },
      { label: "To Capture", value: "3", icon: CreditCardIcon },
      { label: "Failed", value: "2", icon: ErrorOutlineIcon },
    ],
    []
  );

  const handleFilterChange = useCallback(
    <K extends keyof PaymentsFilterState>(key: K, value: PaymentsFilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        <PaymentsHeader />

        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr",
              md: "repeat(4, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {stats.map((stat) => (
            <CardStat key={stat.label} stat={stat} />
          ))}
        </Box>

        <Box sx={{ mt: 2 }}>
          <PaymentsFilters filters={filters} onFilterChange={handleFilterChange} />
        </Box>

        <Box sx={{ mt: 2 }}>
          <PaymentsTable
            payments={filteredPayments}
            onPaymentClick={setSelectedPayment}
            onCapture={() => { }}
            onRefund={() => { }}
            onResendLink={() => { }}
          />
        </Box>

        <PaymentDetailModal
          open={!!selectedPayment}
          onClose={() => setSelectedPayment(null)}
          payment={selectedPayment}
        />
      </Container>
    </Box>
  );
}
