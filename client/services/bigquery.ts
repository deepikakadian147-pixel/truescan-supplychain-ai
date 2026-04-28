

import type { AnalyticsData, DailyStat, CountryThreat } from "../types";

const PROJECT_ID = "truescan-prod-gcp";
const DATASET_ID = "supply_chain_analytics";
const TABLE_ID = "scan_events_v2";

function simulateLatency(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}


function generateDailyStats(): DailyStat[] {
  const stats: DailyStat[] = [];
  const seeds = [
    120, 145, 132, 178, 201, 167, 189, 210, 198, 223, 245, 231,
    267, 289, 312, 298, 334, 356, 378, 345, 389, 401, 423, 412,
    445, 467, 489, 501, 523, 498,
  ];

  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().split("T")[0];
    const base = seeds[29 - i] ?? 200;
    const counterfeit = Math.round(base * 0.03);
    const suspicious = Math.round(base * 0.08);
    const authentic = base - counterfeit - suspicious;
    stats.push({
      date: dateStr,
      authentic,
      suspicious,
      counterfeit,
      total: base,
    });
  }

  return stats;
}


function generateCountryThreats(): CountryThreat[] {
  return [
    {
      country: "India",
      countryCode: "IN",
      lat: 20.5937,
      lng: 78.9629,
      counterfeitCount: 412,
      suspiciousCount: 1243,
      totalScans: 18932,
      riskLevel: "MEDIUM",
    },
    {
      country: "China",
      countryCode: "CN",
      lat: 35.8617,
      lng: 104.1954,
      counterfeitCount: 1823,
      suspiciousCount: 3410,
      totalScans: 24100,
      riskLevel: "HIGH",
    },
    {
      country: "Bangladesh",
      countryCode: "BD",
      lat: 23.685,
      lng: 90.3563,
      counterfeitCount: 234,
      suspiciousCount: 678,
      totalScans: 4320,
      riskLevel: "HIGH",
    },
    {
      country: "Pakistan",
      countryCode: "PK",
      lat: 30.3753,
      lng: 69.3451,
      counterfeitCount: 312,
      suspiciousCount: 812,
      totalScans: 5100,
      riskLevel: "CRITICAL",
    },
    {
      country: "Vietnam",
      countryCode: "VN",
      lat: 14.0583,
      lng: 108.2772,
      counterfeitCount: 189,
      suspiciousCount: 423,
      totalScans: 6800,
      riskLevel: "MEDIUM",
    },
    {
      country: "United Arab Emirates",
      countryCode: "AE",
      lat: 23.4241,
      lng: 53.8478,
      counterfeitCount: 78,
      suspiciousCount: 234,
      totalScans: 3200,
      riskLevel: "MEDIUM",
    },
    {
      country: "United Kingdom",
      countryCode: "GB",
      lat: 55.3781,
      lng: -3.436,
      counterfeitCount: 34,
      suspiciousCount: 89,
      totalScans: 5600,
      riskLevel: "LOW",
    },
    {
      country: "United States",
      countryCode: "US",
      lat: 37.0902,
      lng: -95.7129,
      counterfeitCount: 45,
      suspiciousCount: 123,
      totalScans: 8900,
      riskLevel: "LOW",
    },
  ];
}


export async function getAnalytics(): Promise<AnalyticsData> {
  const startMs = Date.now();


  await simulateLatency(180 + Math.random() * 120);

  const dailyStats = generateDailyStats();
  const countryThreats = generateCountryThreats();

  const totalScans = dailyStats.reduce((s, d) => s + d.total, 0);
  const authenticCount = dailyStats.reduce((s, d) => s + d.authentic, 0);
  const suspiciousCount = dailyStats.reduce((s, d) => s + d.suspicious, 0);
  const counterfeitCount = dailyStats.reduce((s, d) => s + d.counterfeit, 0);

  const queryTimeMs = Date.now() - startMs;

  return {
    period: "30d",
    totalScans,
    authenticCount,
    suspiciousCount,
    counterfeitCount,
    avgConfidence: 0.9247,
    dailyStats,
    countryThreats,
    topRiskCategories: [
      { category: "Personal Care", count: 312 },
      { category: "Snacks & Beverages", count: 287 },
      { category: "Health & Hygiene", count: 245 },
      { category: "Oral Care", count: 198 },
      { category: "Food & Nutrition", count: 167 },
    ],
    bigQueryJobId: `bq-job-${PROJECT_ID}-${DATASET_ID}-${TABLE_ID}-${Date.now()}`,
    queryTimeMs,
  };
}
