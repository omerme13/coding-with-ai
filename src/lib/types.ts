export type NotificationType = "info" | "warning" | "action";

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  createdAt: string; // ISO timestamp
  read: boolean;
}