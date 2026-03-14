import PageHeader from "../../../components/ui/PageHeader";

export default function PricingHeader() {
  return (
    <PageHeader
      title="Pricing"
      subtitle="Set price per hour or per kilometre for each vehicle"
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      sx={{ pt: { xs: 1, md: 2 } }}
    />
  );
}
