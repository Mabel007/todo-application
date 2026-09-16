import type { TaskOrder } from "@/types/tasks";

import type { ChangeEvent } from "react";

interface TaskSortProps {
  sort: TaskOrder;
  onSortChange: (sort: TaskOrder) => void;
}

export function TaskSort({ sort, onSortChange }: TaskSortProps) {
  const handleSortChange = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    if (value === "ASC" || value === "DESC") {
      onSortChange(value);
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor="task-sort" className="text-foreground text-sm font-medium">
        Sort tasks
      </label>

      <select
        id="task-sort"
        value={sort}
        onChange={handleSortChange}
        className="border-border bg-background text-foreground focus-visible:ring-ring w-full rounded-md border px-3 py-2 text-sm outline-none focus-visible:ring-2"
      >
        <option value="DESC">Descending</option>
        <option value="ASC">Ascending</option>
      </select>
    </div>
  );
}
