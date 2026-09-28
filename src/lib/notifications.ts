import type { Notification, NotificationType } from "./types";

export type FilterValue = "all" | "unread" | NotificationType;

export const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "all", label: "All" },
  { value: "unread", label: "Unread" },
  { value: "info", label: "Info" },
  { value: "warning", label: "Warning" },
  { value: "action", label: "Action required" },
];

/**
 * Merge incoming notifications into an existing list, deduping by id.
 * If a notification already exists locally, its local `read` state wins
 * (so a replayed/duplicate push can't resurrect an unread badge on
 * something the user already read). New notifications are added as-is.
 */
export function mergeNotifications(
  existing: Notification[],
  incoming: Notification[],
): Notification[] {
  const byId = new Map(existing.map((n) => [n.id, n]));
  for (const n of incoming) {
    const current = byId.get(n.id);
    byId.set(n.id, current ? { ...n, read: current.read } : n);
  }
  return Array.from(byId.values());
}

export function applyFilter(list: Notification[], filter: FilterValue): Notification[] {
  if (filter === "all") return list;
  if (filter === "unread") return list.filter((n) => !n.read);
  return list.filter((n) => n.type === filter);
}

export function sortByNewest(list: Notification[]): Notification[] {
  return [...list].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export interface NotificationGroup {
  label: string;
  items: Notification[];
}

function dayLabel(iso: string): string {
  const date = new Date(iso);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  if (isSameDay(date, today)) return "Today";
  if (isSameDay(date, yesterday)) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: date.getFullYear() === today.getFullYear() ? undefined : "numeric",
  });
}

/** Groups an already-sorted (newest first) list under day headers. */
export function groupByDay(list: Notification[]): NotificationGroup[] {
  const groups: NotificationGroup[] = [];
  for (const n of list) {
    const label = dayLabel(n.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.label === label) {
      last.items.push(n);
    } else {
      groups.push({ label, items: [n] });
    }
  }
  return groups;
}
