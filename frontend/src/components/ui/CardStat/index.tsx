import { Paper, Typography } from "@mui/material";

export type Stat = {
  label: string;
  value: string;
  icon?: React.ComponentType<{ sx?: object }>;
};

const paperSx = {
  p: { xs: 1.5, sm: 2 },
  borderRadius: { xs: 2, md: 3 },
  border: 1,
  borderColor: "divider",
  bgcolor: "background.paper",
};

export default function CardStat({ stat }: { stat: Stat }) {
  const Icon = stat.icon;
  return (
    <Paper elevation={0} sx={paperSx}>
      {Icon && (
        <Icon
          sx={{
            color: "primary.main",
            fontSize: { xs: 24, md: 28 },
            mb: 1,
            opacity: 0.9,
          }}
        />
      )}
      <Typography
        variant="caption"
        sx={{
          display: "block",
          color: "text.secondary",
          textTransform: "uppercase",
          letterSpacing: 0.8,
          fontWeight: 700,
          fontSize: { xs: "0.7rem", md: "inherit" },
        }}
      >
        {stat.label}
      </Typography>
      <Typography
        variant="h5"
        sx={{
          mt: 0.5,
          fontWeight: 800,
          color: "text.primary",
          fontSize: { xs: "1.1rem", sm: "1.25rem", md: "1.5rem" },
        }}
      >
        {stat.value}
      </Typography>
    </Paper>
  );
}
