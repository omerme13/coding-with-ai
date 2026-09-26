export type Priority = "high" | "medium" | "low";

export interface Card {
  id: string;
  title: string;
  priority: Priority;
}

export interface Column {
  id: string;
  title: string;
  cards: Card[];
}

export type Board = Column[];