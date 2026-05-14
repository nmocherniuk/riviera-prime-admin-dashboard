import EntitySectionToolbar from "../../../../components/SectionToolbar";
import { securityPartnersContent } from "../../../../content/securityPartners";

export default function SecurityPartnersToolbar() {
  return (
    <EntitySectionToolbar searchPlaceholder={securityPartnersContent.toolbar.searchPlaceholder} />
  );
}
