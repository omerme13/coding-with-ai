import { AlertTriangle, Info, Zap } from "lucide-react";
import type { Notification, NotificationType } from "../lib/types";

const TYPE_META: Record<NotificationType, { icon: typeof Info; className: string; label: string }> = {
  info: { icon: Info, className: "text-blue-600", label: "Info" },
  warning: { icon: AlertTriangle, className: "text-amber-600", label: "Warning" },
  action: { icon: Zap, className: "text-rose-600", label: "Action required" },
};

interface NotificationItemProps {
  notification: Notification;
  onRead: (id: string) => void;
}

export function NotificationItem({ notification, onRead }: NotificationItemProps) {
  const { icon: Icon, className, label } = TYPE_META[notification.type];
  const time = new Date(notification.createdAt).toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <button
      type="button"
      onClick={() => onRead(notification.id)}
      aria-label={notification.read ? undefined : `Mark as read: ${notification.message}`}
      className={`flex w-full items-start gap-3 border-l-4 px-4 py-3 text-left transition-colors ${
        notification.read
          ? "border-transparent bg-white hover:bg-gray-50"
          : "border-blue-500 bg-blue-50 hover:bg-blue-100"
      }`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${className}`} aria-hidden="true" />
      <div className="min-w-0 flex-1">
        <p className={`truncate text-sm ${notification.read ? "text-gray-600" : "font-semibold text-gray-900"}`}>
          {notification.message}
        </p>
        <p className="mt-0.5 text-xs text-gray-500">
          {label} · {time}
        </p>
      </div>
      {!notification.read && (
        <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" aria-hidden="true" />
      )}
    </button>
  );
}
