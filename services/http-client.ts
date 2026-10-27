export type HttpMethod = "DELETE" | "GET" | "PATCH" | "POST" | "PUT";

export interface ApiRequestOptions<TBody = unknown> extends Omit<
  RequestInit,
  "body" | "method"
> {
  readonly body?: TBody;
  readonly method?: HttpMethod;
}

export class ApiError extends Error {
  readonly status: number;
  readonly statusText: string;

  constructor(message: string, response: Response) {
    super(message);
    this.name = "ApiError";
    this.status = response.status;
    this.statusText = response.statusText;
  }
}

/** Executes a JSON API request with typed request and response payloads. */
export async function apiRequest<TResponse, TBody = unknown>(
  endpoint: string,
  options: ApiRequestOptions<TBody> = {}
): Promise<TResponse> {
  const { body, headers, method = "GET", ...requestOptions } = options;
  const response = await fetch(endpoint, {
    ...requestOptions,
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: "application/json",
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...headers
    },
    method
  });

  if (!response.ok) {
    throw new ApiError("The API request failed.", response);
  }

  if (response.status === 204) {
    return undefined as TResponse;
  }

  const text = await response.text();
  if (!text || !text.trim()) {
    return undefined as TResponse;
  }

  try {
    return JSON.parse(text) as TResponse;
  } catch {
    return undefined as TResponse;
  }
}
