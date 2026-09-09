import type { PaginatedResponse } from "./api";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type TaskOrder = "ASC" | "DESC";

export interface Task {
  id: string;
  name: string;
  description: string | null;
  start: string | null;
  end: string | null;
  duration: number | null;
  priority: TaskPriority;
  status: TaskStatus;
  archived: boolean;
  isDefault: boolean | null;
  parentId: string | null;
  children: string;
  owner: string | null;
  tags: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface TaskReadParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: TaskOrder;
  all?: boolean;
}

export type TaskCollectionResponse = PaginatedResponse<Task>;
