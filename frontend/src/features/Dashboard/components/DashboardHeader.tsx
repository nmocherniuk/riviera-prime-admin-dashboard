import PageHeader from "../../../components/PageHeader";
import { dashboardContent } from "../../../content/dashboard";

export default function DashboardHeader() {
  return (
    <PageHeader
      title={dashboardContent.header.title}
      subtitle={dashboardContent.header.subtitle}
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      sx={{ pt: { xs: 1, md: 2 } }}
    />
  );
}
