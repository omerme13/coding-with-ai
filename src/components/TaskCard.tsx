import { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Trash2 } from "lucide-react";
import type { Card, Priority } from "../lib/types";
import { useBoardActions } from "./board-actions";

const PRIORITY_STYLES: Record<Priority, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-green-100 text-green-700",
};

function PriorityBadge({ priority, onClick }: { priority: Priority; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      title="Click to change priority"
      className={`rounded px-1.5 py-0.5 text-xs font-medium capitalize ${PRIORITY_STYLES[priority]}`}
    >
      {priority}
    </button>
  );
}

export function TaskCard({ card }: { card: Card }) {
  const { editCard, deleteCard, cyclePriority } = useBoardActions();
  const [isEditing, setIsEditing] = useState(false);
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card.id,
    disabled: isEditing,
  });

  function finishEdit(value: string) {
    setIsEditing(false);
    const title = value.trim();
    if (title && title !== card.title) editCard(card.id, title);
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`rounded-md border border-gray-200 bg-white p-2 shadow-sm ${
        isDragging ? "opacity-40" : ""
      }`}
    >
      {isEditing ? (
        <input
          autoFocus
          defaultValue={card.title}
          onBlur={(e) => finishEdit(e.currentTarget.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.currentTarget.blur();
            if (e.key === "Escape") setIsEditing(false);
          }}
          className="w-full rounded border border-blue-400 px-1 text-sm outline-none"
        />
      ) : (
        <p onClick={() => setIsEditing(true)} className="cursor-text text-sm break-words">
          {card.title}
        </p>
      )}

      <div className="mt-2 flex items-center justify-between">
        <PriorityBadge priority={card.priority} onClick={() => cyclePriority(card.id)} />
        {confirmingDelete ? (
          <span className="flex items-center gap-1 text-xs">
            Delete?
            <button
              type="button"
              onClick={() => deleteCard(card.id)}
              className="rounded bg-red-600 px-1.5 py-0.5 text-white"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirmingDelete(false)}
              className="rounded bg-gray-200 px-1.5 py-0.5"
            >
              No
            </button>
          </span>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmingDelete(true)}
            aria-label="Delete card"
            className="text-gray-400 hover:text-red-600"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </div>
  );
}

export function CardOverlay({ card }: { card: Card }) {
  return (
    <div className="rotate-2 cursor-grabbing rounded-md border border-blue-300 bg-white p-2 shadow-lg">
      <p className="text-sm break-words">{card.title}</p>
      <div className="mt-2">
        <PriorityBadge priority={card.priority} />
      </div>
    </div>
  );
}
