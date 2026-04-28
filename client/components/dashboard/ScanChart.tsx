"use client";

// ─────────────────────────────────────────────────────────────────────────────
// ScanChart — 30-day area chart with Recharts
// Shows authentic / suspicious / counterfeit scan volumes over time
// ─────────────────────────────────────────────────────────────────────────────

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { AnalyticsData } from "../../types";
import styles from "./ScanChart.module.css";

interface ScanChartProps {
  data: AnalyticsData;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}

function CustomTooltip({ active, payload, label }: TooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className={styles.tooltip}>
      <div className={styles.tooltipDate}>{label}</div>
      {payload.map((p) => (
        <div key={p.name} className={styles.tooltipRow}>
          <span style={{ color: p.color }}>{p.name.toUpperCase()}</span>
          <span>{p.value}</span>
        </div>
      ))}
    </div>
  );
}

export default function ScanChart({ data }: ScanChartProps) {
  const chartData = data.dailyStats.map((d) => ({
    date: d.date.slice(5), // MM-DD
    authentic: d.authentic,
    suspicious: d.suspicious,
    counterfeit: d.counterfeit,
  }));

  // Show every 5th tick to avoid crowding
  const ticks = chartData.filter((_, i) => i % 5 === 0).map((d) => d.date);

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>SCAN VOLUME — 30D</div>
          <div className={styles.sub}>BigQuery · supply_chain_analytics.scan_events_v2</div>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendItem} style={{ color: "var(--col-green)" }}>■ AUTHENTIC</span>
          <span className={styles.legendItem} style={{ color: "var(--col-amber)" }}>■ SUSPICIOUS</span>
          <span className={styles.legendItem} style={{ color: "var(--col-red)" }}>■ COUNTERFEIT</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="gradAuth" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00ff41" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#00ff41" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradSusp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff6b00" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#ff6b00" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradCntf" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#ff1a1a" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#ff1a1a" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#1e1e1e" strokeDasharray="2 4" />
          <XAxis
            dataKey="date"
            ticks={ticks}
            tick={{ fill: "#7a7a7a", fontSize: 10, fontFamily: "Geist Mono, monospace" }}
            axisLine={{ stroke: "#2a2a2a" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#7a7a7a", fontSize: 10, fontFamily: "Geist Mono, monospace" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="authentic"   stroke="#00ff41" fill="url(#gradAuth)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="suspicious"  stroke="#ff6b00" fill="url(#gradSusp)" strokeWidth={1.5} dot={false} />
          <Area type="monotone" dataKey="counterfeit" stroke="#ff1a1a" fill="url(#gradCntf)" strokeWidth={1.5} dot={false} />
          <Legend content={() => null} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
