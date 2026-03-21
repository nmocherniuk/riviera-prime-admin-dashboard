import { Button, Typography } from "@mui/material";
import BaseModal from "./BaseModal";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
};

const defaultTitle = "Видалити запис?";
const defaultMessage =
  "Цю дію не можна скасувати. Запис буде видалено назавжди.";
const defaultConfirmLabel = "Видалити";

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = defaultTitle,
  message = defaultMessage,
  confirmLabel = defaultConfirmLabel,
}: Props) {
  return (
    <BaseModal
      open={open}
      onClose={onClose}
      maxWidth="xs"
      title={
        <Typography
          component="span"
          variant="h6"
          sx={{ fontWeight: 700, color: "text.primary" }}
        >
          {title}
        </Typography>
      }
      actions={
        <>
          <Button
            variant="outlined"
            onClick={onClose}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            Скасувати
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            sx={{ borderRadius: 2, textTransform: "none" }}
          >
            {confirmLabel}
          </Button>
        </>
      }
    >
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        {message}
      </Typography>
    </BaseModal>
  );
}
