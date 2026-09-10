import { useQuery } from "@tanstack/react-query";

import { taskQueryKeys } from "@/constants/taskQueryKeys";
import { getTasks } from "@/services/taskService";
import type { TaskReadParams } from "@/types/tasks";

// reusable hook for task collections(lists)
export const useTasks = (params: TaskReadParams = {}) => {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => getTasks(params),
  });
};
