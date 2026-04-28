"use client";

import { useState } from "react";
import CameraFeed from "../../../components/scanner/CameraFeed";
import ResultCard from "../../../components/scanner/ResultCard";
import { scanProduct } from "../../../services/api";

export default function ScanPage() {
  const [result, setResult] = useState<any>(null);

  return (
    <div style={{ padding: 20 }}>
      <h1>TRUESCAN SCANNER</h1>

      <CameraFeed />

      <button onClick={async () => {
        const res = await scanProduct();
        setResult(res);
      }}>
        START SCAN
      </button>

      {result && <ResultCard result={result} />}
    </div>
  );
}
