

export type ScanStatus = "AUTHENTIC" | "SUSPICIOUS" | "COUNTERFEIT";

export interface GeoCoordinate {
  lat: number;
  lng: number;
  country: string;
  city: string;
}

export interface ChainEvent {
  id: string;
  stage: "MANUFACTURE" | "QUALITY_CHECK" | "DISTRIBUTION" | "RETAIL" | "SCAN";
  location: GeoCoordinate;
  timestamp: string; // ISO-8601
  actor: string;
  verified: boolean;
  blockHash: string;
}

export interface RiskFactor {
  code: string;
  description: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  weight: number; // 0–1
}

export interface VertexAIMetadata {
  modelVersion: string;
  inferenceTimeMs: number;
  featureImportance: Record<string, number>;
  anomalyScore: number;
  embeddingDistance: number;
  geminiModel?: string;
}

export interface ScanResult {
  scanId: string;
  productCode: string;
  productName: string;
  brand: string;
  category: string;
  status: ScanStatus;
  confidence: number; // 0–1
  riskFactors: RiskFactor[];
  supplyChain: ChainEvent[];
  scannedAt: string; // ISO-8601
  scanLocation: GeoCoordinate;
  blockchainTxHash: string;
  vertexAI: VertexAIMetadata;
  imageUrl?: string;
}

export interface DailyStat {
  date: string; // YYYY-MM-DD
  authentic: number;
  suspicious: number;
  counterfeit: number;
  total: number;
}

export interface CountryThreat {
  country: string;
  countryCode: string;
  lat: number;
  lng: number;
  counterfeitCount: number;
  suspiciousCount: number;
  totalScans: number;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}

export interface AnalyticsData {
  period: "30d";
  totalScans: number;
  authenticCount: number;
  suspiciousCount: number;
  counterfeitCount: number;
  avgConfidence: number;
  dailyStats: DailyStat[];
  countryThreats: CountryThreat[];
  topRiskCategories: { category: string; count: number }[];
  bigQueryJobId: string;
  queryTimeMs: number;
}

export interface LiveScanEvent {
  scanId: string;
  productCode: string;
  productName: string;
  status: ScanStatus;
  confidence: number;
  country: string;
  city: string;
  scannedAt: string;
}

export interface ProductInfo {
  code: string;
  name: string;
  brand: string;
  category: string;
  sku: string;
  registeredAt: string;
  manufacturingPlant: string;
  batchId: string;
}

export interface ScanRequest {
  code: string;
  imageBase64?: string;
  scannerLocation?: GeoCoordinate;
}

export interface ApiError {
  error: string;
  code: string;
  statusCode: number;
}
