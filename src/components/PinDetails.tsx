import { Trash2, X } from "lucide-react";
import type { Pin } from "../lib/plan";

type Props = {
  pin: Pin;
  onDelete: () => void;
  onClose: () => void;
};

// Popover content for the active pin.
export default function PinDetails({ pin, onDelete, onClose }: Props) {
  return (
    <div className="flex items-start gap-2">
      <span className="min-w-0 flex-1 break-words">{pin.label}</span>
      <button
        type="button"
        aria-label="Delete pin"
        title="Delete pin"
        onClick={onDelete}
        className="shrink-0 rounded text-slate-400 hover:text-red-600"
      >
        <Trash2 size={14} />
      </button>
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="shrink-0 rounded text-slate-400 hover:text-slate-700"
      >
        <X size={14} />
      </button>
    </div>
  );
}
