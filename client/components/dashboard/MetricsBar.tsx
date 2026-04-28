"use client";

// ─────────────────────────────────────────────────────────────────────────────
// MetricsBar — live KPI cards showing aggregate scan statistics
// ─────────────────────────────────────────────────────────────────────────────

import type { AnalyticsData } from "../../types";
import styles from "./MetricsBar.module.css";

interface MetricsBarProps {
  data: AnalyticsData;
}

interface KPICard {
  id: string;
  label: string;
  value: string;
  sub: string;
  accent: "green" | "amber" | "red" | "chrome";
}

function buildCards(data: AnalyticsData): KPICard[] {
  const authPct = ((data.authenticCount / data.totalScans) * 100).toFixed(1);
  const cntfPct = ((data.counterfeitCount / data.totalScans) * 100).toFixed(1);

  return [
    {
      id: "total",
      label: "TOTAL SCANS",
      value: data.totalScans.toLocaleString(),
      sub: "LAST 30 DAYS",
      accent: "chrome",
    },
    {
      id: "authentic",
      label: "AUTHENTIC RATE",
      value: `${authPct}%`,
      sub: `${data.authenticCount.toLocaleString()} VERIFIED`,
      accent: "green",
    },
    {
      id: "suspicious",
      label: "SUSPICIOUS",
      value: data.suspiciousCount.toLocaleString(),
      sub: "FLAGGED FOR REVIEW",
      accent: "amber",
    },
    {
      id: "counterfeit",
      label: "COUNTERFEIT",
      value: data.counterfeitCount.toLocaleString(),
      sub: `${cntfPct}% OF ALL SCANS`,
      accent: "red",
    },
    {
      id: "confidence",
      label: "AVG CONFIDENCE",
      value: `${(data.avgConfidence * 100).toFixed(1)}%`,
      sub: "GEMINI AI SCORE",
      accent: "green",
    },
  ];
}

const ACCENT_STYLE: Record<KPICard["accent"], React.CSSProperties> = {
  green:  { color: "var(--col-green)", borderTopColor: "var(--col-green)" },
  amber:  { color: "var(--col-amber)", borderTopColor: "var(--col-amber)" },
  red:    { color: "var(--col-red)",   borderTopColor: "var(--col-red)" },
  chrome: { color: "var(--col-white)", borderTopColor: "var(--col-chrome-dim)" },
};

export default function MetricsBar({ data }: MetricsBarProps) {
  const cards = buildCards(data);

  return (
    <div className={styles.bar}>
      {cards.map((card) => (
        <div key={card.id} className={styles.card} style={ACCENT_STYLE[card.accent]}>
          <div className={styles.label}>{card.label}</div>
          <div className={styles.value} style={{ color: ACCENT_STYLE[card.accent].color }}>
            {card.value}
          </div>
          <div className={styles.sub}>{card.sub}</div>
        </div>
      ))}
    </div>
  );
}
