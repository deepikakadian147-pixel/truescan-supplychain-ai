"use client";


import type { CountryThreat } from "../../types";
import styles from "./ThreatMap.module.css";

interface ThreatMapProps {
  threats: CountryThreat[];
}

// Simple equirectangular projection: lat/lng → x/y on 1000×500 canvas
function project(lat: number, lng: number): [number, number] {
  const x = ((lng + 180) / 360) * 1000;
  const y = ((90 - lat) / 180) * 500;
  return [x, y];
}

const RISK_COLOR: Record<CountryThreat["riskLevel"], string> = {
  LOW: "rgba(0, 255, 65, 0.7)",
  MEDIUM: "rgba(255, 204, 0, 0.7)",
  HIGH: "rgba(255, 107, 0, 0.7)",
  CRITICAL: "rgba(255, 26, 26, 0.85)",
};

const RISK_PULSE_COLOR: Record<CountryThreat["riskLevel"], string> = {
  LOW: "rgba(0, 255, 65, 0.2)",
  MEDIUM: "rgba(255, 204, 0, 0.2)",
  HIGH: "rgba(255, 107, 0, 0.2)",
  CRITICAL: "rgba(255, 26, 26, 0.2)",
};

export default function ThreatMap({ threats }: ThreatMapProps) {
  const maxCount = Math.max(...threats.map((t) => t.counterfeitCount));

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div className={styles.title}>GLOBAL THREAT INTELLIGENCE</div>
        <div className={styles.sub}>Circle radius ∝ counterfeit scan density</div>
      </div>

      <div className={styles.mapContainer}>
        <svg
          viewBox="0 0 1000 500"
          className={styles.svg}
          aria-label="Global counterfeit threat map"
        >
          {/* Background grid */}
          <rect width="1000" height="500" fill="#060606" />
          {Array.from({ length: 11 }, (_, i) => (
            <line
              key={`h${i}`}
              x1="0" y1={i * 50}
              x2="1000" y2={i * 50}
              stroke="#161616" strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 21 }, (_, i) => (
            <line
              key={`v${i}`}
              x1={i * 50} y1="0"
              x2={i * 50} y2="500"
              stroke="#161616" strokeWidth="0.5"
            />
          ))}

          {/* Threat circles */}
          {threats.map((threat) => {
            const [cx, cy] = project(threat.lat, threat.lng);
            const radius = 8 + (threat.counterfeitCount / maxCount) * 40;
            const color = RISK_COLOR[threat.riskLevel];
            const pulseColor = RISK_PULSE_COLOR[threat.riskLevel];

            return (
              <g key={threat.countryCode}>
                {/* Outer pulse ring */}
                <circle
                  cx={cx} cy={cy}
                  r={radius + 10}
                  fill={pulseColor}
                  className={styles.pulseCircle}
                />
                {/* Core circle */}
                <circle
                  cx={cx} cy={cy}
                  r={radius}
                  fill={color}
                  stroke="rgba(255,255,255,0.15)"
                  strokeWidth="0.5"
                />
                {/* Country label */}
                <text
                  x={cx} y={cy + radius + 14}
                  textAnchor="middle"
                  fontSize="9"
                  fill="#7a7a7a"
                  fontFamily="Geist Mono, monospace"
                  letterSpacing="1"
                >
                  {threat.countryCode}
                </text>
                {/* Count label */}
                <text
                  x={cx} y={cy + 4}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="#000"
                  fontFamily="Geist Mono, monospace"
                >
                  {threat.counterfeitCount > 999
                    ? `${(threat.counterfeitCount / 1000).toFixed(1)}k`
                    : threat.counterfeitCount}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Legend */}
      <div className={styles.legend}>
        {(["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const).map((level) => (
          <div key={level} className={styles.legendItem}>
            <div className={styles.legendDot} style={{ background: RISK_COLOR[level] }} />
            <span>{level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
