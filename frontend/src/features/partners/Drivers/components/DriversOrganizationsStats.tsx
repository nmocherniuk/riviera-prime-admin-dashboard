import { Box } from "@mui/material";
import BusinessIcon from "@mui/icons-material/Business";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonOffIcon from "@mui/icons-material/PersonOff";
import CardStat from "../../../../components/CardStat";

type Props = {
  totalOrganizations: number;
  activeOrganizations: number;
  inactiveOrganizations: number;
};

export default function DriversOrganizationsStats({
  totalOrganizations,
  activeOrganizations,
  inactiveOrganizations,
}: Props) {
  const stats = [
    {
      label: "Organizations",
      value: String(totalOrganizations),
      icon: BusinessIcon,
    },
    {
      label: "Active",
      value: String(activeOrganizations),
      icon: GroupsIcon,
    },
    {
      label: "Inactive",
      value: String(inactiveOrganizations),
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
