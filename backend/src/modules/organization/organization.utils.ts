export function stripUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
    const out: Partial<T> = {};
    for (const [k, v] of Object.entries(obj)) {
        if (v !== undefined) out[k as keyof T] = v as T[keyof T];
    }
    return out;
}

export function isPrismaUniqueViolation(
    error: unknown,
): error is { code: string; meta?: { target?: unknown } } {
    return (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        (error as { code: string }).code === "P2002"
    );
}
