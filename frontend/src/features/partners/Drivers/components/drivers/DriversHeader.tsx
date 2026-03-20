import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../../../../../components/PageHeader";
import type { DriverOrganization } from "../../data/types";

type Props = { organization: DriverOrganization; onAddDriver: () => void };

export default function DriversHeader({ organization, onAddDriver }: Props) {
  return (
    <PageHeader
      title={organization.organizationName}
      subtitle="Manage drivers"
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      withBack={{
        label: "Back to organizations",
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
          Add driver
        </Button>
      }
    />
  );
}
