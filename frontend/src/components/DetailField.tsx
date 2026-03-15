import { Typography } from "@mui/material";
import { valueBoxSx, fieldLabelSx } from "./ui/modalStyles";

type Props = {
  label: string;
  value: React.ReactNode;
  /** If true, empty string is shown as "—". Default true. */
  emptyAsDash?: boolean;
};

/**
 * Read-only field block for modals: label above a value box.
 * Replaces repeated Typography (fieldLabelSx) + Typography (valueBoxSx) pairs.
 */
export default function DetailField({ label, value, emptyAsDash = true }: Props) {
  const displayValue =
    value == null || (emptyAsDash && value === "") ? "—" : value;
  return (
    <>
      <Typography component="label" sx={fieldLabelSx}>
        {label}
      </Typography>
      <Typography variant="body2" sx={valueBoxSx}>
        {displayValue}
      </Typography>
    </>
  );
}
