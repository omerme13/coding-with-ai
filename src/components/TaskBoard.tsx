
// Static placeholder so something renders immediately.

import type { Board } from "../lib/types";

// TODO: replace with real state, wire up fetchBoard()/saveBoard() from lib/mock-api.
const placeholderBoard: Board = [
  {
    id: "todo",
    title: "To Do",
    cards: [{ id: "1", title: "Design onboarding flow", priority: "high" }],
  },
  { id: "in-progress", title: "In Progress", cards: [] },
  { id: "done", title: "Done", cards: [] },
];

export function TaskBoard() {
  const board = placeholderBoard;

  return (
    <div className="flex gap-4 p-4">
      {board.map((column) => (
        <div key={column.id} className="w-72 shrink-0 rounded-lg bg-gray-100 p-3">
          <h2 className="mb-2 font-semibold">{column.title}</h2>
          <div className="space-y-2">
            {column.cards.map((card) => (
              <div key={card.id} className="rounded bg-white p-2 shadow-sm">
                {card.title}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}