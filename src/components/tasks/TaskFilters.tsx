import { priorityLabels, statusLabels } from "@/constants/taskLabels";
import type { TaskPriority, TaskStatus } from "@/types/tasks";

import type { ChangeEvent } from "react";

interface TaskFiltersProps {
  status: TaskStatus | undefined;
  priority: TaskPriority | undefined;
  onStatusChange: (status: TaskStatus | undefined) => void;
  onPriorityChange: (priority: TaskPriority | undefined) => void;
}

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"];

const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

const isTaskStatus = (value: string): value is TaskStatus => {
  return taskStatuses.some((status) => status === value);
};

const isTaskPriority = (value: string): value is TaskPriority => {
  return taskPriorities.some((priority) => priority === value);
};

export function TaskFilters({
  status,
  priority,
  onStatusChange,
  onPriorityChange,
}: TaskFiltersProps) {
  const handleStatusChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "") {
      onStatusChange(undefined);
      return;
    }

    if (isTaskStatus(value)) {
      onStatusChange(value);
    }
  };

  const handlePriorityChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "") {
      onPriorityChange(undefined);
      return;
    }

    if (isTaskPriority(value)) {
      onPriorityChange(value);
    }
  };

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
      <div className="space-y-2">
        <label htmlFor="task-status-filter" className="text-foreground text-sm font-medium">
          Status
        </label>

        <select
          id="task-status-filter"
          value={status ?? ""}
          onChange={handleStatusChange}
          className="border-border bg-background text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
        >
          <option value="">All statuses</option>

          {taskStatuses.map((taskStatus) => (
            <option key={taskStatus} value={taskStatus}>
              {statusLabels[taskStatus]}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <label htmlFor="task-priority-filter" className="text-foreground text-sm font-medium">
          Priority
        </label>

        <select
          id="task-priority-filter"
          value={priority ?? ""}
          onChange={handlePriorityChange}
          className="border-border bg-background text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
        >
          <option value="">All priorities</option>

          {taskPriorities.map((taskPriority) => (
            <option key={taskPriority} value={taskPriority}>
              {priorityLabels[taskPriority]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
