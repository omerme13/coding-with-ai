import { RefreshCw, Wifi, WifiOff } from "lucide-react";
import type { ConnectionStatus } from "../hooks/useLiveConnection";

interface FeedHeaderProps {
  unreadCount: number;
  status: ConnectionStatus;
  onRetry: () => void;
  onMarkAllRead: () => void;
}

const STATUS_META: Record<ConnectionStatus, { label: string; className: string; icon: typeof Wifi }> = {
  live: { label: "Live", className: "text-green-700 bg-green-50", icon: Wifi },
  reconnecting: { label: "Reconnecting…", className: "text-amber-700 bg-amber-50", icon: RefreshCw },
  offline: { label: "Offline", className: "text-gray-600 bg-gray-100", icon: WifiOff },
};

export function FeedHeader({ unreadCount, status, onRetry, onMarkAllRead }: FeedHeaderProps) {
  const { label, className, icon: Icon } = STATUS_META[status];

  return (
    <div className="border-b border-gray-200 bg-white px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h1 className="text-lg font-bold text-gray-900">Notifications</h1>
          {unreadCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1.5 text-xs font-semibold text-white">
              {unreadCount > 99 ? "99+" : unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${className}`}
          >
            <Icon className={`h-3.5 w-3.5 ${status === "reconnecting" ? "animate-spin" : ""}`} aria-hidden="true" />
            {label}
          </span>
          {status === "offline" && (
            <button
              type="button"
              onClick={onRetry}
              className="rounded-md bg-gray-900 px-2.5 py-1 text-xs font-medium text-white hover:bg-gray-700"
            >
              Try again
            </button>
          )}
        </div>
      </div>
      <div className="mt-2 flex justify-end">
        <button
          type="button"
          onClick={onMarkAllRead}
          disabled={unreadCount === 0}
          className="text-xs font-medium text-blue-600 hover:text-blue-700 disabled:text-gray-300"
        >
          Mark all as read
        </button>
      </div>
    </div>
  );
}
