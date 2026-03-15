import { Box, Container } from "@mui/material";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SecurityPartnersHeader from "./components/SecurityPartnersHeader";
import SecurityPartnersStats from "./components/SecurityPartnersStats";
import SecurityPartnersToolbar from "./components/SecurityPartnersToolbar";
import PartnersTable from "./components/PartnersTable";
import PartnerManagementModal from "./components/PartnerManagementModal";
import ConfirmDeleteDialog from "../../components/ConfirmDeleteDialog";
import { DUMMY_PARTNERS } from "./data/dummyPartners";
import type { Partner } from "./data/types";
import type { PartnerFormValues } from "./components/PartnerManagementModal";

const ROWS_PER_PAGE = 4;

export default function SecurityPartnersPage() {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [allPartners, setAllPartners] = useState<Partner[]>(() => [...DUMMY_PARTNERS]);
  const [partnerModal, setPartnerModal] = useState<{ open: boolean; partner: Partner | null; readOnly?: boolean }>({
    open: false,
    partner: null,
    readOnly: false,
  });
  const [partnerToDelete, setPartnerToDelete] = useState<Partner | null>(null);

  const partners = useMemo(
    () => allPartners.slice((page - 1) * ROWS_PER_PAGE, page * ROWS_PER_PAGE),
    [allPartners, page]
  );

  const handleSavePartner = (partnerId: string | null, values: PartnerFormValues) => {
    if (partnerId) {
      setAllPartners((prev) =>
        prev.map((p) =>
          p.id === partnerId
            ? { ...p, ...values }
            : p
        )
      );
    } else {
      const newId = `PRT-${String(allPartners.length + 1).padStart(3, "0")}`;
      setAllPartners((prev) => [...prev, { id: newId, ...values }]);
    }
  };

  const handlePartnerDelete = (partner: Partner) => {
    setAllPartners((prev) => prev.filter((p) => p.id !== partner.id));
  };

  return (
    <Box sx={{ minHeight: "100%", pb: 3, overflowX: "hidden" }}>
      <Container maxWidth={false} sx={{ px: { xs: 1.5, sm: 2, md: 3 }, maxWidth: "100%" }}>
        <SecurityPartnersHeader onAddPartner={() => setPartnerModal({ open: true, partner: null, readOnly: false })} />
        <Box sx={{ mt: 2 }}>
          <SecurityPartnersStats />
        </Box>
        <Box sx={{ mt: 2 }}>
          <SecurityPartnersToolbar />
        </Box>
        <Box sx={{ mt: 2 }}>
          <PartnersTable
            partners={partners}
            page={page}
            totalCount={allPartners.length}
            onPageChange={setPage}
            onPartnerView={(partner) => setPartnerModal({ open: true, partner, readOnly: true })}
            onPartnerEdit={(partner) => setPartnerModal({ open: true, partner, readOnly: false })}
            onPartnerDelete={(partner) => setPartnerToDelete(partner)}
            onViewBodyguards={(partner) => navigate(`/security-partners/${partner.id}`)}
          />
        </Box>
        <PartnerManagementModal
          open={partnerModal.open}
          onClose={() => setPartnerModal((prev) => ({ ...prev, open: false }))}
          partner={partnerModal.partner}
          readOnly={partnerModal.readOnly}
          onSave={handleSavePartner}
        />
        <ConfirmDeleteDialog
          open={!!partnerToDelete}
          onClose={() => setPartnerToDelete(null)}
          onConfirm={() => {
            if (partnerToDelete) {
              handlePartnerDelete(partnerToDelete);
              setPartnerToDelete(null);
            }
          }}
          title="Видалити партнера?"
          message="Цю дію не можна скасувати. Запис буде видалено назавжди."
        />
      </Container>
    </Box>
  );
}
