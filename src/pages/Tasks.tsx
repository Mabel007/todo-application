import { TaskList } from "@/components/tasks/TaskList";
import { useTasks } from "@/hooks/useTasks";

const initialTaskParams = {
  page: 1,
  limit: 10,
} as const;

export default function Tasks() {
  const { data, isError, isLoading } = useTasks(initialTaskParams);

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
        </div>
      )}
    </section>
  );
}
