import apiClient from "@/api/client";
import type { TaskCollectionResponse, Task, TaskReadParams } from "@/types/tasks";

// fetch all task (Paginated task)
export const getTasks = async (params?: TaskReadParams): Promise<TaskCollectionResponse> => {
  const response = await apiClient.get<TaskCollectionResponse>("/tasks", {
    params,
  });

  return response.data;
};

// fetch a single task
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${id}`);

  return response.data;
};
