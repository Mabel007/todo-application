# Task Query Keys and TanStack Query Hooks

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-43                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-43 establishes the TanStack Query read layer for the Task domain.

TA-42 created the typed Task domain and reusable read-only Task services.

TA-43 builds on that foundation by introducing:

- centralized Task query keys
- deterministic cache identity
- reusable Task collection queries
- reusable Task-detail queries
- conditional Task-detail fetching
- integration with the existing global QueryClient

The ticket deliberately does not implement presentation components, Task mutations, authentication behavior, or future Task Management functionality.

---

## Architecture

The Task read architecture is now:

```text
Presentation Layer
        ↓
Task Query Hooks
        ↓
Task Query Keys
        ↓
Task Read Services
        ↓
Shared Axios Client
        ↓
Existing Interceptors
        ↓
Logging / API Infrastructure
        ↓
Todo API
```

TA-43 owns the query/cache layer.

It does not own HTTP implementation.

---

## Query Keys

TanStack Query identifies cached server-state data using query keys.

A query key should describe the data represented by a query.

For Task reads, centralized keys prevent individual components from inventing inconsistent cache identities.

The Task query-key factory is defined in:

```text
src/constants/taskQueryKeys.ts
```

---

## Query-Key Factory

The Task query-key factory is:

```ts
import type { TaskReadParams } from "@/types/tasks";

export const taskQueryKeys = {
  all: ["tasks"] as const,

  lists: () => [...taskQueryKeys.all, "list"] as const,

  list: (params: TaskReadParams = {}) => [...taskQueryKeys.lists(), params] as const,

  details: () => [...taskQueryKeys.all, "detail"] as const,

  detail: (id?: string) => [...taskQueryKeys.details(), id] as const,
};
```

---

## Query-Key Hierarchy

The hierarchy is:

```text
["tasks"]
```

All Task queries.

```text
["tasks", "list"]
```

All Task collection queries.

```text
["tasks", "list", params]
```

A specific Task collection query.

```text
["tasks", "detail"]
```

All Task-detail queries.

```text
["tasks", "detail", id]
```

A specific Task-detail query.

---

## Flat Hierarchical Keys

The collection key uses:

```ts
[...taskQueryKeys.lists(), params];
```

rather than:

```ts
[taskQueryKeys.lists(), params];
```

The spread produces the intended flat structure:

```text
["tasks", "list", params]
```

rather than nesting the parent query key.

This keeps the hierarchy predictable and easier to target for future invalidation.

---

## Collection Parameter Identity

TA-42 defines:

```ts
export interface TaskReadParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  sort?: TaskOrder;
  all?: boolean;
}
```

TA-43 includes these parameters in collection query identity:

```ts
taskQueryKeys.list(params);
```

For example:

```ts
taskQueryKeys.list({
  page: 1,
  status: "TODO",
});
```

conceptually produces:

```text
[
  "tasks",
  "list",
  {
    page: 1,
    status: "TODO"
  }
]
```

A different parameter set receives a different cache identity.

For example:

```text
page 1 + TODO
```

and:

```text
page 2 + TODO
```

should not represent the same collection result.

---

## Why Query Parameters Belong in the Key

Consider:

```ts
getTasks({
  page: 1,
  status: "TODO",
});
```

and:

```ts
getTasks({
  page: 1,
  status: "DONE",
});
```

These requests represent different server-state data.

If both used only:

```text
["tasks", "list"]
```

TanStack Query could treat them as the same cached query.

Including the parameter object creates distinct cache identities.

---

## Task Collection Hook

The reusable collection hook is conceptually:

```ts
export const useTasks = (params: TaskReadParams = {}) => {
  return useQuery({
    queryKey: taskQueryKeys.list(params),
    queryFn: () => getTasks(params),
  });
};
```

The hook has two important dependencies:

```text
taskQueryKeys.list(params)
```

for cache identity, and:

```text
getTasks(params)
```

for HTTP behavior.

---

## `useTasks` Responsibilities

`useTasks()` is responsible for:

- accepting Task read parameters
- building the appropriate cache identity
- connecting the query to the Task collection service
- exposing TanStack Query state to future consumers

It is not responsible for:

- constructing Axios requests directly
- normalizing API errors again
- rendering loading UI
- rendering error UI
- rendering Tasks
- building search controls
- building pagination controls

---

## Collection Read Flow

The collection flow is:

```text
TaskReadParams
      ↓
useTasks(params)
      ↓
taskQueryKeys.list(params)
      ↓
getTasks(params)
      ↓
shared apiClient
      ↓
GET /tasks
      ↓
TaskCollectionResponse
```

---

## Task Detail Hook

A separate reusable hook handles individual Task details:

```ts
export const useTask = (id?: string) => {
  const taskId = id?.trim();

  return useQuery({
    queryKey: taskQueryKeys.detail(taskId),
    queryFn: taskId ? () => getTaskById(taskId) : skipToken,
  });
};
```

The collection and detail hooks remain separate because they represent different server-state operations.

---

## Optional Detail IDs

The service created by TA-42 remains strict:

```ts
getTaskById(id: string)
```

The query hook accepts:

```ts
id?: string
```

This is intentional.

Presentation consumers such as route parameters may temporarily provide:

```text
undefined
```

The query layer protects the strict service boundary from being called until a usable ID exists.

---

## ID Normalization

The hook normalizes the ID using:

```ts
const taskId = id?.trim();
```

Therefore the following values are treated as unavailable IDs:

```text
undefined
""
"   "
```

This prevents invalid requests such as:

```text
/tasks/undefined
```

or requests containing only whitespace.

---

## `skipToken`

TA-43 uses TanStack Query v5 `skipToken` for the missing-ID state.

Conceptually:

```ts
queryFn: taskId ? () => getTaskById(taskId) : skipToken;
```

This means the Task-detail query function is unavailable until a valid Task ID exists.

It avoids patterns such as:

```ts
getTaskById(id!);
```

where a non-null assertion would tell TypeScript to assume an ID exists even when runtime conditions may not guarantee it.

---

## Detail Read Flow

The detail flow is:

```text
Task ID
   ↓
useTask(id)
   ↓
trim / normalize ID
   ↓
taskQueryKeys.detail(taskId)
   ↓
valid ID?
   ├── No → skipToken
   │
   └── Yes
        ↓
getTaskById(taskId)
        ↓
shared apiClient
        ↓
GET /tasks/{id}
```

---

## Existing QueryClient

TA-43 reuses the project's existing centralized QueryClient.

The current global query configuration includes:

```ts
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
  },
});
```

TA-43 deliberately does not duplicate these settings inside `useTasks()` or `useTask()`.

For example, the hooks do not repeat:

```ts
retry: false;
```

because that behavior already belongs to the global query configuration.

---

## QueryClient Responsibility

The architecture is:

```text
QueryClient
    ↓
Global query defaults
    ↓
useTasks / useTask
```

Individual hooks should override global defaults only when a feature has a deliberate requirement to do so.

TA-43 does not currently require such overrides.

---

## Retry Behavior

The project's existing global QueryClient defines:

```ts
retry: false;
```

Therefore Task queries inherit that behavior.

TA-43 does not introduce a separate Task-specific retry policy.

This keeps behavior predictable and prevents duplicated configuration.

---

## Refetch Behavior

Task read hooks also inherit:

```ts
refetchOnWindowFocus: false;
refetchOnReconnect: true;
```

These settings are not duplicated in the Task hooks.

---

## Stale Time

TA-43 does not introduce an arbitrary Task-specific `staleTime`.

Without an explicit product or architecture requirement, adding a cache lifetime would introduce behavior not required by the ticket.

Future tickets may define a deliberate Task stale-time strategy if needed.

---

## Task Service Reuse

The collection hook delegates to:

```ts
getTasks(params);
```

The detail hook delegates to:

```ts
getTaskById(taskId);
```

These services were established by TA-42.

The hooks do not call:

```ts
apiClient.get(...)
```

directly.

This preserves the service-layer boundary.

---

## Error Handling

TA-43 does not introduce duplicate API error normalization.

Service failures propagate naturally to TanStack Query.

Conceptually:

```text
Task Service
      ↓
request failure
      ↓
existing API infrastructure
      ↓
query rejected
      ↓
TanStack Query error state
```

The query layer can expose that error state to future presentation components.

---

## Logging

TA-43 does not introduce duplicate logging.

Task services already use the shared Axios client.

The Axios client participates in the centralized logging infrastructure established earlier.

Therefore the read flow already provides appropriate API diagnostics without adding logger calls inside each query hook.

---

## Cache Identity and Duplicate Requests

TanStack Query uses query keys to associate consumers with cached server state.

Consumers using the same deterministic query key can share the same query identity rather than each inventing an unrelated request/cache boundary.

For example:

```ts
useTasks({
  page: 1,
  status: "TODO",
});
```

used by equivalent consumers represents the same logical Task collection query.

A different parameter set represents different server state.

---

## TypeScript Flow

The collection query maintains typed data through the complete read path:

```text
TaskReadParams
      ↓
useTasks
      ↓
getTasks
      ↓
Promise<TaskCollectionResponse>
      ↓
useQuery
      ↓
typed query result
```

The detail query follows:

```text
string | undefined
      ↓
useTask
      ↓
normalized string
      ↓
getTaskById
      ↓
Promise<Task>
      ↓
useQuery
      ↓
typed query result
```

---

## Separation of Responsibilities

| Layer               | Responsibility                          |
| ------------------- | --------------------------------------- |
| Task types          | Define Task domain and read contracts   |
| Task services       | Perform Task HTTP reads                 |
| Task query keys     | Define deterministic cache identity     |
| Task query hooks    | Connect Task services to TanStack Query |
| QueryClient         | Define global server-state behavior     |
| Shared Axios client | Handle common HTTP infrastructure       |
| Future presentation | Render query states and Task data       |

---

## Scope Boundaries

TA-43 intentionally does not implement:

- Task creation mutations
- Task update mutations
- Task deletion mutations
- mutation hooks
- Task list UI
- Task detail UI
- search UI
- filter UI
- sorting controls
- pagination controls
- authentication behavior
- authorization behavior
- protected routes
- custom Task retry policy
- custom Task stale-time policy

Those concerns belong to later Jira tickets.

---

## Validation

Before TA-43 is completed, run:

```bash
npm run lint
npm run format
npm run build
git diff --check
git status --short
```

Repository review should confirm:

- query keys are centralized
- collection keys include `TaskReadParams`
- detail keys include normalized Task IDs
- missing/blank IDs cannot call `getTaskById`
- `useTasks()` delegates to `getTasks()`
- `useTask()` delegates to `getTaskById()`
- no Axios calls exist inside Task hooks
- no duplicate QueryClient exists
- no duplicate API error normalization exists
- no additional logging exists
- no mutation hooks exist
- no TA-44 presentation implementation exists

---

## Relationship to TA-42

TA-42 established:

```text
Task domain
      +
Task read service
```

TA-43 establishes:

```text
Task query identity
      +
Task server-state hooks
```

Combined:

```text
Task Domain
      ↓
Task Read Service
      ↓
Task Query Layer
```

This prepares the project for later presentation functionality without implementing that functionality early.

---

## Future Integration

The intended future read architecture is:

```text
Task Page / Component
        ↓
useTasks / useTask
        ↓
Task Query Keys
        ↓
Task Services
        ↓
Shared Axios Client
        ↓
Todo API
```

Future mutation tickets may later extend the same query-key hierarchy for cache invalidation after create, update, or delete operations.

Mutation behavior is intentionally outside TA-43.

---

## Related Documentation

- Task Domain Models and Read API Services
- Server State
- API Client
- API Error Normalization
- Centralized Application Logging
- Frontend Architecture
- Project Structure
- TA-43 | Task Query Keys & TanStack Query Hooks Study Guide

---

## Future Improvements

Later Task Management tickets may add:

- Task mutation hooks
- cache invalidation
- optimistic updates where appropriate
- Task presentation components
- search/filter controls
- pagination controls
- deliberate feature-specific cache behavior

These will be introduced only by their corresponding Jira tickets.
