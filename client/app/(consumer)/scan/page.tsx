"use client";


import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import NavBar from "../../../components/ui/NavBar";
import CameraFeed from "../../../components/scanner/CameraFeed";
import ScanOverlay from "../../../components/scanner/ScanOverlay";
import ResultCard from "../../../components/scanner/ResultCard";
import { useScanner } from "../../../hooks/useScanner";
import { scanProduct } from "../../../services/api";
import type { ScanResult } from "../../../types";
import styles from "./page.module.css";

const PRODUCT_CODES = [
  "TS-HUL-001-2024",
  "TS-PEP-002-2024",
  "TS-MRK-003-2024",
  "TS-COL-004-2024",
  "TS-NES-005-2024",
  "TS-GSK-006-2024",
  "TS-TSC-007-2024",
  "TS-ITC-008-2024",
];

export default function ScanPage() {
  const searchParams = useSearchParams();
  const prefilledCode = searchParams.get("code") ?? "";

  const scanner = useScanner();
  const { state, error, decodedCode, startCamera, stopCamera, captureFrame } = scanner;

  const [manualCode, setManualCode] = useState<string>(prefilledCode);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Pre-fill from URL param
  useEffect(() => {
    if (prefilledCode) setManualCode(prefilledCode);
  }, [prefilledCode]);

  // When ZXing decodes a code, auto-fill and trigger scan
  useEffect(() => {
    if (decodedCode && state === "SCANNING") {
      setManualCode(decodedCode);
    }
  }, [decodedCode, state]);

  const runScan = useCallback(async (code: string) => {
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;

    setIsLoading(true);
    setApiError(null);
    setResult(null);

    // Capture frame if camera is active
    const imageBase64 = captureFrame() ?? undefined;

    try {
      const res = await scanProduct({
        code: trimmed,
        imageBase64,
        scannerLocation: undefined,
      });
      setResult(res);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setIsLoading(false);
    }
  }, [captureFrame]);

  // Auto-scan when ZXing decodes
  useEffect(() => {
    if (decodedCode && !isLoading && !result) {
      void runScan(decodedCode);
    }
  }, [decodedCode, isLoading, result, runScan]);

  const handleReset = () => {
    setResult(null);
    setApiError(null);
    setManualCode("");
  };

  const scannerDisplayState = isLoading ? "PROCESSING" : state;

  return (
    <>
      <NavBar />
      <main className={styles.main}>
        <div className={styles.layout}>
          {/* ── Left panel: scanner ── */}
          <div className={styles.leftPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>PRODUCT SCANNER</div>
              <div className={styles.panelSub}>
                Powered by Gemini 2.0 Flash · ZXing QR/Barcode
              </div>
            </div>

            {/* Camera viewport */}
            <div className={styles.viewport}>
              <CameraFeed scannerHook={scanner} />
              <ScanOverlay state={scannerDisplayState} decodedCode={decodedCode} />
            </div>

            {/* Camera controls */}
            <div className={styles.cameraControls}>
              {state === "IDLE" || state === "ERROR" ? (
                <button
                  className="btn btn-solid"
                  onClick={() => void startCamera()}
                  id="btn-start-camera"
                >
                  ACTIVATE CAMERA
                </button>
              ) : (
                <button
                  className="btn btn-amber"
                  onClick={stopCamera}
                  id="btn-stop-camera"
                >
                  STOP CAMERA
                </button>
              )}
              {error && <p className={styles.cameraError}>{error}</p>}
            </div>

            {/* Manual input */}
            <div className={styles.manualSection}>
              <div className={styles.manualLabel}>MANUAL CODE ENTRY</div>
              <div className={styles.manualRow}>
                <input
                  id="input-product-code"
                  className="input"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") void runScan(manualCode); }}
                  placeholder="e.g. TS-HUL-001-2024"
                  spellCheck={false}
                  autoComplete="off"
                />
                <button
                  className="btn btn-solid"
                  onClick={() => void runScan(manualCode)}
                  disabled={isLoading || !manualCode.trim()}
                  id="btn-manual-scan"
                >
                  {isLoading ? "ANALYZING..." : "SCAN"}
                </button>
              </div>

              {/* Quick-pick codes */}
              <div className={styles.quickPick}>
                <span className={styles.quickLabel}>QUICK PICK:</span>
                {PRODUCT_CODES.slice(0, 4).map((c) => (
                  <button
                    key={c}
                    className={styles.quickBtn}
                    onClick={() => {
                      setManualCode(c);
                      void runScan(c);
                    }}
                  >
                    {c.split("-")[1]}·{c.split("-")[2]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right panel: result ── */}
          <div className={styles.rightPanel}>
            <div className={styles.panelHeader}>
              <div className={styles.panelTitle}>GEMINI AI ANALYSIS</div>
              <div className={styles.panelSub}>
                Supply chain · Risk factors · Blockchain
              </div>
              {result && (
                <button className="btn btn-sm" onClick={handleReset} id="btn-reset">
                  NEW SCAN
                </button>
              )}
            </div>

            {/* Loading state */}
            {isLoading && (
              <div className={styles.loadingState}>
                <div className={styles.loadingRing} />
                <div className={styles.loadingText}>
                  <div className={styles.loadingPrimary}>GEMINI 2.0 FLASH</div>
                  <div className={styles.loadingSub}>Analyzing product authenticity...</div>
                </div>
              </div>
            )}

            {/* Error state */}
            {apiError && !isLoading && (
              <div className={styles.errorState}>
                <div className={styles.errorIcon}>✗</div>
                <div className={styles.errorText}>{apiError}</div>
                <div className={styles.errorSub}>
                  Ensure the server is running on port 5000
                </div>
              </div>
            )}

            {/* Empty state */}
            {!result && !isLoading && !apiError && (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>⬡</div>
                <div className={styles.emptyText}>AWAITING SCAN</div>
                <div className={styles.emptySub}>
                  Activate camera and point at a QR code, or type a product code
                </div>
              </div>
            )}

            {/* Result */}
            {result && !isLoading && <ResultCard result={result} />}
          </div>
        </div>
      </main>
    </>
  );
}
