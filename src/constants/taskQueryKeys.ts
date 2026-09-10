import type { TaskReadParams } from "@/types/tasks";

// query key factory
export const taskQueryKeys = {
  all: ["tasks"] as const,
  lists: () => [...taskQueryKeys.all, "list"] as const,
  list: (params: TaskReadParams = {}) => [...taskQueryKeys.lists(), params] as const,
  details: () => [...taskQueryKeys.all, "detail"] as const,
  detail: (id?: string) => [...taskQueryKeys.details(), id] as const,
};
