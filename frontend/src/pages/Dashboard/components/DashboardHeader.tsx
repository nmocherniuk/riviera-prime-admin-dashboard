import PageHeader from "../../../components/ui/PageHeader";

export default function PricingHeader() {
  return (
    <PageHeader
      title="Dashboard"
      subtitle="View your dashboard and analytics"
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      sx={{ pt: { xs: 1, md: 2 } }}
    />
  );
}
