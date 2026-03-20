import { Box } from "@mui/material";
import CardStat from "../../../components/CardStat";

type Stat = {
  label: string;
  value: string;
};

type Props = {
  items: Stat[];
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
        <CardStat key={s.label} stat={s} />
      ))}
    </Box>
  );
}
