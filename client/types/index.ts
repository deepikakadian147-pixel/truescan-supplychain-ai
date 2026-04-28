// ─────────────────────────────────────────────────────────────────────────────
// Client-side type re-exports + UI-specific interfaces
// ─────────────────────────────────────────────────────────────────────────────

export type {
  ScanStatus,
  ScanResult,
  ScanRequest,
  ChainEvent,
  RiskFactor,
  VertexAIMetadata,
  GeoCoordinate,
  AnalyticsData,
  DailyStat,
  CountryThreat,
  LiveScanEvent,
  ProductInfo,
  ApiError,
} from "../../shared/types";

// UI-only scanner states
export type ScannerState =
  | "IDLE"
  | "INITIALIZING"
  | "SCANNING"
  | "PROCESSING"
  | "RESULT"
  | "ERROR";

export interface ScannerHookReturn {
  state: ScannerState;
  error: string | null;
  videoRef: React.RefObject<HTMLVideoElement | null>;
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  decodedCode: string | null;
  captureFrame: () => string | null;
  startCamera: () => Promise<void>;
  stopCamera: () => void;
}

export interface MetricCard {
  label: string;
  value: string | number;
  delta?: string;
  deltaPositive?: boolean;
  unit?: string;
}
