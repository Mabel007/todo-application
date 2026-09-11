import type { Task, TaskPriority, TaskStatus } from "@/types/tasks";

interface TaskListProps {
  tasks: Task[];
}

const statusLabels: Record<TaskStatus, string> = {
  TODO: "To Do",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
  CANCELLED: "Cancelled",
};

const priorityLabels: Record<TaskPriority, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
};

export function TaskList({ tasks }: TaskListProps) {
  if (tasks.length === 0) {
    return <p>No tasks are available.</p>;
  }

  return (
    <ul className="divide-divider border-border bg-card divide-y overflow-hidden rounded-xl border">
      {tasks.map((task) => (
        <li key={task.id} className="min-w-0 p-4 sm:p-5">
          <article aria-labelledby={`task-${task.id}-name`}>
            <h2
              id={`task-${task.id}-name`}
              className="text-card-foreground text-base font-semibold wrap-break-word"
            >
              {task.name}
            </h2>

            {task.description && (
              <p className="text-muted-foreground mt-2 line-clamp-2 text-sm leading-6 wrap-break-word">
                {task.description}
              </p>
            )}

            <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              <div className="flex gap-1.5">
                <dt className="text-muted-foreground">Status:</dt>
                <dd className="text-foreground font-medium">{statusLabels[task.status]}</dd>
              </div>
              <div className="flex gap-1.5">
                <dt className="text-muted-foreground">Priority:</dt>
                <dd className="text-foreground font-medium">{priorityLabels[task.priority]}</dd>
              </div>
            </dl>
          </article>
        </li>
      ))}
    </ul>
  );
}
