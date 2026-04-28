"use client";

// ─────────────────────────────────────────────────────────────────────────────
// Landing Page — TrueScan hero, product codes, SDG callout, GCP architecture
// ─────────────────────────────────────────────────────────────────────────────

import Link from "next/link";
import NavBar from "../components/ui/NavBar";
import styles from "./page.module.css";

const SAMPLE_CODES = [
  { code: "TS-HUL-001-2024", name: "Dove Beauty Bar 100g",      brand: "HUL",    cat: "Personal Care"    },
  { code: "TS-PEP-002-2024", name: "Lay's Classic Salted 52g",  brand: "PepsiCo",cat: "Snacks"            },
  { code: "TS-MRK-003-2024", name: "Dettol Liquid Soap 200ml",  brand: "RB",     cat: "Health & Hygiene"  },
  { code: "TS-COL-004-2024", name: "Colgate MaxFresh 150g",     brand: "Colgate",cat: "Oral Care"         },
  { code: "TS-NES-005-2024", name: "Maggi 2-Minute Noodles 70g",brand: "Nestlé", cat: "Food & Nutrition"  },
];

const GCP_SERVICES = [
  { name: "Gemini 2.0 Flash",    role: "Multimodal AI analysis of product images + codes",       tag: "AI" },
  { name: "Vertex AI",           role: "MLOps pipeline hosting, model registry, explainability",  tag: "ML" },
  { name: "BigQuery",            role: "Petabyte-scale analytics warehouse for scan events",       tag: "DATA" },
  { name: "Cloud Run",           role: "Serverless container deployment for API server",           tag: "INFRA" },
  { name: "Cloud Storage",       role: "Product image store and batch export",                     tag: "STORAGE" },
  { name: "Firebase Firestore",  role: "Real-time scan event sync for SSE dashboard",             tag: "DB" },
];

const SDG_GOALS = [
  { num: "03", label: "Good Health & Well-Being", detail: "Prevent counterfeit medicines & health products" },
  { num: "12", label: "Responsible Consumption",  detail: "Authenticate FMCG supply chains at scale" },
  { num: "17", label: "Partnerships for Goals",   detail: "Shared verification infrastructure for brands + regulators" },
];

export default function LandingPage() {
  return (
    <>
      <NavBar />
      <main>
        {/* ── Hero ── */}
        <section className={styles.hero}>
          <div className={styles.heroGrid}>
            <div className={styles.heroLeft}>
              <div className={styles.heroTag}>
                <span className={styles.heroDot} />
                GOOGLE SOLUTION CHALLENGE 2024
              </div>
              <h1 className={styles.heroTitle}>
                AI-POWERED<br />
                <span className={styles.heroAccent}>SUPPLY CHAIN</span><br />
                AUTHENTICITY
              </h1>
              <p className={styles.heroDesc}>
                TrueScan uses Google Gemini 2.0 Flash multimodal AI to verify FMCG product 
                authenticity across India&apos;s supply chain in real time — protecting consumers 
                from counterfeit goods worth ₹1.1 lakh crore annually.
              </p>
              <div className={styles.heroCtas}>
                <Link href="/scan" className="btn btn-solid btn-lg">
                  SCAN A PRODUCT
                </Link>
                <Link href="/dashboard" className="btn btn-lg">
                  VIEW DASHBOARD
                </Link>
              </div>
            </div>

            <div className={styles.heroRight}>
              <div className={styles.terminalHero}>
                <div className={styles.terminalBar}>
                  <div className={styles.terminalDots}>
                    <span /><span /><span />
                  </div>
                  <span className={styles.terminalTitle}>TRUESCAN SYSTEM STATUS</span>
                </div>
                <div className={styles.terminalBody}>
                  {[
                    ["MODEL",   "gemini-2.0-flash"],
                    ["BACKEND", "Cloud Run · asia-south1"],
                    ["DB",      "BigQuery · supply_chain_analytics"],
                    ["STREAM",  "SSE · /api/events"],
                    ["STATUS",  "ALL SYSTEMS NOMINAL"],
                    ["SDG",     "03, 12, 17 ADDRESSED"],
                  ].map(([key, val]) => (
                    <div key={key} className={styles.terminalLine}>
                      <span className={styles.terminalKey}>{key}</span>
                      <span className={styles.terminalVal}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── Sample product codes ── */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>REGISTERED PRODUCTS</h2>
              <p className={styles.sectionSub}>Use these codes on the scanner page to test Gemini AI analysis</p>
            </div>
            <div className={styles.codeGrid}>
              {SAMPLE_CODES.map((p) => (
                <Link key={p.code} href={`/scan?code=${p.code}`} className={styles.codeCard}>
                  <div className={styles.codeCardBrand}>{p.brand}</div>
                  <div className={styles.codeCardName}>{p.name}</div>
                  <div className={styles.codeCardCode}>{p.code}</div>
                  <div className={styles.codeCardCat}>{p.cat}</div>
                  <div className={styles.codeCardArrow}>→ SCAN</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── GCP Architecture ── */}
        <section className={styles.section} style={{ background: "var(--col-bg-2)" }}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>GOOGLE CLOUD ARCHITECTURE</h2>
              <p className={styles.sectionSub}>Production services this prototype is designed to deploy on</p>
            </div>
            <div className={styles.gcpGrid}>
              {GCP_SERVICES.map((svc) => (
                <div key={svc.name} className={styles.gcpCard}>
                  <div className={styles.gcpTag}>{svc.tag}</div>
                  <div className={styles.gcpName}>{svc.name}</div>
                  <div className={styles.gcpRole}>{svc.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── SDG callout ── */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>UN SUSTAINABLE DEVELOPMENT GOALS</h2>
              <p className={styles.sectionSub}>TrueScan directly addresses three SDGs</p>
            </div>
            <div className={styles.sdgGrid}>
              {SDG_GOALS.map((sdg) => (
                <div key={sdg.num} className={styles.sdgCard}>
                  <div className={styles.sdgNum}>SDG {sdg.num}</div>
                  <div className={styles.sdgLabel}>{sdg.label}</div>
                  <div className={styles.sdgDetail}>{sdg.detail}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className={styles.footer}>
          <div className="container">
            <span>TRUESCAN © 2024 · Built for Google Solution Challenge</span>
            <span>Powered by Gemini 2.0 Flash · BigQuery · Vertex AI</span>
          </div>
        </footer>
      </main>
    </>
  );
}
