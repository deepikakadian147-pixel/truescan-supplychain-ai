"use client";



import type { ScanResult } from "../../types";
import StatusBadge from "../ui/StatusBadge";
import Terminal from "../ui/Terminal";
import styles from "./ResultCard.module.css";

interface ResultCardProps {
  result: ScanResult;
}

const STAGE_LABELS: Record<string, string> = {
  MANUFACTURE: "MANUFACTURE",
  QUALITY_CHECK: "QA CHECK",
  DISTRIBUTION: "DISTRIBUTION",
  RETAIL: "RETAIL",
  SCAN: "CONSUMER SCAN",
};

export default function ResultCard({ result }: ResultCardProps) {
  const confidencePct = Math.round(result.confidence * 100);
  const anomalyPct = Math.round((result.vertexAI?.anomalyScore ?? 0) * 100);

  const confidenceColor =
    result.status === "AUTHENTIC" ? "var(--col-green)"
      : result.status === "SUSPICIOUS" ? "var(--col-amber)"
        : "var(--col-red)";

  const terminalLines = [
    { prefix: "PRODUCT  ›", text: result.productName, color: "white" as const },
    { prefix: "BRAND    ›", text: result.brand, color: "white" as const },
    { prefix: "CODE     ›", text: result.productCode, color: "green" as const },
    { prefix: "CATEGORY ›", text: result.category, color: "dim" as const },
    { prefix: "SCAN ID  ›", text: result.scanId, color: "dim" as const },
    { prefix: "LOCATION ›", text: `${result.scanLocation.city}, ${result.scanLocation.country}`, color: "dim" as const },
    { prefix: "SCANNED  ›", text: new Date(result.scannedAt).toLocaleString(), color: "dim" as const },
    { prefix: "AI MODEL ›", text: result.vertexAI?.geminiModel ?? "gemini-2.0-flash", color: "green" as const },
    { prefix: "INF TIME ›", text: `${result.vertexAI?.inferenceTimeMs ?? 0}ms`, color: "dim" as const },
  ];

  return (
    <div className={`${styles.card} anim-slide-up`}>
      {/* ── Header ── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <StatusBadge status={result.status} size="lg" />
          <div className={styles.productName}>{result.productName}</div>
        </div>
        <div className={styles.confidenceBlock}>
          <div className={styles.confidenceValue} style={{ color: confidenceColor }}>
            {confidencePct}<span className={styles.pct}>%</span>
          </div>
          <div className={styles.confidenceLabel}>CONFIDENCE</div>
        </div>
      </div>

      {/* ── AI Summary ── */}
      <div className={styles.aiSummary}>
        <span className={styles.aiTag}>⬡ GEMINI AI VERDICT</span>
        <p className={styles.summaryText}>{(result as ScanResult & { aiSummary?: string }).aiSummary ?? "Analysis complete."}</p>
      </div>

      {/* ── Confidence + Anomaly bars ── */}
      <div className={styles.bars}>
        <div className={styles.barRow}>
          <span className={styles.barLabel}>CONFIDENCE</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{ width: `${confidencePct}%`, background: confidenceColor }}
            />
          </div>
          <span className={styles.barValue} style={{ color: confidenceColor }}>
            {confidencePct}%
          </span>
        </div>
        <div className={styles.barRow}>
          <span className={styles.barLabel}>ANOMALY SCORE</span>
          <div className={styles.barTrack}>
            <div
              className={styles.barFill}
              style={{
                width: `${anomalyPct}%`,
                background: anomalyPct > 60 ? "var(--col-red)" : anomalyPct > 30 ? "var(--col-amber)" : "var(--col-green-dim)",
              }}
            />
          </div>
          <span className={styles.barValue}>{anomalyPct}%</span>
        </div>
      </div>

      {/* ── Risk Factors ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>RISK FACTORS</div>
        <div className={styles.riskList}>
          {result.riskFactors.map((rf) => (
            <div
              key={rf.code}
              className={`${styles.riskItem} ${rf.severity === "CRITICAL" ? styles.riskCritical
                  : rf.severity === "HIGH" ? styles.riskHigh
                    : rf.severity === "MEDIUM" ? styles.riskMedium
                      : styles.riskLow
                }`}
            >
              <span className={styles.riskCode}>{rf.code}</span>
              <span className={styles.riskDesc}>{rf.description}</span>
              <span className={styles.riskSev}>{rf.severity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Supply Chain Timeline ── */}
      <div className={styles.section}>
        <div className={styles.sectionTitle}>SUPPLY CHAIN PROVENANCE</div>
        <div className={styles.timeline}>
          {result.supplyChain.map((event, i) => (
            <div key={event.id} className={styles.timelineItem}>
              <div className={styles.timelineLine}>
                <div className={`${styles.timelineDot} ${event.verified ? styles.dotVerified : styles.dotUnverified}`} />
                {i < result.supplyChain.length - 1 && <div className={styles.timelineConnector} />}
              </div>
              <div className={styles.timelineContent}>
                <div className={styles.timelineStage}>{STAGE_LABELS[event.stage] ?? event.stage}</div>
                <div className={styles.timelineActor}>{event.actor}</div>
                <div className={styles.timelineLoc}>{event.location.city}, {event.location.country}</div>
                <div className={styles.timelineHash}>
                  {event.blockHash.slice(0, 20)}...
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Feature Importance ── */}
      {result.vertexAI?.featureImportance && (
        <div className={styles.section}>
          <div className={styles.sectionTitle}>AI FEATURE IMPORTANCE</div>
          <div className={styles.features}>
            {Object.entries(result.vertexAI.featureImportance).map(([key, val]) => (
              <div key={key} className={styles.featureRow}>
                <span className={styles.featureKey}>{key.replace(/_/g, " ")}</span>
                <div className={styles.featureBarTrack}>
                  <div
                    className={styles.featureBarFill}
                    style={{ width: `${Math.round(val * 100)}%` }}
                  />
                </div>
                <span className={styles.featureVal}>{(val * 100).toFixed(1)}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Terminal readout ── */}
      <div className={styles.section}>
        <Terminal title="SCAN METADATA" lines={terminalLines} maxHeight="220px" />
      </div>

      {/* ── Blockchain hash ── */}
      <div className={styles.blockchainRow}>
        <span className={styles.blockchainLabel}>TX HASH</span>
        <code className={styles.blockchainHash}>{result.blockchainTxHash}</code>
      </div>
    </div>
  );
}
