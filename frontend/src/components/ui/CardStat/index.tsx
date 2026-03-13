import { Paper, Typography } from "@mui/material";

type Stat = {
  label: string;
  value: string;
};

export default function CardStat({ stat }: { stat: Stat }) {
  return (
    <Paper
      key={stat.label}
      elevation={0}
      sx={{
        p: 2,
        borderRadius: 3,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
      }}
    >
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontWeight: 700,
        }}
      >
        {stat.label}
      </Typography>
      <Typography
        variant="h6"
        sx={{ mt: 0.5, fontWeight: 800, color: "text.primary" }}
      >
        {stat.value}
      </Typography>
    </Paper>
  );
}
