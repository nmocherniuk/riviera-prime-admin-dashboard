import {
  Box,
  Button,
  Typography,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useRef, useState } from "react";
import { vehiclesContent } from "../../../content/vehicles";

const MAX_BYTES = 5 * 1024 * 1024;
const ACCEPT = "image/jpeg,image/png,image/webp";

type Props = {
  /** URL already saved on the server (shown when no new file is selected). */
  imageUrl: string;
  /** New file chosen in the form — uploaded only when the user saves the vehicle. */
  pendingFile: File | null;
  readOnly?: boolean;
  onPendingFileChange: (file: File | null) => void;
  onImageUrlChange: (url: string) => void;
  onClearFieldError?: () => void;
};

export default function VehicleImageUpload({
  imageUrl,
  pendingFile,
  readOnly = false,
  onPendingFileChange,
  onImageUrlChange,
  onClearFieldError,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const c = vehiclesContent.modal.fields.image;

  useEffect(() => {
    if (!pendingFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(pendingFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  const displaySrc = previewUrl ?? (imageUrl || null);
  const hasImage = Boolean(displaySrc);

  const handlePick = () => {
    if (readOnly) return;
    inputRef.current?.click();
  };

  const handleFile = (file: File | undefined) => {
    if (!file) return;
    setError(null);

    if (!ACCEPT.split(",").includes(file.type)) {
      setError(c.invalidType);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(c.tooLarge);
      return;
    }

    onPendingFileChange(file);
    onClearFieldError?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemove = () => {
    onPendingFileChange(null);
    onImageUrlChange("");
    setError(null);
    onClearFieldError?.();
    if (inputRef.current) inputRef.current.value = "";
  };

  if (readOnly) {
    if (!imageUrl) {
      return (
        <Typography variant="body2" color="text.secondary">
          —
        </Typography>
      );
    }
    return (
      <Box
        component="img"
        src={imageUrl}
        alt={c.previewAlt}
        sx={{
          width: "100%",
          maxHeight: 220,
          objectFit: "cover",
          borderRadius: 2,
          border: 1,
          borderColor: "divider",
        }}
      />
    );
  }

  return (
    <Box>
      <Typography
        variant="caption"
        sx={{ mb: 0.75, display: "block", fontWeight: 600, color: "text.secondary" }}
      >
        {c.label}
      </Typography>

      {hasImage ? (
        <Box sx={{ mb: 1.5 }}>
          <Box
            component="img"
            src={displaySrc ?? undefined}
            alt={c.previewAlt}
            sx={{
              width: "100%",
              maxHeight: 220,
              objectFit: "cover",
              borderRadius: 2,
              border: 1,
              borderColor: "divider",
            }}
          />
          {pendingFile ? (
            <Typography
              variant="caption"
              sx={{ display: "block", mt: 0.75, color: "warning.main" }}
            >
              {c.pendingSave}
            </Typography>
          ) : null}
        </Box>
      ) : null}

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
        <Button
          variant="outlined"
          size="small"
          startIcon={<CloudUploadIcon />}
          onClick={handlePick}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          {hasImage ? c.replace : c.choose}
        </Button>
        {hasImage ? (
          <Button
            variant="text"
            size="small"
            color="error"
            startIcon={<DeleteOutlineIcon />}
            onClick={handleRemove}
            sx={{ textTransform: "none", fontWeight: 600 }}
          >
            {c.remove}
          </Button>
        ) : null}
      </Box>

      <Typography variant="caption" sx={{ display: "block", mt: 0.75, color: "text.secondary" }}>
        {c.hint}
      </Typography>

      {error ? (
        <Typography variant="caption" sx={{ display: "block", mt: 0.5, color: "error.main" }}>
          {error}
        </Typography>
      ) : null}
    </Box>
  );
}
