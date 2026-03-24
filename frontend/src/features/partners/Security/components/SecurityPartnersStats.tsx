import { Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import GroupIcon from "@mui/icons-material/Group";
import CardStat from "../../../../components/CardStat";

type Props = {
  totalPartners: number;
  activePartners: number;
  inactivePartners: number;
};

export default function SecurityPartnersStats({
  totalPartners,
  activePartners,
  inactivePartners,
}: Props) {
  const stats = [
    {
      label: "Partners",
      value: String(totalPartners),
      icon: BusinessIcon,
    },
    {
      label: "Active",
      value: String(activePartners),
      icon: GroupIcon,
    },
    {
      label: "Inactive",
      value: String(inactivePartners),
      icon: PersonOffIcon,
    },
  ];

  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "repeat(2, minmax(0, 1fr))",
          md: "repeat(3, minmax(0, 1fr))",
        },
        gap: 2,
      }}
    >
      {stats.map((stat) => (
        <CardStat key={stat.label} stat={stat} />
      ))}
    </Box>
  );
}
