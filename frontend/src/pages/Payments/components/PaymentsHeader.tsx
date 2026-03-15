import PageHeader from "../../../components/ui/PageHeader";

export default function PaymentsHeader() {
  return (
    <PageHeader
      title="Payments"
      subtitle="Manage customer payments and transactions"
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      sx={{ pt: { xs: 1, md: 2 } }}
    />
  );
}
