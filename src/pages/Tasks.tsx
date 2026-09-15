import { useState, type ChangeEvent } from "react";

import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { useDebounce } from "@/hooks/useDebounce";
import { useTasks } from "@/hooks/useTasks";
import type { TaskPriority, TaskStatus } from "@/types/tasks";

const initialTaskParams = {
  limit: 10,
} as const;

export default function Tasks() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [status, setStatus] = useState<TaskStatus | undefined>();
  const [priority, setPriority] = useState<TaskPriority | undefined>();

  const debouncedSearch = useDebounce(searchInput, 500);
  const search = debouncedSearch.trim();

  const { data, isError, isLoading, isPlaceholderData } = useTasks({
    page,
    limit: initialTaskParams.limit,
    search: search || undefined,
    status,
    priority,
  });

  const hasSearch = search.length > 0;
  const hasNoSearchResults = hasSearch && data?.meta.total === 0;

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
    setPage(1);
  };

  const handleStatusChange = (nextStatus: TaskStatus | undefined) => {
    setStatus(nextStatus);
    setPage(1);
  };

  const handlePriorityChange = (nextPriority: TaskPriority | undefined) => {
    setPriority(nextPriority);
    setPage(1);
  };

  return (
    <section className="space-y-6" aria-labelledby="tasks-heading">
      <header className="mb-4 space-y-2">
        <h1 id="tasks-heading" className="text-foreground text-3xl font-bold tracking-tight">
          Tasks
        </h1>

        <p className="text-muted-foreground">Review your tasks and their current progress.</p>
      </header>

      <div className="space-y-2">
        <label htmlFor="task-search" className="text-foreground text-sm font-medium">
          Search tasks
        </label>

        <input
          id="task-search"
          type="search"
          value={searchInput}
          onChange={handleSearchChange}
          placeholder="Search tasks..."
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
        />
      </div>

      <TaskFilters
        status={status}
        priority={priority}
        onStatusChange={handleStatusChange}
        onPriorityChange={handlePriorityChange}
      />

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

          {hasNoSearchResults ? (
            <p role="status" className="text-muted-foreground">
              No tasks match your search.
            </p>
          ) : (
            <>
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
            </>
          )}
        </div>
      )}
    </section>
  );
}
