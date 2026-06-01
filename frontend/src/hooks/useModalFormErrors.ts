import { useCallback, useState } from "react";
import {
  parseSubmitError,
  type FieldErrors,
} from "../utils/formErrors";

export function useModalFormErrors() {
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  const clearFieldError = useCallback((field: string) => {
    setFieldErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const clearAllFieldErrors = useCallback(() => {
    setFieldErrors({});
  }, []);

  const applySubmitError = useCallback(
    (error: unknown, fallback?: string) => {
      const parsed = parseSubmitError(error, fallback);
      setFieldErrors(parsed.fieldErrors);
      return parsed.message;
    },
    [],
  );

  return {
    fieldErrors,
    clearFieldError,
    clearAllFieldErrors,
    applySubmitError,
  };
}
