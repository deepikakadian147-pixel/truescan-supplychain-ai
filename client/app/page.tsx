"use client";

import { useState } from "react";

export default function Page() {
  const [status, setStatus] = useState("READY");

  return (
    <div style={{ background: "#050505", color: "#fff", minHeight: "100vh", padding: 20 }}>
      <h1>TRUESCAN SYSTEM</h1>

      <button
        onClick={() => setStatus("SCANNING...")}
        style={{
          background: "#FF5A00",
          color: "#000",
          padding: "10px",
          border: "none",
        }}
      >
        START SCAN
      </button>

      <p style={{ marginTop: 20 }}>STATUS: {status}</p>
    </div>
  );
}
