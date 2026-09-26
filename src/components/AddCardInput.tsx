import { useState } from "react";
import { useBoardActions } from "./board-actions";

export function AddCardInput({ columnId }: { columnId: string }) {
  const { addCard } = useBoardActions();
  const [title, setTitle] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        const trimmed = title.trim();
        if (!trimmed) return;
        addCard(columnId, trimmed);
        setTitle("");
      }}
    >
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="+ Add a card (Enter)"
        className="w-full rounded-md border border-gray-300 bg-white px-2 py-1.5 text-sm outline-none focus:border-blue-400"
      />
    </form>
  );
}
