import { Inbox, SearchX } from "lucide-react";

export function EmptyState({ variant }: { variant: "no-notifications" | "no-matches" }) {
  const Icon = variant === "no-notifications" ? Inbox : SearchX;
  const title = variant === "no-notifications" ? "You're all caught up" : "No matching notifications";
  const subtitle =
    variant === "no-notifications"
      ? "New notifications will show up here as they arrive."
      : "Try a different filter to see more.";

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-2 px-4 py-12 text-center text-gray-500">
      <Icon className="h-10 w-10 text-gray-300" aria-hidden="true" />
      <p className="text-sm font-medium text-gray-700">{title}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}
