import type { ReactNode } from "react";

interface TaskCollectionStateProps {
  title: string;
  description: string;
  role?: "status" | "alert";
  children?: ReactNode;
}

export function TaskCollectionState({
  title,
  description,
  role = "status",
  children,
}: TaskCollectionStateProps) {
  return (
    <div role={role} className="border-border bg-card rounded-xl border px-6 py-10 text-center">
      <p className="text-card-foreground font-medium">{title}</p>
      <p className="text-muted-foreground mt-2 text-sm">{description}</p>

      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
