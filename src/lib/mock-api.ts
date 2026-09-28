import type { Notification, NotificationType } from "./types";

const TYPES: NotificationType[] = ["info", "warning", "action"];
const MESSAGES = [
  "Deploy to production succeeded",
  "New comment on your PR",
  "Disk usage above 80% on web-2",
  "Weekly report is ready",
  "Someone mentioned you in #general",
  "Certificate expires in 7 days",
  "Build failed on main",
];

function randomNotification(): Notification {
  return {
    id: crypto.randomUUID(),
    type: TYPES[Math.floor(Math.random() * TYPES.length)],
    message: MESSAGES[Math.floor(Math.random() * MESSAGES.length)],
    createdAt: new Date().toISOString(),
    read: false,
  };
}

function daysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
}

const INITIAL: Notification[] = [
  { id: "1", type: "action", message: "Approve pending deploy to production", createdAt: daysAgo(0), read: false },
  { id: "2", type: "info", message: "Weekly report is ready", createdAt: daysAgo(0), read: true },
  { id: "3", type: "warning", message: "Disk usage above 80% on web-2", createdAt: daysAgo(1), read: false },
  { id: "4", type: "info", message: "Someone mentioned you in #general", createdAt: daysAgo(1), read: true },
  { id: "5", type: "info", message: "Build succeeded on main", createdAt: daysAgo(3), read: true },
];

export function fetchNotifications(): Promise<Notification[]> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(INITIAL)), 500);
  });
}

export interface LiveHandle {
  close(): void;
}

/**
 * Simulated live connection. About 40% of connection attempts fail
 * outright (onDisconnect fires before onOpen/any event, simulating a
 * handshake failure). On success: fires onOpen, then pushes a new
 * notification every 3-6s, and roughly every 15-20s it silently drops
 * (fires onDisconnect) — the caller is responsible for detecting this
 * and reconnecting.
 */
export function connectLive(
  onEvent: (n: Notification) => void,
  onDisconnect: () => void,
  onOpen?: () => void,
): LiveHandle {
  let alive = true;

  function scheduleNext() {
    if (!alive) return;
    const delay = 3000 + Math.random() * 3000;
    setTimeout(() => {
      if (!alive) return;
      onEvent(randomNotification());
      scheduleNext();
    }, delay);
  }

  function scheduleDisconnect() {
    if (!alive) return;
    const delay = 15000 + Math.random() * 5000;
    setTimeout(() => {
      if (!alive) return;
      alive = false;
      onDisconnect();
    }, delay);
  }

  const connectDelay = 200 + Math.random() * 300;
  setTimeout(() => {
    if (!alive) return;
    if (Math.random() < 0.4) {
      alive = false;
      onDisconnect();
      return;
    }
    onOpen?.();
    scheduleNext();
    scheduleDisconnect();
  }, connectDelay);

  return {
    close() {
      alive = false;
    },
  };
}

export function markAsRead(id: string): Promise<void> {
  void id;
  return new Promise((resolve) => setTimeout(resolve, 150));
}

export function markAllAsRead(ids: string[]): Promise<void> {
  void ids;
  return new Promise((resolve) => setTimeout(resolve, 150));
}