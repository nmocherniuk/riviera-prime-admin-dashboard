import {
    type SecurityAgentFormValues,
} from "./securityAgentForm.types";

export function csvToStringArray(s: string | undefined): string[] {
    if (!s?.trim()) return [];
    return s
        .split(/[,;]/)
        .map((x) => x.trim())
        .filter(Boolean);
}

export function languagesFromApi(value: unknown): string[] {
    if (value == null) return [];
    if (Array.isArray(value)) {
        return value.filter((x): x is string => typeof x === "string");
    }
    if (typeof value === "string") {
        return csvToStringArray(value);
    }
    return [];
}

export function specializationsFromApi(value: unknown): string {
    if (value == null) return "";
    if (Array.isArray(value)) return value.join(", ");
    if (typeof value === "string") return value;
    return String(value);
}

export function str(v: unknown): string {
    if (v == null) return "";
    return String(v);
}

export function dateInput(v: unknown): string {
    if (v == null) return "";
    const s = String(v);
    if (s.length >= 10 && /^\d{4}-\d{2}-\d{2}/.test(s)) return s.slice(0, 10);
    return s;
}

export function numStr(v: unknown): string {
    if (v == null || v === "") return "";
    return String(v);
}

export function employmentFromApi(
    v: unknown,
): SecurityAgentFormValues["employmentStatus"] {
    if (v === "EMPLOYEE" || v === "FREELANCE" || v === "SUBCONTRACTOR") return v;
    return "";
}

export function physicalFromApi(v: unknown): SecurityAgentFormValues["physicalLevel"] {
    if (v === "LOW" || v === "MEDIUM" || v === "HIGH") return v;
    return "";
}

export function dateOnlyForApi(v: string | undefined): string | undefined {
    const t = v?.trim();
    if (!t) return undefined;
    return t.slice(0, 10);
}
