import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../../../../../components/PageHeader";
import { driverAgentsContent } from "../../../../../content/driverAgents";

type Props = { organizationName: string; onAddDriver: () => void };

export default function DriversHeader({ organizationName, onAddDriver }: Props) {
  return (
    <PageHeader
      title={organizationName}
      subtitle={driverAgentsContent.page.subtitle}
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      withBack={{
        label: driverAgentsContent.page.backToOrganizations,
        path: "/drivers-partners",
      }}
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => onAddDriver()}
          sx={{
            width: { xs: "100%", sm: "auto" },
            bgcolor: "primary.main",
            color: "grey.900",
            fontWeight: 700,
            borderRadius: 2,
            px: 2,
            py: 1.25,
            "&:hover": { bgcolor: "primary.dark" },
          }}
        >
          {driverAgentsContent.page.addDriver}
        </Button>
      }
    />
  );
}
