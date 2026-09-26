import type { Board } from "./types";

const INITIAL_BOARD: Board = [
  {
    id: "todo",
    title: "To Do",
    cards: [
      { id: "1", title: "Design onboarding flow", priority: "high" },
      { id: "2", title: "Write API docs", priority: "low" },
      { id: "3", title: "Fix footer alignment", priority: "medium" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    cards: [
      { id: "4", title: "Refactor auth middleware", priority: "high" },
      { id: "5", title: "Set up CI pipeline", priority: "medium" },
    ],
  },
  {
    id: "done",
    title: "Done",
    cards: [{ id: "6", title: "Initial project scaffold", priority: "low" }],
  },
];

const DELAY_MS = 600;
const SAVE_FAILURE_RATE = 0.2; // ~1 in 5 saves fails, to exercise rollback
const FETCH_FAILURE_RATE = 0.2; // exercises the error + retry state

export function fetchBoard(): Promise<Board> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < FETCH_FAILURE_RATE) {
        reject(new Error("Failed to load board"));
      } else {
        resolve(structuredClone(INITIAL_BOARD));
      }
    }, DELAY_MS);
  });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars -- mock ignores the payload
export function saveBoard(_board: Board): Promise<void> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() < SAVE_FAILURE_RATE) {
        reject(new Error("Failed to save board"));
      } else {
        resolve();
      }
    }, DELAY_MS);
  });
}