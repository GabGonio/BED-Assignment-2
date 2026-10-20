/**
 * Represents an item in the system
 */
export interface Item {
  id: string;
  title: string;
  description: string;
  priority: "low" | "medium" | "high" | "critical";
  createdAt: Date;
}