import { Typography, useTheme } from "@mui/material";

type SectionTitleProps = {
  children: string;
};

export default function SectionTitle({ children }: SectionTitleProps) {
  const theme = useTheme();

  return (
    <Typography
      variant="caption"
      sx={{
        textAlign: "start",
        display: "block",
        px: 2,
        py: 1,
        textTransform: "uppercase",
        letterSpacing: 1,
        color: theme.palette.text.secondary,
        fontWeight: 600,
        bgcolor: "background.paper",
      }}
    >
      {children}
    </Typography>
  );
}
