import { useRef, useState } from "react";
import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  pointerWithin,
  useSensor,
  useSensors,
  type CollisionDetection,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
  type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Loader2, Search } from "lucide-react";
import { useBoard } from "../hooks/useBoard";
import type { Board, Card, Priority } from "../lib/types";
import { BoardActionsContext } from "./board-actions";
import { BoardColumn } from "./BoardColumn";
import { CardOverlay } from "./TaskCard";

type PriorityFilter = Priority | "all";

// Pointer drags only count as "over" something the pointer is inside, so dropping
// outside every column yields no target and reverts. Keyboard drags have no pointer.
const collisionDetection: CollisionDetection = (args) =>
  args.pointerCoordinates ? pointerWithin(args) : closestCorners(args);

function findColumnId(board: Board, id: UniqueIdentifier): string | undefined {
  if (board.some((col) => col.id === id)) return id as string;
  return board.find((col) => col.cards.some((c) => c.id === id))?.id;
}

export function TaskBoard() {
  const { board, status, isSaving, retry, setBoardLocal, commit, actions } = useBoard();
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>("all");
  const [activeCard, setActiveCard] = useState<Card | null>(null);
  const snapshot = useRef<Board>([]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragStart({ active }: DragStartEvent) {
    snapshot.current = board;
    setActiveCard(board.flatMap((col) => col.cards).find((c) => c.id === active.id) ?? null);
  }

  // Cross-column moves happen live (local only) so the target column opens a gap.
  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return;
    setBoardLocal((b) => {
      const from = findColumnId(b, active.id);
      const to = findColumnId(b, over.id);
      if (!from || !to || from === to) return b;
      const card = b.find((col) => col.id === from)!.cards.find((c) => c.id === active.id)!;
      return b.map((col) => {
        if (col.id === from) return { ...col, cards: col.cards.filter((c) => c.id !== active.id) };
        if (col.id === to) {
          const overIndex = col.cards.findIndex((c) => c.id === over.id);
          const cards = [...col.cards];
          cards.splice(overIndex === -1 ? cards.length : overIndex, 0, card);
          return { ...col, cards };
        }
        return col;
      });
    });
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    const prev = snapshot.current;
    setActiveCard(null);
    if (!over) {
      setBoardLocal(prev);
      return;
    }

    let next = board;
    const colId = findColumnId(board, active.id);
    const col = board.find((c) => c.id === colId);
    if (col && over.id !== active.id) {
      const oldIndex = col.cards.findIndex((c) => c.id === active.id);
      const newIndex = col.cards.findIndex((c) => c.id === over.id);
      if (newIndex !== -1) {
        next = board.map((c) =>
          c.id === colId ? { ...c, cards: arrayMove(c.cards, oldIndex, newIndex) } : c,
        );
      }
    }

    if (JSON.stringify(next) === JSON.stringify(prev)) {
      setBoardLocal(prev);
      return;
    }
    commit(next, prev);
  }

  function handleDragCancel() {
    setBoardLocal(snapshot.current);
    setActiveCard(null);
  }

  const query = search.trim().toLowerCase();
  const matches = (card: Card) =>
    card.title.toLowerCase().includes(query) &&
    (priorityFilter === "all" || card.priority === priorityFilter);

  return (
    <div className="flex h-screen flex-col bg-white text-gray-900">
      <header className="flex flex-wrap items-center gap-3 border-b border-gray-200 p-4">
        <h1 className="mr-auto text-lg font-bold">Task Board</h1>
        {isSaving && (
          <span className="flex items-center gap-1 text-xs text-gray-500">
            <Loader2 size={12} className="animate-spin" /> Saving…
          </span>
        )}
        <label className="flex items-center gap-1 rounded-md border border-gray-300 px-2 py-1">
          <Search size={14} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cards"
            className="w-40 text-sm outline-none"
          />
        </label>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value as PriorityFilter)}
          className="rounded-md border border-gray-300 px-2 py-1 text-sm"
        >
          <option value="all">All priorities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </header>

      <main className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4 md:flex-row md:overflow-x-auto md:overflow-y-hidden">
        {status === "loading" && <BoardSkeleton />}

        {status === "error" && (
          <div className="m-auto text-center">
            <p className="mb-3 text-gray-600">Couldn't load the board.</p>
            <button
              type="button"
              onClick={retry}
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              Retry
            </button>
          </div>
        )}

        {status === "ready" && (
          <BoardActionsContext value={actions}>
            <DndContext
              sensors={sensors}
              collisionDetection={collisionDetection}
              onDragStart={handleDragStart}
              onDragOver={handleDragOver}
              onDragEnd={handleDragEnd}
              onDragCancel={handleDragCancel}
            >
              {board.map((col) => (
                <BoardColumn
                  key={col.id}
                  id={col.id}
                  title={col.title}
                  cards={col.cards.filter(matches)}
                  totalCount={col.cards.length}
                />
              ))}
              <DragOverlay>{activeCard && <CardOverlay card={activeCard} />}</DragOverlay>
            </DndContext>
          </BoardActionsContext>
        )}
      </main>
    </div>
  );
}

function BoardSkeleton() {
  return (
    <>
      {[3, 2, 1].map((count, i) => (
        <div key={i} className="w-full space-y-2 rounded-lg bg-gray-100 p-3 md:w-80 md:shrink-0">
          <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
          {Array.from({ length: count }, (_, j) => (
            <div key={j} className="h-16 animate-pulse rounded-md bg-gray-200" />
          ))}
        </div>
      ))}
    </>
  );
}
