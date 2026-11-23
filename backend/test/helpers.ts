/** Test helpers: fake key + fetch mock that records calls. Never a real key. */
export const FAKE_KEY = "test-key-not-real-000";

export type RecordedCall = { url: string; init: RequestInit | undefined };

export function mockFetch(
  responder: (url: string, init: RequestInit | undefined) => { status?: number; body: unknown },
): { calls: RecordedCall[]; restore: () => void } {
  const original = globalThis.fetch;
  const calls: RecordedCall[] = [];
  globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
    const url = typeof input === "string" ? input : input instanceof URL ? input.toString() : input.url;
    calls.push({ url, init });
    const { status = 200, body } = responder(url, init);
    return new Response(JSON.stringify(body), {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }) as typeof fetch;
  return { calls, restore: () => { globalThis.fetch = original; } };
}

export function header(init: RequestInit | undefined, name: string): string | undefined {
  const h = init?.headers as Record<string, string> | undefined;
  return h?.[name];
}

/** Captures console.error / console.warn output during `fn`. */
export async function captureLogs(fn: () => Promise<unknown>): Promise<string> {
  const lines: string[] = [];
  const { error, warn } = console;
  console.error = (...a: unknown[]) => { lines.push(a.map(String).join(" ")); };
  console.warn = (...a: unknown[]) => { lines.push(a.map(String).join(" ")); };
  try { await fn(); } catch { /* caller asserts separately */ } finally {
    console.error = error;
    console.warn = warn;
  }
  return lines.join("\n");
}
