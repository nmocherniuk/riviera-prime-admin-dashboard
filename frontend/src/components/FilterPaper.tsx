import { Paper, type PaperProps } from "@mui/material";

const defaultSx = {
  elevation: 0,
  p: { xs: 1.5, md: 2 },
  borderRadius: { xs: 2, md: 3 },
  border: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
};

type FilterPaperProps = PaperProps;

export default function FilterPaper({ sx, ...rest }: FilterPaperProps) {
  return (
    <Paper
      elevation={0}
      sx={{ ...defaultSx, ...(sx as object) }}
      {...rest}
    />
  );
}
