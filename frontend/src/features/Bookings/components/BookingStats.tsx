import { Box } from "@mui/material";
import CardStat from "../../../components/CardStat";

type StatItem = {
  key: string;
  label: string;
  value: string;
  icon?: React.ComponentType<{ sx?: object }>;
};

type Props = {
  items: StatItem[];
};

export default function BookingStats({ items }: Props) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(4, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {items.map((s) => (
        <CardStat
          key={s.key}
          stat={{ label: s.label, value: s.value, icon: s.icon }}
        />
      ))}
    </Box>
  );
}
