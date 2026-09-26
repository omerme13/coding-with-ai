import { useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchBoard, saveBoard } from "../lib/mock-api";
import type { Board, Card, Priority } from "../lib/types";

type Status = "loading" | "error" | "ready";

const NEXT_PRIORITY: Record<Priority, Priority> = {
  high: "medium",
  medium: "low",
  low: "high",
};

function mapCards(board: Board, fn: (card: Card) => Card): Board {
  return board.map((col) => ({ ...col, cards: col.cards.map(fn) }));
}

export function useBoard() {
  const [board, setBoard] = useState<Board>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [savingCount, setSavingCount] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    fetchBoard().then(
      (data) => {
        if (cancelled) return;
        setBoard(data);
        setStatus("ready");
      },
      () => {
        if (!cancelled) setStatus("error");
      },
    );
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function retry() {
    setStatus("loading");
    setAttempt((a) => a + 1);
  }

  function commit(next: Board, prev: Board) {
    setBoard(next);
    setSavingCount((c) => c + 1);
    saveBoard(next)
      .catch(() => {
        setBoard(prev);
        toast.error("Couldn't save your change. It has been reverted.");
      })
      .finally(() => setSavingCount((c) => c - 1));
  }

  function update(fn: (b: Board) => Board) {
    commit(fn(board), board);
  }

  const actions = {
    addCard(columnId: string, title: string) {
      const card: Card = { id: crypto.randomUUID(), title, priority: "medium" };
      update((b) =>
        b.map((col) =>
          col.id === columnId ? { ...col, cards: [...col.cards, card] } : col,
        ),
      );
    },
    editCard(cardId: string, title: string) {
      update((b) => mapCards(b, (c) => (c.id === cardId ? { ...c, title } : c)));
    },
    cyclePriority(cardId: string) {
      update((b) =>
        mapCards(b, (c) =>
          c.id === cardId ? { ...c, priority: NEXT_PRIORITY[c.priority] } : c,
        ),
      );
    },
    deleteCard(cardId: string) {
      update((b) =>
        b.map((col) => ({ ...col, cards: col.cards.filter((c) => c.id !== cardId) })),
      );
    },
  };

  return {
    board,
    status,
    isSaving: savingCount > 0,
    retry,
    setBoardLocal: setBoard,
    commit,
    actions,
  };
}

export type BoardActions = ReturnType<typeof useBoard>["actions"];
