import "server-only";

// Only server code calls the Rust API directly. Browser requests use the
// same-origin Route Handlers because the backend has no CORS layer.
const API_BASE_URL = process.env.API_BASE_URL ?? "http://127.0.0.1:4040";
const REVALIDATE_SECONDS = 60;

type ApiErrorEnvelope = {
  error: {
    code: string;
    message: string;
  };
};

export class ApiRequestError extends Error {
  status: number;
  code: string;

  constructor(status: number, code: string, message: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

function buildUrl(path: string, params?: Record<string, string | string[] | undefined>): URL {
  const url = new URL(path, API_BASE_URL);

  for (const [key, value] of Object.entries(params ?? {})) {
    if (value === undefined) continue;

    if (Array.isArray(value)) {
      for (const item of value) url.searchParams.append(key, item);
    } else {
      url.searchParams.set(key, value);
    }
  }

  return url;
}

export async function apiFetch<T>(
  path: string,
  params?: Record<string, string | string[] | undefined>,
): Promise<T> {
  const response = await fetch(buildUrl(path, params), {
    next: { revalidate: REVALIDATE_SECONDS },
  });

  if (!response.ok) {
    let code = "unknown_error";
    let message = `API request to ${path} failed with status ${response.status}`;

    try {
      const body = (await response.json()) as ApiErrorEnvelope;
      code = body.error?.code ?? code;
      message = body.error?.message ?? message;
    } catch {
      // Non-JSON error bodies keep the default message.
    }

    throw new ApiRequestError(response.status, code, message);
  }

  return response.json() as Promise<T>;
}

export async function apiPost(
  path: string,
  input: unknown,
  failure: { code: string; message: string },
): Promise<void> {
  const response = await fetch(buildUrl(path), {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ApiRequestError(response.status, failure.code, failure.message);
  }
}
