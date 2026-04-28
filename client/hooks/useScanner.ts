"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useScanner — camera management + ZXing QR/barcode decoding hook
// Handles device stream, frame capture, and code detection
// ─────────────────────────────────────────────────────────────────────────────

import { useCallback, useEffect, useRef, useState } from "react";
import type { ScannerHookReturn, ScannerState } from "../types";

export function useScanner(): ScannerHookReturn {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [state, setState] = useState<ScannerState>("IDLE");
  const [error, setError] = useState<string | null>(null);
  const [decodedCode, setDecodedCode] = useState<string | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setState("IDLE");
  }, []);

  const startCamera = useCallback(async () => {
    setError(null);
    setDecodedCode(null);
    setState("INITIALIZING");

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 },
          advanced: [{ focusMode: "continuous" } as any],
        },
      });
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setState("SCANNING");
    } catch (err) {
      const msg =
        err instanceof Error
          ? err.message
          : "Camera access denied or unavailable";
      setError(msg);
      setState("ERROR");
    }
  }, []);

  // ── Frame capture → base64 ─────────────────────────────────────────────────
  const captureFrame = useCallback((): string | null => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState < 2) return null;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.85).split(",")[1] ?? null;
  }, []);

  // ── ZXing QR/barcode scanning loop ─────────────────────────────────────────
  useEffect(() => {
    if (state !== "SCANNING") return;

    let animFrame: number;
    let active = true;

    // Lazy-load ZXing to keep initial bundle small
    let reader: import("@zxing/library").BrowserMultiFormatReader | null = null;

    const initZXing = async () => {
      try {
        const { BrowserMultiFormatReader, BarcodeFormat, DecodeHintType } = await import("@zxing/library");
        const hints = new Map();
        // Enable common 1D and 2D barcode formats
        hints.set(DecodeHintType.POSSIBLE_FORMATS, [
          BarcodeFormat.QR_CODE,
          BarcodeFormat.DATA_MATRIX,
          BarcodeFormat.EAN_13,
          BarcodeFormat.EAN_8,
          BarcodeFormat.CODE_128,
          BarcodeFormat.CODE_39,
          BarcodeFormat.UPC_A,
          BarcodeFormat.UPC_E,
        ]);
        reader = new BrowserMultiFormatReader(hints);
      } catch {
        // ZXing unavailable — graceful degradation
      }
    };

    const scanFrame = async () => {
      if (!active) return;
      const video = videoRef.current;
      const canvas = canvasRef.current;

      if (reader && video && canvas && video.readyState >= 2) {
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          try {
            const result = await (reader as any).decodeFromCanvas(canvas);
            if (result && active) {
              setDecodedCode(result.getText());
            }
          } catch {
            // No code found in frame — continue scanning
          }
        }
      }

      animFrame = requestAnimationFrame(() => {
        setTimeout(() => { if (active) scanFrame(); }, 300);
      });
    };

    initZXing().then(scanFrame);

    return () => {
      active = false;
      cancelAnimationFrame(animFrame);
    };
  }, [state]);

  // ── Cleanup on unmount ──────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    state,
    error,
    videoRef,
    canvasRef,
    decodedCode,
    captureFrame,
    startCamera,
    stopCamera,
  };
}
