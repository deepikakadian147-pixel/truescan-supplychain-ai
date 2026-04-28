"use client";

// ─────────────────────────────────────────────────────────────────────────────
// LiveFeed — real-time SSE scan event stream
// ─────────────────────────────────────────────────────────────────────────────

import { useLiveFeed } from "../../hooks/useLiveFeed";
import type { LiveScanEvent } from "../../types";
import StatusBadge from "../ui/StatusBadge";
import styles from "./LiveFeed.module.css";

function EventRow({ event, index }: { event: LiveScanEvent; index: number }) {
  const time = new Date(event.scannedAt).toLocaleTimeString("en-IN", {
    hour: "2-digit", minute: "2-digit", second: "2-digit",
  });

  return (
    <div
      className={`${styles.row} ${index === 0 ? styles.rowNew : ""}`}
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <span className={styles.time}>{time}</span>
      <span className={styles.code}>{event.productCode}</span>
      <span className={styles.name}>{event.productName}</span>
      <span className={styles.loc}>{event.city}</span>
      <span className={styles.conf}>{(event.confidence * 100).toFixed(1)}%</span>
      <StatusBadge status={event.status} size="sm" />
    </div>
  );
}

export default function LiveFeed() {
  const { events, connected } = useLiveFeed();

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <div>
          <div className={styles.title}>LIVE SCAN STREAM</div>
          <div className={styles.sub}>Real-time SSE · {events.length} events</div>
        </div>
        <div className={styles.connStatus}>
          <span className={`${styles.connDot} ${connected ? styles.connOnline : styles.connOffline}`} />
          <span className={styles.connLabel}>{connected ? "CONNECTED" : "CONNECTING..."}</span>
        </div>
      </div>

      {/* Column headers */}
      <div className={styles.colHeaders}>
        <span>TIME</span>
        <span>CODE</span>
        <span>PRODUCT</span>
        <span>CITY</span>
        <span>CONF</span>
        <span>STATUS</span>
      </div>

      <div className={styles.feed}>
        {events.length === 0 ? (
          <div className={styles.empty}>
            <span className={styles.emptyDot} />
            WAITING FOR SCAN EVENTS...
          </div>
        ) : (
          events.map((event, i) => (
            <EventRow key={event.scanId} event={event} index={i} />
          ))
        )}
      </div>
    </div>
  );
}
