import axios from "axios";
import type { TextFieldProps } from "@mui/material";
import { getApiErrorMessage } from "../api/organizations";

export type FieldErrors = Record<string, string>;

type ZodFlattened = {
  formErrors?: string[];
  fieldErrors?: Record<string, string[]>;
};

const NESTED_DETAIL_KEYS = ["chauffeurDetails", "securityDetails"] as const;

/** Raw field errors from API `errors` (Zod flatten). */
export function parseApiFieldErrors(error: unknown): FieldErrors {
  if (!axios.isAxiosError(error)) return {};

  const errors = error.response?.data?.errors as ZodFlattened | undefined;
  if (!errors) return {};

  const result: FieldErrors = {};

  for (const msg of errors.formErrors ?? []) {
    if (msg) result._form = result._form ? `${result._form}; ${msg}` : msg;
  }

  for (const [key, messages] of Object.entries(errors.fieldErrors ?? {})) {
    if (!messages?.length) continue;
    const text = messages.join("; ");
    result[key] = result[key] ? `${result[key]}; ${text}` : text;
  }

  return result;
}

/** Map API paths to flat form field names used in the UI. */
export function mapApiErrorsToFormFields(apiErrors: FieldErrors): FieldErrors {
  const result: FieldErrors = {};

  for (const [key, message] of Object.entries(apiErrors)) {
    if (key === "_form") {
      result._form = message;
      continue;
    }

    const parts = key.split(".");

    if (
      parts.length >= 2 &&
      NESTED_DETAIL_KEYS.includes(
        parts[0] as (typeof NESTED_DETAIL_KEYS)[number],
      )
    ) {
      const formKey = parts.slice(1).join(".");
      result[formKey] = message;
      continue;
    }

    if (parts[0] === "driverIds" && parts.length === 2) {
      result[`driverBindings.${parts[1]}.driverId`] = message;
      continue;
    }

    result[key] = message;
  }

  return result;
}

export function parseSubmitError(
  error: unknown,
  fallback = "Request failed",
): { message: string; fieldErrors: FieldErrors } {
  const apiErrors = parseApiFieldErrors(error);
  const fieldErrors = mapApiErrorsToFormFields(apiErrors);
  const formLevel = fieldErrors._form;
  const { _form: _, ...fieldOnly } = fieldErrors;

  const message =
    formLevel ||
    getApiErrorMessage(error, fallback) ||
    (Object.keys(fieldOnly).length > 0 ? fallback : fallback);

  return { message, fieldErrors: fieldOnly };
}

export function getFieldError(
  fieldErrors: FieldErrors | undefined,
  field: string,
): string | undefined {
  return fieldErrors?.[field];
}

/** Props for MUI TextField — shows API error or optional hint. */
export function fieldErrorProps(
  fieldErrors: FieldErrors | undefined,
  field: string,
  hint?: string,
): Pick<TextFieldProps, "error" | "helperText"> {
  const msg = getFieldError(fieldErrors, field);
  return {
    error: Boolean(msg),
    helperText: msg ?? hint ?? undefined,
  };
}
