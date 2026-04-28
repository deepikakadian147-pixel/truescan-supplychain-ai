// ─────────────────────────────────────────────────────────────────────────────
// StatusBadge — AUTHENTIC / SUSPICIOUS / COUNTERFEIT badge
// ─────────────────────────────────────────────────────────────────────────────

import type { ScanStatus } from "../../types";

interface StatusBadgeProps {
  status: ScanStatus;
  size?: "sm" | "md" | "lg";
}

const CONFIG: Record<ScanStatus, { label: string; cssClass: string; icon: string }> = {
  AUTHENTIC:   { label: "AUTHENTIC",   cssClass: "badge-authentic",   icon: "✓" },
  SUSPICIOUS:  { label: "SUSPICIOUS",  cssClass: "badge-suspicious",  icon: "!" },
  COUNTERFEIT: { label: "COUNTERFEIT", cssClass: "badge-counterfeit", icon: "✗" },
};

const SIZE_STYLES: Record<"sm" | "md" | "lg", React.CSSProperties> = {
  sm: { fontSize: "0.6rem",  padding: "2px 8px" },
  md: { fontSize: "0.7rem",  padding: "4px 12px" },
  lg: { fontSize: "0.85rem", padding: "6px 16px" },
};

export default function StatusBadge({ status, size = "md" }: StatusBadgeProps) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`badge ${cfg.cssClass}`}
      style={SIZE_STYLES[size]}
      role="status"
      aria-label={`Product status: ${cfg.label}`}
    >
      <span aria-hidden="true">{cfg.icon}</span>
      {cfg.label}
    </span>
  );
}
