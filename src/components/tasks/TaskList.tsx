import { Link } from "react-router";

import { priorityLabels, statusLabels } from "@/constants/taskLabels";
import { routePaths } from "@/routes/routePaths";
import type { Task } from "@/types/tasks";

interface TaskListProps {
  tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
  return (
    <ul className="divide-divider border-border bg-card divide-y overflow-hidden rounded-xl border">
      {tasks.map((task) => (
        <li key={task.id} className="min-w-0 p-4 sm:p-5">
          <article aria-labelledby={`task-${task.id}-name`}>
            <Link
              to={`${routePaths.tasks}/${task.id}`}
              id={`task-${task.id}-name`}
              className="text-card-foreground text-base font-semibold wrap-break-word"
            >
              {task.name}
            </Link>

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
