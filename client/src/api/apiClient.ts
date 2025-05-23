import { API_BASE_URL } from "@/config";

type Primitive = string | number | boolean | null | undefined;

function serializeQuery(
  params: Record<string, Primitive | Primitive[]> = {},
): string {
  const query = Object.entries(params)
    .flatMap(([key, value]) => {
      if (value == null) return [];
      if (Array.isArray(value)) {
        return value.map(
          (v) => `${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`,
        );
      }
      return `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`;
    })
    .join("&");
  return query ? `?${query}` : "";
}

function serializeBody(b: any) {
  if (b instanceof FormData) return b; // keep multipart intact
  if (typeof b === "string" || b == null) return b;
  return JSON.stringify(b); // fallback to JSON
}

export interface FetchWrapperConfig {
  baseUrl?: string;
  defaultHeaders?: HeadersInit;
  getToken?: () => string | null;
}

export function createFetchWrapper(config: FetchWrapperConfig = {}) {
  const baseUrl = config.baseUrl ?? "";
  const defaultHeaders: HeadersInit = config.defaultHeaders ?? {
    "Content-Type": "application/json",
  };
  const getToken = config.getToken;

  interface ReqOpts extends RequestInit {
    responseType?: "json" | "blob" | "arrayBuffer" | "text";
  }
  async function request<T>(
    path: string,
    options: ReqOpts = {},
    params?: Record<string, Primitive | Primitive[]>,
  ): Promise<T> {
    const url = path.startsWith("http") ? path : `${baseUrl}${path}`;
    const fullUrl = params ? `${url}${serializeQuery(params)}` : url;

    const isFormData = options.body instanceof FormData;

    const headers = new Headers({
      ...(!isFormData ? defaultHeaders : {}), // don’t add JSON header for FormData
      ...options.headers,
    });

    const token = getToken?.();
    if (token) headers.set("Authorization", `Bearer ${token}`);

    const response = await fetch(fullUrl, {
      ...options,
      headers,
      body: serializeBody(options.body), // ← use helper
    });
    const contentType = response.headers.get("Content-Type") ?? "";

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Fetch error (${response.status} ${response.statusText})\n${errorText}`,
      );
    }

    // 1️⃣ honor explicit responseType
    switch (options.responseType) {
      case "blob":
        return (await response.blob()) as any;
      case "arrayBuffer":
        return (await response.arrayBuffer()) as any;
      case "text":
        return (await response.text()) as any;
      case "json":
        return (await response.json()) as any;
    }

    if (contentType.includes("application/json")) {
      return (await response.json()) as any;
    } else {
      return (await response.text()) as any;
    }
  }

  return {
    get<T>(
      path: string,
      params?: Record<string, Primitive | Primitive[]> & {
        signal?: AbortSignal;
      },
      opts?: Omit<ReqOpts, "body" | "method">,
    ): Promise<T> {
      const { signal, ...query } = (params as any) ?? {};
      return request<T>(path, { method: "GET", signal, ...opts }, query);
    },
    post<T>(
      path: string,
      body?: any,
      opts?: Omit<RequestInit, "body" | "method">,
    ) {
      return request<T>(path, { method: "POST", body, ...opts });
    },
    put<T>(
      path: string,
      body?: any,
      opts?: Omit<RequestInit, "body" | "method">,
    ) {
      return request<T>(path, { method: "PUT", body, ...opts });
    },
    patch<T>(
      path: string,
      body?: any,
      opts?: Omit<RequestInit, "body" | "method">,
    ) {
      return request<T>(path, { method: "PATCH", body, ...opts });
    },
    delete<T>(
      path: string,
      options?: Omit<RequestInit, "method"> & { signal?: AbortSignal },
    ): Promise<T> {
      return request<T>(path, {
        method: "DELETE",
        signal: options?.signal,
        ...options,
      });
    },
  };
}

const apiClient = createFetchWrapper({
  baseUrl: API_BASE_URL,
  getToken: () => localStorage.getItem("jwt"),
});

export default apiClient;
