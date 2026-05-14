import { Select, type SelectProps, MenuItem } from "@mui/material";

const selectSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2 },
};

type FormSelectOption = { value: string; label: string };

type FormSelectProps = Omit<SelectProps, "size"> & {
  size?: "small" | "medium";
  options: FormSelectOption[];
};

export default function FormSelect({
  options,
  sx,
  ...rest
}: FormSelectProps) {
  return (
    <Select
      size="small"
      displayEmpty
      sx={{ ...selectSx, ...(sx as object) }}
      {...rest}
    >
      {options.map((opt) => (
        <MenuItem key={opt.value} value={opt.value}>
          {opt.label}
        </MenuItem>
      ))}
    </Select>
  );
}
