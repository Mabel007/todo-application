import { skipToken, useQuery } from "@tanstack/react-query";

import { taskQueryKeys } from "@/constants/taskQueryKeys";
import { getTaskById } from "@/services/taskService";

// reusable hook for a single task's details
export const useTask = (id?: string) => {
  const taskId = id?.trim();

  return useQuery({
    queryKey: taskQueryKeys.detail(taskId),
    queryFn: taskId ? () => getTaskById(taskId) : skipToken,
  });
};
