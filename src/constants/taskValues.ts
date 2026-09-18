import type { TaskPriority, TaskStatus } from "@/types/tasks";

export const taskStatuses = [
  "TODO",
  "IN_PROGRESS",
  "DONE",
  "CANCELLED",
] as const satisfies readonly TaskStatus[];

export const taskPriorities = ["LOW", "MEDIUM", "HIGH"] as const satisfies readonly TaskPriority[];
