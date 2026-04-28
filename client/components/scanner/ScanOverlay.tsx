"use client";



import type { ScannerState } from "../../types";
import styles from "./ScanOverlay.module.css";

interface ScanOverlayProps {
  state: ScannerState;
  decodedCode: string | null;
}

export default function ScanOverlay({ state, decodedCode }: ScanOverlayProps) {
  const isActive = state === "SCANNING" || state === "PROCESSING";

  return (
    <div className={styles.overlay} aria-hidden="true">
      {/* Corner brackets */}
      <div className={`${styles.corner} ${styles.cornerTL}`} />
      <div className={`${styles.corner} ${styles.cornerTR}`} />
      <div className={`${styles.corner} ${styles.cornerBL}`} />
      <div className={`${styles.corner} ${styles.cornerBR}`} />

      {/* Scanline */}
      {isActive && <div className={styles.scanline} />}

      {/* Processing spinner */}
      {state === "PROCESSING" && (
        <div className={styles.processingRing}>
          <div className={styles.ring} />
          <span className={styles.processingLabel}>GEMINI AI</span>
        </div>
      )}

      {/* Decoded code readout */}
      {decodedCode && state !== "PROCESSING" && (
        <div className={styles.codeReadout}>
          <span className={styles.codeLabel}>DECODED</span>
          <span className={styles.codeValue}>{decodedCode}</span>
        </div>
      )}

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span
          className={`${styles.statusDot} ${isActive ? styles.dotActive : styles.dotIdle
            }`}
        />
        <span className={styles.statusText}>
          {state === "IDLE" && "SCANNER IDLE"}
          {state === "INITIALIZING" && "INITIALIZING CAMERA..."}
          {state === "SCANNING" && "SCANNING — POINT AT PRODUCT CODE"}
          {state === "PROCESSING" && "GEMINI 2.0 FLASH ANALYZING..."}
          {state === "RESULT" && "ANALYSIS COMPLETE"}
          {state === "ERROR" && "CAMERA ERROR"}
        </span>
        <span className={styles.modelTag}>GEMINI-2.0-FLASH</span>
      </div>
    </div>
  );
}
