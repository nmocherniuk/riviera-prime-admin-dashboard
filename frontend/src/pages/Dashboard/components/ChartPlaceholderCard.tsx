import { Box, Paper, Typography } from "@mui/material";

type Props = {
  title: string;
  chartId: string;
  ariaLabel?: string;
};

export default function ChartPlaceholderCard({ title, chartId, ariaLabel }: Props) {
  return (
    <Paper
      elevation={0}
      sx={{
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        overflow: "hidden",
        p: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ fontWeight: 700, color: "text.primary", mb: 2 }}
      >
        {title}
      </Typography>
      <Box
        sx={{
          minHeight: 280,
          borderRadius: 2,
          bgcolor: "rgba(255,255,255,0.02)",
          border: "1px dashed",
          borderColor: "divider",
        }}
        aria-label={ariaLabel ?? `Chart area: ${title}`}
        id={chartId}
      />
    </Paper>
  );
}
