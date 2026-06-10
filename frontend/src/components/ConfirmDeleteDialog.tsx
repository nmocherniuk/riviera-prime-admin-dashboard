import { Button, Typography } from "@mui/material";
import BaseModal from "./BaseModal";
import { commonContent } from "../content/common";

type Props = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
};

const defaultTitle = commonContent.deleteDialog.title;
const defaultMessage = commonContent.deleteDialog.message;
const defaultConfirmLabel = commonContent.deleteDialog.confirm;

export default function ConfirmDeleteDialog({
  open,
  onClose,
  onConfirm,
  title = defaultTitle,
  message = defaultMessage,
  confirmLabel = defaultConfirmLabel,
  cancelLabel = commonContent.deleteDialog.cancel,
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
            {cancelLabel}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={async () => {
              try {
                await onConfirm();
                onClose();
              } catch (e) {
                console.error(e);
              }
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
