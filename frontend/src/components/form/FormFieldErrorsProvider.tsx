import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import type { FieldErrors } from "../../utils/formErrors";

type FormFieldErrorsContextValue = {
  fieldErrors: FieldErrors;
  clearField: (field: string) => void;
};

const FormFieldErrorsContext = createContext<FormFieldErrorsContextValue | null>(
  null,
);

type Props = {
  fieldErrors: FieldErrors;
  onClearField?: (field: string) => void;
  children: ReactNode;
};

export function FormFieldErrorsProvider({
  fieldErrors,
  onClearField,
  children,
}: Props) {
  const clearField = useCallback(
    (field: string) => {
      onClearField?.(field);
    },
    [onClearField],
  );

  const value = useMemo(
    () => ({ fieldErrors, clearField }),
    [fieldErrors, clearField],
  );

  return (
    <FormFieldErrorsContext.Provider value={value}>
      {children}
    </FormFieldErrorsContext.Provider>
  );
}

export function useFormFieldErrorsContext(): FormFieldErrorsContextValue | null {
  return useContext(FormFieldErrorsContext);
}
