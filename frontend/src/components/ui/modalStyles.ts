export const sectionLabelSx = {
  fontWeight: 700,
  fontSize: "0.75rem",
  letterSpacing: 1,
  color: "text.secondary",
  textTransform: "uppercase" as const,
  mb: 1,
  mt: 1.5,
};

export const valueBoxSx = {
  fontWeight: 600,
  color: "text.primary",
  py: 1,
  px: 1.25,
  borderRadius: 2,
  border: 1,
  borderColor: "divider",
  bgcolor: "rgba(255,255,255,0.04)",
  fontSize: "0.875rem",
};

export const fieldLabelSx = {
  fontSize: "0.75rem",
  color: "text.secondary",
  mb: 0.5,
  display: "block",
};

export const modalTextFieldSx = {
  "& .MuiOutlinedInput-root": {
    borderRadius: 2,
    bgcolor: "rgba(255,255,255,0.04)",
    "&:hover": { bgcolor: "rgba(255,255,255,0.06)" },
    "&.Mui-focused": { bgcolor: "rgba(255,255,255,0.06)" },
  },
};
