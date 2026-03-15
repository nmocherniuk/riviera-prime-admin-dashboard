import { Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import PageHeader from "../../../components/PageHeader";

type Props = { onAddPartner?: () => void };

const primaryButtonSx = {
  width: { xs: "100%", sm: "auto" },
  bgcolor: "primary.main",
  color: "grey.900",
  fontWeight: 700,
  borderRadius: 2,
  px: 2,
  py: 1.25,
  "&:hover": { bgcolor: "primary.dark" },
};

export default function SecurityPartnersHeader({ onAddPartner }: Props) {
  return (
    <PageHeader
      title="Security / Partners"
      subtitle="Manage security companies and bodyguards"
      titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
      subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
      sx={{ pt: { xs: 1, md: 2 } }}
      action={
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={onAddPartner}
          sx={primaryButtonSx}
        >
          Add Partner
        </Button>
      }
    />
  );
}
