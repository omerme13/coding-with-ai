import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { Card } from "../lib/types";
import { AddCardInput } from "./AddCardInput";
import { TaskCard } from "./TaskCard";

interface Props {
  id: string;
  title: string;
  cards: Card[];
  totalCount: number;
}

export function BoardColumn({ id, title, cards, totalCount }: Props) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const isFiltered = cards.length !== totalCount;

  return (
    <section
      ref={setNodeRef}
      className={`flex w-full min-h-0 flex-col rounded-lg bg-gray-100 p-3 md:w-80 md:shrink-0 ${
        isOver ? "ring-2 ring-blue-300" : ""
      }`}
    >
      <h2 className="mb-2 flex items-center justify-between font-semibold">
        {title}
        <span className="rounded-full bg-gray-200 px-2 text-xs font-medium text-gray-600">
          {isFiltered ? `${cards.length}/${totalCount}` : totalCount}
        </span>
      </h2>

      <div className="max-h-[60vh] min-h-16 flex-1 space-y-2 overflow-y-auto md:max-h-none">
        <SortableContext items={cards.map((c) => c.id)} strategy={verticalListSortingStrategy}>
          {cards.map((card) => (
            <TaskCard key={card.id} card={card} />
          ))}
        </SortableContext>
        {cards.length === 0 && (
          <p className="py-6 text-center text-sm text-gray-400">
            {totalCount === 0 ? "Nothing here yet. Drop a card or add one below." : "No cards match your filters."}
          </p>
        )}
      </div>

      <div className="mt-2">
        <AddCardInput columnId={id} />
      </div>
    </section>
  );
}
