import apiClient from "@/api/client";
import { normalizeApiError } from "@/api/errors";
import type { TaskCollectionResponse, Task, TaskReadParams } from "@/types/tasks";

// fetch all task (Paginated task)
export const getTasks = async (params?: TaskReadParams): Promise<TaskCollectionResponse> => {
  try {
    const response = await apiClient.get<TaskCollectionResponse>("/tasks", {
      params,
    });

    return response.data;
  } catch (error: unknown) {
    throw normalizeApiError(error);
  }
};

// fetch a single task
export const getTaskById = async (id: string): Promise<Task> => {
  try {
    const response = await apiClient.get<Task>(`/tasks/${id}`);

    return response.data;
  } catch (error: unknown) {
    throw normalizeApiError(error);
  }
};
