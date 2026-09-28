import { useCallback, useEffect, useState } from "react";
import { fetchNotifications, markAllAsRead, markAsRead } from "../lib/mock-api";
import { applyFilter, groupByDay, mergeNotifications, sortByNewest, type FilterValue } from "../lib/notifications";
import type { Notification } from "../lib/types";
import { useLiveConnection } from "../hooks/useLiveConnection";
import { FeedHeader } from "./FeedHeader";
import { FilterTabs } from "./FilterTabs";
import { NotificationItem } from "./NotificationItem";
import { EmptyState } from "./EmptyState";

export function NotificationFeed() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<FilterValue>("all");

  const onLiveEvent = useCallback((n: Notification) => {
    setNotifications((prev) => mergeNotifications(prev, [n]));
  }, []);

  const { status, retry } = useLiveConnection(onLiveEvent);

  useEffect(() => {
    let cancelled = false;
    fetchNotifications().then((fetched) => {
      if (cancelled) return;
      setNotifications((prev) => mergeNotifications(prev, fetched));
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const markRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    markAsRead(id);
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => {
      const unreadIds = prev.filter((n) => !n.read).map((n) => n.id);
      if (unreadIds.length > 0) markAllAsRead(unreadIds);
      return prev.map((n) => (n.read ? n : { ...n, read: true }));
    });
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = applyFilter(notifications, filter);
  const groups = groupByDay(sortByNewest(filtered));

  return (
    <div className="mx-auto flex h-dvh w-full max-w-md flex-col bg-gray-50">
      <FeedHeader
        unreadCount={unreadCount}
        status={status}
        onRetry={retry}
        onMarkAllRead={markAllRead}
      />
      <FilterTabs value={filter} onChange={setFilter} />

      {groups.length === 0 ? (
        <EmptyState variant={notifications.length === 0 ? "no-notifications" : "no-matches"} />
      ) : (
        <div className="flex-1 overflow-y-auto">
          {groups.map((group) => (
            <div key={group.label}>
              <div className="sticky top-0 bg-gray-50/95 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500 backdrop-blur">
                {group.label}
              </div>
              <div className="divide-y divide-gray-100">
                {group.items.map((n) => (
                  <NotificationItem key={n.id} notification={n} onRead={markRead} />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
