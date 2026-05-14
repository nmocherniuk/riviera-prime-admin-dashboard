import { InputAdornment, TextField, type TextFieldProps } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

const inputSx = {
  "& .MuiOutlinedInput-root": { borderRadius: 2 },
};

type SearchFieldProps = Omit<TextFieldProps, "size"> & {
  size?: "small" | "medium";
};

export default function SearchField({
  sx,
  InputProps,
  ...rest
}: SearchFieldProps) {
  return (
    <TextField
      size="small"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" sx={{ color: "text.secondary" }} />
          </InputAdornment>
        ),
        ...InputProps,
      }}
      sx={{ ...inputSx, ...(sx as object) }}
      {...rest}
    />
  );
}
