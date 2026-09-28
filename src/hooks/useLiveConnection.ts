import { useCallback, useEffect, useRef, useState } from "react";
import { connectLive } from "../lib/mock-api";
import type { Notification } from "../lib/types";

export type ConnectionStatus = "live" | "reconnecting" | "offline";

const MAX_ATTEMPTS = 4;
const BASE_DELAY_MS = 1000;

/**
 * Owns the live connection lifecycle: connects on mount, reconnects with
 * backoff on drop, and gives up after MAX_ATTEMPTS consecutive failures
 * (status becomes "offline") until the caller invokes `retry()`.
 */
export function useLiveConnection(onEvent: (n: Notification) => void) {
  const [status, setStatus] = useState<ConnectionStatus>("reconnecting");
  const [retryToken, setRetryToken] = useState(0);

  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  useEffect(() => {
    let alive = true;
    let attempts = 0;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let handle: { close(): void } | undefined;

    function connect() {
      if (!alive) return;
      setStatus((s) => (s === "live" ? s : "reconnecting"));

      handle = connectLive(
        (n) => onEventRef.current(n),
        () => {
          if (!alive) return;
          attempts += 1;
          if (attempts >= MAX_ATTEMPTS) {
            setStatus("offline");
            return;
          }
          setStatus("reconnecting");
          const delay = BASE_DELAY_MS * 2 ** (attempts - 1);
          timeoutId = setTimeout(connect, delay);
        },
        () => {
          if (!alive) return;
          attempts = 0;
          setStatus("live");
        },
      );
    }

    connect();

    return () => {
      alive = false;
      clearTimeout(timeoutId);
      handle?.close();
    };
  }, [retryToken]);

  const retry = useCallback(() => {
    setRetryToken((t) => t + 1);
  }, []);

  return { status, retry };
}
