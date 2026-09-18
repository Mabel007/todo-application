import { ArrowLeft } from "lucide-react";
import { Link, useParams } from "react-router";

import { TaskCollectionState } from "@/components/tasks/TaskCollectionState";
import { Button } from "@/components/ui/button";
import { priorityLabels, statusLabels } from "@/constants/taskLabels";
import { useTask } from "@/hooks/useTask";
import { routePaths } from "@/routes/routePaths";
import { formatDate } from "@/utils/formatDate";

export const TaskDetails = () => {
  const { taskId } = useParams();
  const normalizedTaskId = taskId?.trim();

  const { data: task, error, isError, isFetching, isLoading, refetch } = useTask(normalizedTaskId);

  const isRetrying = isError && isFetching;

  if (!normalizedTaskId) {
    return (
      <main className="mx-auto max-w-md p-3 pt-5">
        <TaskCollectionState
          role="alert"
          title="Unable to load task"
          description="A valid task identifier is required."
        >
          <Link
            to={routePaths.tasks}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-sm px-1 py-0.5 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Tasks
          </Link>
        </TaskCollectionState>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="mx-auto max-w-md p-3 pt-5">
        <TaskCollectionState
          title="Loading task"
          description="Please wait while the task is being loaded."
        />
      </main>
    );
  }

  if (isError && error.type === "not-found") {
    return (
      <main className="mx-auto max-w-md p-3 pt-5">
        <TaskCollectionState
          title="Task not found"
          description="The task you're looking for could not be found."
        >
          <Link
            to={routePaths.tasks}
            className="text-muted-foreground hover:text-foreground focus-visible:ring-ring inline-flex items-center gap-2 rounded-sm px-1 py-0.5 focus-visible:ring-2 focus-visible:ring-offset-2"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            Back to Tasks
          </Link>
        </TaskCollectionState>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-md p-3 pt-5">
        <TaskCollectionState
          role="alert"
          title="Unable to load task"
          description="We couldn't retrieve this task. Please try again."
        >
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button type="button" onClick={() => void refetch()} disabled={isRetrying}>
              {isRetrying ? "Trying again..." : "Try again"}
            </Button>

            <Link
              to={routePaths.tasks}
              className="text-muted-foreground hover:text-foreground focus-visible:ring-ring rounded-sm px-1 py-0.5 focus-visible:ring-2 focus-visible:ring-offset-2"
            >
              Back to Tasks
            </Link>
          </div>
        </TaskCollectionState>
      </main>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <main className="mx-auto max-w-md p-3 pt-5">
      <Link
        to={routePaths.tasks}
        className="text-muted-foreground hover:text-foreground focus-visible:ring-ring mb-3 inline-flex items-center gap-2 rounded-sm px-1 py-0.5 focus-visible:ring-2 focus-visible:ring-offset-2"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Back to Tasks
      </Link>

      <section className="bg-card text-card-foreground rounded-lg border p-4">
        <div className="mb-6">
          <h1 className="mb-2 text-2xl font-bold">{task.name}</h1>

          {task.description && (
            <p className="text-muted-foreground text-base">{task.description}</p>
          )}
        </div>

        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="text-muted-foreground text-sm">Status</dt>
            <dd className="font-medium">{statusLabels[task.status]}</dd>
          </div>

          <div>
            <dt className="text-muted-foreground text-sm">Priority</dt>
            <dd className="font-medium">{priorityLabels[task.priority]}</dd>
          </div>

          {task.start && (
            <div>
              <dt className="text-muted-foreground text-sm">Start</dt>
              <dd className="font-medium">{formatDate(task.start)}</dd>
            </div>
          )}

          {task.end && (
            <div>
              <dt className="text-muted-foreground text-sm">End</dt>
              <dd className="font-medium">{formatDate(task.end)}</dd>
            </div>
          )}

          {task.createdAt && (
            <div>
              <dt className="text-muted-foreground text-sm">Created At</dt>
              <dd className="font-medium">{formatDate(task.createdAt)}</dd>
            </div>
          )}
        </dl>
      </section>
    </main>
  );
};
