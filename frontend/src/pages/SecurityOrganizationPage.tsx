import { Box, Container, Button, Typography } from "@mui/material";
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageHeader from "../components/PageHeader";

import ConfirmDeleteDialog from "../components/ConfirmDeleteDialog";
import {
  DUMMY_PARTNERS,
  DUMMY_BODYGUARDS,
} from "../features/partners/Security/data/dummyPartners";
import type { Bodyguard } from "../features/partners/Security/data/types";
import BodyguardModal, {
  type BodyguardFormValues,
} from "../features/partners/Security/components/bodyguards/BodyguardModal";
import BodyguardsTable from "../features/partners/Security/components/bodyguards/BodyguardsTable";

export default function SecurityOrganizationPage() {
  const { partnerId } = useParams<{ partnerId: string }>();
  const navigate = useNavigate();
  const partner = useMemo(
    () => DUMMY_PARTNERS.find((p) => p.id === partnerId) ?? null,
    [partnerId],
  );

  const [bodyguards, setBodyguards] = useState<Bodyguard[]>(() =>
    DUMMY_BODYGUARDS.filter((b) => b.partnerId === partnerId),
  );
  const [bodyguardModal, setBodyguardModal] = useState<{
    open: boolean;
    bodyguard: Bodyguard | null;
    readOnly?: boolean;
  }>({
    open: false,
    bodyguard: null,
    readOnly: false,
  });
  const [bodyguardToDelete, setBodyguardToDelete] = useState<Bodyguard | null>(
    null,
  );

  const handleSaveBodyguard = (
    bodyguardId: string | null,
    values: BodyguardFormValues,
  ) => {
    if (bodyguardId) {
      setBodyguards((prev) =>
        prev.map((b) => (b.id === bodyguardId ? { ...b, ...values } : b)),
      );
    } else {
      const newId = `BGY-${String(bodyguards.length + 100).padStart(3, "0")}`;
      setBodyguards((prev) => [
        ...prev,
        { id: newId, partnerId: partnerId!, ...values },
      ]);
    }
  };

  const handleDeleteBodyguard = (b: Bodyguard) => {
    setBodyguards((prev) => prev.filter((x) => x.id !== b.id));
  };

  if (!partnerId || !partner) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="body1" color="text.secondary">
          Partner not found.
        </Typography>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/security-partners")}
          sx={{ mt: 2 }}
        >
          Back to partners
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container
        maxWidth={false}
        sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}
      >
        <Box sx={{ pt: { xs: 1, md: 2 } }}>
          <PageHeader
            title={partner.companyName}
            subtitle={`Manage bodyguards for ${partner.contactPerson}`}
            titleSx={{ fontWeight: 800, letterSpacing: "-0.02em" }}
            subtitleSx={{ fontSize: { xs: "0.875rem", md: "1rem" } }}
            withBack={{ label: "Back to partners", path: "/security-partners" }}
            action={
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() =>
                  setBodyguardModal({
                    open: true,
                    bodyguard: null,
                    readOnly: false,
                  })
                }
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
                Add bodyguard
              </Button>
            }
          />
        </Box>
        <Box sx={{ mt: 2 }}>
          <BodyguardsTable
            bodyguards={bodyguards}
            onBodyguardView={(b) =>
              setBodyguardModal({ open: true, bodyguard: b, readOnly: true })
            }
            onBodyguardEdit={(b) =>
              setBodyguardModal({ open: true, bodyguard: b, readOnly: false })
            }
            onBodyguardDelete={setBodyguardToDelete}
          />
        </Box>
        <BodyguardModal
          open={bodyguardModal.open}
          onClose={() =>
            setBodyguardModal((prev) => ({ ...prev, open: false }))
          }
          bodyguard={bodyguardModal.bodyguard}
          readOnly={bodyguardModal.readOnly}
          onSave={handleSaveBodyguard}
        />
        <ConfirmDeleteDialog
          open={!!bodyguardToDelete}
          onClose={() => setBodyguardToDelete(null)}
          onConfirm={() => {
            if (bodyguardToDelete) {
              handleDeleteBodyguard(bodyguardToDelete);
              setBodyguardToDelete(null);
            }
          }}
          title="Видалити охоронця?"
          message="Цю дію не можна скасувати."
        />
      </Container>
    </Box>
  );
}
