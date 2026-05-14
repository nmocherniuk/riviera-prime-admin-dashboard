import PageHeader from "../../../components/PageHeader";
import { pricingContent } from "../../../content/pricing";

export default function PricingHeader() {
  return (
    <PageHeader
      title={pricingContent.page.title}
      subtitle={pricingContent.page.subtitle}
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      sx={{ pt: { xs: 1, md: 2 } }}
    />
  );
}
