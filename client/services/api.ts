// ─────────────────────────────────────────────────────────────────────────────
// API Service — typed fetch layer to Express backend
// All calls go through Next.js /api/* rewrite → localhost:5000
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ScanRequest,
  ScanResult,
  AnalyticsData,
  LiveScanEvent,
  ProductInfo,
  ApiError,
} from "../types";

const BASE = "/api";

async function apiFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const err: ApiError = await res.json().catch(() => ({
      error: "Network error",
      code: "NETWORK_ERROR",
      statusCode: res.status,
    }));
    throw new Error(err.error);
  }

  return res.json() as Promise<T>;
}

// ── Endpoints ────────────────────────────────────────────────────────────────

export async function scanProduct(req: ScanRequest): Promise<ScanResult> {
  return apiFetch<ScanResult>("/scan", {
    method: "POST",
    body: JSON.stringify(req),
  });
}

export async function getAnalytics(): Promise<AnalyticsData> {
  return apiFetch<AnalyticsData>("/analytics");
}

export async function getProduct(code: string): Promise<ProductInfo> {
  return apiFetch<ProductInfo>(`/product/${encodeURIComponent(code)}`);
}

// ── SSE live feed subscription ───────────────────────────────────────────────
export function subscribeLiveFeed(
  onEvent: (event: LiveScanEvent) => void,
  onError?: (err: Event) => void
): () => void {
  const source = new EventSource(`${BASE}/events`);

  source.addEventListener("scan", (e: MessageEvent) => {
    try {
      const data = JSON.parse(e.data as string) as LiveScanEvent;
      onEvent(data);
    } catch {
      // ignore malformed events
    }
  });

  if (onError) {
    source.addEventListener("error", onError);
  }

  return () => source.close();
}
