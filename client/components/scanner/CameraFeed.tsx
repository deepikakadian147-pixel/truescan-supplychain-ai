"use client";


import type { ScannerHookReturn } from "../../types";
import styles from "./CameraFeed.module.css";

interface CameraFeedProps {
  scannerHook: ScannerHookReturn;
}

export default function CameraFeed({ scannerHook }: CameraFeedProps) {
  const { videoRef, canvasRef, state } = scannerHook;

  return (
    <div className={styles.wrapper}>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className={styles.video}
        aria-label="Camera feed for product scanning"
      />
      {/* Hidden canvas used for ZXing frame decoding + image capture */}
      <canvas ref={canvasRef} className={styles.hiddenCanvas} aria-hidden="true" />

      {/* Overlay when camera not active */}
      {state === "IDLE" && (
        <div className={styles.placeholder}>
          <div className={styles.placeholderIcon}>⬡</div>
          <p className={styles.placeholderText}>CAMERA OFFLINE</p>
          <p className={styles.placeholderSub}>Initialise scanner to begin</p>
        </div>
      )}

      {state === "INITIALIZING" && (
        <div className={styles.placeholder}>
          <div className={`${styles.placeholderIcon} ${styles.spin}`}>◉</div>
          <p className={styles.placeholderText}>INITIALIZING...</p>
        </div>
      )}
    </div>
  );
}
