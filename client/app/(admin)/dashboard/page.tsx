"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Admin Dashboard — analytics, live feed, threat map, risk categories
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useState } from "react";
import NavBar from "../../../components/ui/NavBar";
import MetricsBar from "../../../components/dashboard/MetricsBar";
import ScanChart from "../../../components/dashboard/ScanChart";
import ThreatMap from "../../../components/dashboard/ThreatMap";
import LiveFeed from "../../../components/dashboard/LiveFeed";
import { getAnalytics } from "../../../services/api";
import type { AnalyticsData } from "../../../types";
import styles from "./page.module.css";

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastRefreshed, setLastRefreshed] = useState<string>("");

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAnalytics();
      setAnalytics(data);
      setLastRefreshed(new Date().toLocaleTimeString("en-IN"));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchAnalytics();
    // Auto-refresh every 60 seconds
    const interval = setInterval(() => void fetchAnalytics(), 60_000);
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <NavBar />
      <main className={styles.main}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>ADMIN ANALYTICS DASHBOARD</h1>
            <div className={styles.pageSub}>
              BigQuery · supply_chain_analytics.scan_events_v2 · 30-day window
              {lastRefreshed && ` · Refreshed ${lastRefreshed}`}
              {analytics && (
                <span className={styles.bqJob}>
                  &nbsp;· Job: {analytics.bigQueryJobId.slice(-20)} ({analytics.queryTimeMs}ms)
                </span>
              )}
            </div>
          </div>
          <div className={styles.headerRight}>
            <button
              className="btn btn-sm"
              onClick={() => void fetchAnalytics()}
              disabled={loading}
              id="btn-refresh-analytics"
            >
              {loading ? "LOADING..." : "↻ REFRESH"}
            </button>
          </div>
        </div>

        {error && (
          <div className={styles.errorBanner}>
            ✗ {error} — Ensure the server is running: <code>npm run dev:server</code>
          </div>
        )}

        {/* ── KPI bar ── */}
        {analytics ? (
          <MetricsBar data={analytics} />
        ) : (
          <div className={styles.skeleton} style={{ height: 100 }} />
        )}

        {/* ── Chart + Threat map ── */}
        <div className={styles.grid2}>
          {analytics ? (
            <ScanChart data={analytics} />
          ) : (
            <div className={styles.skeleton} style={{ height: 300 }} />
          )}

          {analytics ? (
            <ThreatMap threats={analytics.countryThreats} />
          ) : (
            <div className={styles.skeleton} style={{ height: 300 }} />
          )}
        </div>

        {/* ── Live feed ── */}
        <LiveFeed />

        {/* ── Risk categories ── */}
        {analytics && (
          <div className={styles.riskSection}>
            <div className={styles.riskTitle}>TOP RISK CATEGORIES — 30D</div>
            <div className={styles.riskBars}>
              {analytics.topRiskCategories.map((cat, i) => {
                const max = analytics.topRiskCategories[0]?.count ?? 1;
                const pct = (cat.count / max) * 100;
                return (
                  <div key={cat.category} className={styles.riskBar}>
                    <span className={styles.riskRank}>#{i + 1}</span>
                    <span className={styles.riskCat}>{cat.category}</span>
                    <div className={styles.riskTrack}>
                      <div
                        className={styles.riskFill}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={styles.riskCount}>{cat.count}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Footer note ── */}
        <div className={styles.footerNote}>
          Data sourced via simulated BigQuery warehouse ·
          AI inference via Google Gemini 2.0 Flash ·
          Google Solution Challenge 2024
        </div>
      </main>
    </>
  );
}
