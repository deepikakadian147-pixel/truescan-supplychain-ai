"use client";

// ─────────────────────────────────────────────────────────────────────────────
// useLiveFeed — Server-Sent Events live scan stream hook
// Maintains a rolling buffer of the last N scan events
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from "react";
import type { LiveScanEvent } from "../types";
import { subscribeLiveFeed } from "../services/api";

const MAX_EVENTS = 50;

export function useLiveFeed(): {
  events: LiveScanEvent[];
  connected: boolean;
} {
  const [events, setEvents] = useState<LiveScanEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const unsubRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const unsub = subscribeLiveFeed(
      (event) => {
        setConnected(true);
        setEvents((prev) => [event, ...prev].slice(0, MAX_EVENTS));
      },
      () => {
        setConnected(false);
        // Retry after 3 seconds
        setTimeout(() => {
          if (unsubRef.current) unsubRef.current();
          unsubRef.current = subscribeLiveFeed(
            (e) => setEvents((prev) => [e, ...prev].slice(0, MAX_EVENTS)),
            undefined
          );
        }, 3000);
      }
    );

    unsubRef.current = unsub;
    return () => unsub();
  }, []);

  return { events, connected };
}
