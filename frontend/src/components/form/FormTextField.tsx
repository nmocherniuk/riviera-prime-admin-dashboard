import { TextField, type TextFieldProps } from "@mui/material";
import { getFieldError } from "../../utils/formErrors";
import type { FieldErrors } from "../../utils/formErrors";
import { useFormFieldErrorsContext } from "./FormFieldErrorsProvider";

export type FormTextFieldProps = TextFieldProps & {
  /** Form field key — must match API / form state property name. */
  field: string;
  /** Shown when there is no validation error for this field. */
  hint?: string;
  fieldErrors?: FieldErrors;
};

export default function FormTextField({
  field,
  hint,
  fieldErrors: fieldErrorsProp,
  onChange,
  error: errorProp,
  helperText: helperTextProp,
  ...rest
}: FormTextFieldProps) {
  const ctx = useFormFieldErrorsContext();
  const fieldErrors = fieldErrorsProp ?? ctx?.fieldErrors;
  const fieldError = getFieldError(fieldErrors, field);
  const error = errorProp ?? Boolean(fieldError);
  const helperText = helperTextProp ?? fieldError ?? hint;

  return (
    <TextField
      {...rest}
      error={error}
      helperText={helperText}
      onChange={(e) => {
        ctx?.clearField(field);
        onChange?.(e);
      }}
    />
  );
}
