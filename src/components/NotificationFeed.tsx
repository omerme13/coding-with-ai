import type { Notification } from "../lib/types";

const placeholder: Notification[] = [
  {
    id: "1",
    type: "info",
    message: "Weekly report is ready",
    createdAt: new Date().toISOString(),
    read: false,
  },
];

export function NotificationFeed() {
  return (
    <div className="mx-auto max-w-md p-4">
      <h1 className="mb-3 text-lg font-bold">Notifications</h1>
      <div className="space-y-2">
        {placeholder.map((n) => (
          <div key={n.id} className="rounded-md border border-gray-200 bg-white p-3 shadow-sm">
            {n.message}
          </div>
        ))}
      </div>
    </div>
  );
}