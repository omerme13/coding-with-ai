import { createContext, useContext } from "react";
import type { BoardActions } from "../hooks/useBoard";

export const BoardActionsContext = createContext<BoardActions | null>(null);

export function useBoardActions(): BoardActions {
  const ctx = useContext(BoardActionsContext);
  if (!ctx) throw new Error("useBoardActions must be used inside BoardActionsContext");
  return ctx;
}
