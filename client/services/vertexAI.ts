// ─────────────────────────────────────────────────────────────────────────────
// Simulated Vertex AI MLOps Pipeline
// Realistic latency, deterministic confidence by product code, feature extraction
// ─────────────────────────────────────────────────────────────────────────────

import type {
  ScanStatus,
  RiskFactor,
  VertexAIMetadata,
} from "../types";
import { PRODUCT_DB } from "../lib/constants";

const MODEL_VERSION = "truescan-v2.4.1-gemini-vision";

// ── Simulated network + inference latency ───────────────────────────────────
function simulateLatency(minMs: number, maxMs: number): Promise<void> {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Deterministic anomaly score keyed by product code ───────────────────────
function computeAnomalyScore(code: string): number {
  if (!(code in PRODUCT_DB)) {
    // Unknown codes get high anomaly
    return 0.72 + Math.random() * 0.28;
  }
  // Known codes have very low anomaly — seeded by code hash
  let seed = 0;
  for (let i = 0; i < code.length; i++) seed += code.charCodeAt(i);
  const base = (seed % 100) / 1000; // 0.000–0.099
  return base + Math.random() * 0.04;
}

// ── Risk factor extraction ───────────────────────────────────────────────────
function extractRiskFactors(
  code: string,
  anomalyScore: number
): RiskFactor[] {
  const factors: RiskFactor[] = [];
  const isKnown = code in PRODUCT_DB;

  if (!isKnown) {
    factors.push({
      code: "UNKNOWN_SKU",
      description: "Product code not found in authenticated registry",
      severity: "CRITICAL",
      weight: 0.95,
    });
  }

  if (anomalyScore > 0.6) {
    factors.push({
      code: "BARCODE_ANOMALY",
      description: "Barcode encoding pattern deviates from manufacturer spec",
      severity: anomalyScore > 0.8 ? "CRITICAL" : "HIGH",
      weight: anomalyScore,
    });
  }

  if (anomalyScore > 0.45 && anomalyScore <= 0.6) {
    factors.push({
      code: "LABEL_INCONSISTENCY",
      description: "Minor label print quality deviation detected",
      severity: "MEDIUM",
      weight: 0.42,
    });
  }

  if (anomalyScore > 0.3 && anomalyScore <= 0.45) {
    factors.push({
      code: "PACKAGING_DELTA",
      description: "Packaging material signature slightly outside tolerance",
      severity: "LOW",
      weight: 0.28,
    });
  }

  if (factors.length === 0) {
    factors.push({
      code: "ALL_CLEAR",
      description: "All authenticity markers verified — no anomalies detected",
      severity: "LOW",
      weight: 0.02,
    });
  }

  return factors;
}

// ── Status from anomaly score ─────────────────────────────────────────────────
function deriveStatus(anomalyScore: number): ScanStatus {
  if (anomalyScore < 0.3) return "AUTHENTIC";
  if (anomalyScore < 0.65) return "SUSPICIOUS";
  return "COUNTERFEIT";
}

// ── Feature importance map (simulates SHAP values from Vertex AI Explainability)
function buildFeatureImportance(anomalyScore: number): Record<string, number> {
  const base = anomalyScore;
  return {
    barcode_encoding_integrity: parseFloat((0.31 - base * 0.1).toFixed(4)),
    label_print_quality_score: parseFloat((0.24 - base * 0.05).toFixed(4)),
    packaging_material_signature: parseFloat((0.18 + base * 0.04).toFixed(4)),
    hologram_refraction_pattern: parseFloat((0.14 - base * 0.02).toFixed(4)),
    supply_chain_provenance_match: parseFloat((0.13 + base * 0.13).toFixed(4)),
  };
}

// ── Public API ───────────────────────────────────────────────────────────────
export interface VertexAIAnalysis {
  status: ScanStatus;
  confidence: number;
  anomalyScore: number;
  riskFactors: RiskFactor[];
  metadata: VertexAIMetadata;
}

export async function analyzeProduct(
  code: string,
  _imageBase64?: string
): Promise<VertexAIAnalysis> {
  const startMs = Date.now();

  // Simulate Vision API pre-processing + model inference
  await simulateLatency(420, 1100);

  const anomalyScore = computeAnomalyScore(code);
  const status = deriveStatus(anomalyScore);
  const confidence = parseFloat((1 - anomalyScore * 0.85).toFixed(4));
  const riskFactors = extractRiskFactors(code, anomalyScore);
  const inferenceTimeMs = Date.now() - startMs;

  const metadata: VertexAIMetadata = {
    modelVersion: MODEL_VERSION,
    inferenceTimeMs,
    featureImportance: buildFeatureImportance(anomalyScore),
    anomalyScore: parseFloat(anomalyScore.toFixed(4)),
    embeddingDistance: parseFloat((anomalyScore * 1.42).toFixed(4)),
  };

  return { status, confidence, anomalyScore, riskFactors, metadata };
}
