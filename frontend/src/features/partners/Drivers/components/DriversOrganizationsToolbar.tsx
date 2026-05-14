import EntitySectionToolbar from "../../../../components/SectionToolbar";
import { driversContent } from "../../../../content/drivers";

export default function DriversOrganizationsToolbar() {
  return (
    <EntitySectionToolbar
      searchPlaceholder={driversContent.toolbar.searchPlaceholder}
    />
  );
}
