import { useEffect, useState, type ChangeEvent } from "react";
import { useSearchParams } from "react-router";

import { TaskFilters } from "@/components/tasks/TaskFilters";
import { TaskList } from "@/components/tasks/TaskList";
import { TaskSort } from "@/components/tasks/TaskSort";
import { useDebounce } from "@/hooks/useDebounce";
import { useTasks } from "@/hooks/useTasks";
import type { TaskOrder, TaskPriority, TaskStatus } from "@/types/tasks";

const initialTaskParams = {
  limit: 10,
} as const;

const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"];

const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];

const parsePage = (value: string | null): number => {
  if (value === null) {
    return 1;
  }

  const parsedPage = Number(value);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
};

const parseStatus = (value: string | null): TaskStatus | undefined => {
  if (value === null) {
    return undefined;
  }

  return taskStatuses.find((status) => status === value);
};

const parsePriority = (value: string | null): TaskPriority | undefined => {
  if (value === null) {
    return undefined;
  }

  return taskPriorities.find((priority) => priority === value);
};

const parseSort = (value: string | null): TaskOrder => {
  if (value === "ASC" || value === "DESC") {
    return value;
  }

  return "DESC";
};

interface TaskSearchInputProps {
  initialSearch: string;
  onSearchChange: (search: string) => void;
}

function TaskSearchInput({ initialSearch, onSearchChange }: TaskSearchInputProps) {
  const [searchInput, setSearchInput] = useState(initialSearch);
  const debouncedSearch = useDebounce(searchInput, 500);

  useEffect(() => {
    onSearchChange(debouncedSearch.trim());
  }, [debouncedSearch, onSearchChange]);

  const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setSearchInput(event.target.value);
  };

  return (
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
  );
}

export default function Tasks() {
  const [searchParams, setSearchParams] = useSearchParams();

  const page = parsePage(searchParams.get("page"));
  const status = parseStatus(searchParams.get("status"));
  const priority = parsePriority(searchParams.get("priority"));
  const sort = parseSort(searchParams.get("sort"));
  const search = searchParams.get("search")?.trim() ?? "";

  const { data, isError, isLoading, isPlaceholderData } = useTasks({
    page,
    limit: initialTaskParams.limit,
    search: search || undefined,
    status,
    priority,
    sort,
  });

  const hasSearch = search.length > 0;
  const hasNoSearchResults = hasSearch && data?.meta.total === 0;

  const updatePage = (nextPage: number) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextPage <= 1) {
      nextSearchParams.delete("page");
    } else {
      nextSearchParams.set("page", String(nextPage));
    }

    setSearchParams(nextSearchParams);
  };

  const handleSearchChange = (nextSearch: string) => {
    if (nextSearch === search) {
      return;
    }

    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextSearch === "") {
      nextSearchParams.delete("search");
    } else {
      nextSearchParams.set("search", nextSearch);
    }

    nextSearchParams.delete("page");

    setSearchParams(nextSearchParams, { replace: true });
  };

  const handleStatusChange = (nextStatus: TaskStatus | undefined) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextStatus === undefined) {
      nextSearchParams.delete("status");
    } else {
      nextSearchParams.set("status", nextStatus);
    }

    nextSearchParams.delete("page");

    setSearchParams(nextSearchParams);
  };

  const handlePriorityChange = (nextPriority: TaskPriority | undefined) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextPriority === undefined) {
      nextSearchParams.delete("priority");
    } else {
      nextSearchParams.set("priority", nextPriority);
    }

    nextSearchParams.delete("page");

    setSearchParams(nextSearchParams);
  };

  const handleSortChange = (nextSort: TaskOrder) => {
    const nextSearchParams = new URLSearchParams(searchParams);

    if (nextSort === "DESC") {
      nextSearchParams.delete("sort");
    } else {
      nextSearchParams.set("sort", nextSort);
    }

    nextSearchParams.delete("page");

    setSearchParams(nextSearchParams);
  };

  return (
    <section className="mx-auto w-full max-w-7xl space-y-6" aria-labelledby="tasks-heading">
      <header className="space-y-2">
        <h1 id="tasks-heading" className="text-foreground text-3xl font-bold tracking-tight">
          Tasks
        </h1>

        <p className="text-muted-foreground">Review your tasks and their current progress.</p>
      </header>

      <TaskSearchInput key={search} initialSearch={search} onSearchChange={handleSearchChange} />

      <div className="grid gap-4 lg:grid-cols-3">
        <TaskFilters
          status={status}
          priority={priority}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />

        <TaskSort sort={sort} onSortChange={handleSortChange} />
      </div>

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
                  onClick={() => updatePage(Math.max(1, page - 1))}
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
                  onClick={() => updatePage(Math.min(data.meta.totalPages, page + 1))}
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
