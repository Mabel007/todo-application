import { useState } from "react";

import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/useTasks";

const initialTaskParams = {
  limit: 10,
} as const;

export default function Tasks() {
  const [page, setPage] = useState(1);

  const { data, isError, isLoading, isPlaceholderData } = useTasks({
    page,
    limit: initialTaskParams.limit,
  });

  return (
    <section className="space-y-6" aria-labelledby="tasks-heading">
      <header className="space-y-2">
        <h1 id="tasks-heading" className="text-foreground text-3xl font-bold tracking-tight">
          Tasks
        </h1>

        <p className="text-muted-foreground">Review your tasks and their current progress.</p>
      </header>

      {isLoading && <p role="status">Loading tasks…</p>}

      {isError && (
        <p role="alert" className="text-destructive">
          Tasks could not be loaded.
        </p>
      )}

      {data && !isLoading && !isError && (
        <div className="space-y-3">
          <p className="text-muted-foreground text-sm">
            {data.meta.total} {data.meta.total === 1 ? "task" : "tasks"}
          </p>

          <TaskList tasks={data.data} />

          <div className="flex flex-wrap items-center justify-between gap-3 pt-6">
            <button
              type="button"
              disabled={isPlaceholderData || !data.meta.hasPreviousPage}
              onClick={() => setPage((currentPage) => Math.max(1, currentPage - 1))}
              className="border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            <p className="text-muted-foreground text-sm">
              Page {data.meta.page} of {data.meta.totalPages}
            </p>

            <button
              type="button"
              disabled={isPlaceholderData || !data.meta.hasNextPage}
              onClick={() =>
                setPage((currentPage) => Math.min(data.meta.totalPages, currentPage + 1))
              }
              className="border-border bg-background text-foreground hover:bg-primary hover:text-primary-foreground rounded-md border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
