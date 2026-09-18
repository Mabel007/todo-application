# Task Domain Models and Read API Services

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-42                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-42 establishes the typed Task domain and reusable read-only API service layer for the Todo Application.

Before Task data is consumed through TanStack Query hooks or rendered by presentation components, the application needs a stable boundary between the validated backend API contract and frontend feature code.

The implementation therefore introduces:

- Task domain types
- supported Task read-query parameters
- shared paginated Task response typing
- Task collection read service
- Task-detail read service
- integration with the existing shared Axios client

This creates the foundation required for later Task Management Core tickets without implementing those future features early.

---

## Architecture

The Task read architecture is:

```text
Validated Task API Contract
        ↓
src/types/tasks.ts
        ↓
Task Domain Models
        ↓
src/services/taskService.ts
        ↓
Shared Axios Client
        ↓
Existing Axios Interceptors
        ↓
Existing Logging / API Infrastructure
        ↓
Todo API
```

This separation keeps backend HTTP details outside presentation components.

---

## Files

### Task Domain Types

```text
src/types/tasks.ts
```

Responsibilities:

- define Task priority values
- define Task status values
- define Task sorting direction
- model the Task entity
- model supported Task collection query parameters
- connect Task collection responses to shared pagination infrastructure

### Task Read Service

```text
src/services/taskService.ts
```

Responsibilities:

- retrieve Task collections
- retrieve individual Tasks
- use the shared Axios client
- return typed API response data

---

## Task Priority

Task priority is represented using a TypeScript union:

```ts
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
```

Supported values are:

| Value    | Meaning              |
| -------- | -------------------- |
| `LOW`    | Low-priority Task    |
| `MEDIUM` | Medium-priority Task |
| `HIGH`   | High-priority Task   |

Using a union type prevents unsupported priority strings from being passed through typed application code.

For example:

```ts
const priority: TaskPriority = "HIGH";
```

is valid, while an unsupported value is rejected by TypeScript.

---

## Task Status

Task status is represented as:

```ts
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";
```

Supported values are:

| Value         | Meaning                       |
| ------------- | ----------------------------- |
| `TODO`        | Task has not yet been started |
| `IN_PROGRESS` | Task is currently in progress |
| `DONE`        | Task has been completed       |
| `CANCELLED`   | Task has been cancelled       |

These values reflect the currently validated Task API contract.

They can later be reused safely by Task filtering and feature logic without redefining status strings.

---

## Task Sort Direction

Collection sorting direction is represented using:

```ts
export type TaskOrder = "ASC" | "DESC";
```

This restricts supported sort direction to the values accepted by the validated Task collection API.

---

## Task Domain Model

The Task entity is defined as:

```ts
export interface Task {
  id: string;
  name: string;
  description: string | null;
  start: string | null;
  end: string | null;
  duration: number | null;
  priority: TaskPriority;
  status: TaskStatus;
  archived: boolean;
  isDefault: boolean | null;
  parentId: string | null;
  children: string;
  owner: string | null;
  tags: string | null;
  completedAt: string | null;
  createdAt: string | null;
  updatedAt: string | null;
}
```

The model reflects the currently validated Task API contract.

---

## Required and Nullable Fields

There is an important difference between an optional property and a nullable property in TypeScript.

An optional property may not exist:

```ts
description?: string;
```

A nullable property exists but may contain `null`:

```ts
description: string | null;
```

The validated Task API explicitly allows several fields to contain `null`.

For that reason, nullable fields are modelled using unions such as:

```ts
string | null;
number | null;
boolean | null;
```

rather than marking those properties as optional.

Examples include:

```ts
description: string | null;
duration: number | null;
isDefault: boolean | null;
parentId: string | null;
```

This produces a more accurate TypeScript representation of the backend response.

---

## Children Field

The current validated API contract represents `children` as:

```ts
children: string;
```

TA-42 deliberately follows the validated contract rather than attempting to redesign the backend representation from frontend assumptions.

If the API contract changes later, this type should be updated through the appropriate ticket and API-contract validation process.

---

## Task Read Parameters

The collection endpoint supports optional read parameters through:

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

These correspond to supported `GET /tasks` query parameters.

| Parameter  | Type           | Purpose                                |
| ---------- | -------------- | -------------------------------------- |
| `page`     | `number`       | Requested pagination page              |
| `limit`    | `number`       | Number of Tasks requested per page     |
| `search`   | `string`       | Search criteria supported by the API   |
| `status`   | `TaskStatus`   | Filter by Task status                  |
| `priority` | `TaskPriority` | Filter by Task priority                |
| `sort`     | `TaskOrder`    | Select ascending or descending sorting |
| `all`      | `boolean`      | API-supported collection option        |

Every parameter is optional.

For example:

```ts
const params: TaskReadParams = {
  page: 1,
  limit: 10,
  status: "TODO",
  priority: "HIGH",
};
```

The service can also be called without parameters.

---

## Shared Pagination Infrastructure

TA-42 does not introduce a Task-specific pagination model.

The project already provides reusable API pagination infrastructure.

Task collection responses reuse it with:

```ts
export type TaskCollectionResponse = PaginatedResponse<Task>;
```

Conceptually:

```text
PaginatedResponse<T>
        ↓
T = Task
        ↓
PaginatedResponse<Task>
```

This allows the common pagination structure to remain generic while the collection items remain strongly typed as Tasks.

This follows the existing application architecture and avoids duplicate response models.

---

## Shared Axios Client

The Task service imports the existing Axios client:

```ts
import apiClient from "@/api/client";
```

It does not create another Axios instance.

This means Task requests automatically continue through the infrastructure already established by the Application Foundation.

The flow is:

```text
Task Service
    ↓
apiClient
    ↓
Runtime API Configuration
    ↓
Axios Request Interceptors
    ↓
Todo API
    ↓
Axios Response/Error Interceptors
    ↓
Existing Logging / Error Infrastructure
```

This keeps API configuration and cross-cutting concerns centralized.

---

## Task Collection Service

The collection read service is:

```ts
export const getTasks = async (params?: TaskReadParams): Promise<TaskCollectionResponse> => {
  const response = await apiClient.get<TaskCollectionResponse>("/tasks", {
    params,
  });

  return response.data;
};
```

The service accepts optional `TaskReadParams`.

For example:

```ts
await getTasks({
  page: 1,
  limit: 10,
  status: "TODO",
});
```

Axios serializes the supplied `params` into the request query parameters.

Conceptually:

```text
getTasks(params)
        ↓
GET /tasks
        ↓
Task API
        ↓
PaginatedResponse<Task>
        ↓
TaskCollectionResponse
```

The service returns `response.data`, keeping Axios-specific response handling inside the service boundary.

---

## Task Detail Service

The individual Task read service is:

```ts
export const getTaskById = async (id: string): Promise<Task> => {
  const response = await apiClient.get<Task>(`/tasks/${id}`);

  return response.data;
};
```

It retrieves:

```text
GET /tasks/{id}
```

The validated endpoint returns a Task directly as its response body.

Therefore the service is typed as:

```ts
Promise<Task>;
```

rather than introducing a `SingleResponse<Task>` wrapper that is not part of the validated endpoint contract.

Conceptually:

```text
getTaskById(id)
        ↓
GET /tasks/{id}
        ↓
Task API
        ↓
Task
```

---

## Service Layer Boundary

Presentation components should not perform operations such as:

```ts
apiClient.get("/tasks");
```

directly.

Instead, low-level Task HTTP operations belong in:

```text
src/services/taskService.ts
```

Future consumers should depend on the Task service boundary.

For example, a future query layer can conceptually call:

```text
TanStack Query Hook
        ↓
getTasks()
        ↓
Task Service
        ↓
apiClient
```

The query hook itself is intentionally not implemented by TA-42.

---

## Relationship to Shared API Infrastructure

TA-42 builds on infrastructure established during the Application Foundation and subsequent hardening work.

It reuses:

- runtime API configuration
- shared Axios client
- request/response interceptors
- centralized application logging
- shared pagination types
- existing API error infrastructure

TA-42 does not replace or duplicate these architectural boundaries.

---

## Error Handling Boundary

The Task services do not introduce a new Task-specific error-normalization implementation.

Errors continue through the existing shared Axios and API error infrastructure.

Conceptually:

```text
Task Read Service
        ↓
apiClient
        ↓
request succeeds
        │
        └── return typed response
        ↓
request fails
        ↓
existing Axios error flow
        ↓
existing API error infrastructure
```

Feature-level error presentation belongs to future consumers of these services.

---

## Separation of Responsibilities

The current architecture separates concerns as follows:

| Layer                     | Responsibility                                         |
| ------------------------- | ------------------------------------------------------ |
| Task domain types         | Describe Task data and supported read parameters       |
| Task service              | Perform Task HTTP operations                           |
| Shared Axios client       | Handle common HTTP configuration and interceptors      |
| Shared API infrastructure | Handle common API contracts and cross-cutting behavior |
| Future query layer        | Manage server-state lifecycle                          |
| Future presentation layer | Render Task information and user interactions          |

This separation prevents UI components from becoming tightly coupled to HTTP implementation details.

---

## Scope Boundaries

TA-42 intentionally does not implement:

- TanStack Query hooks
- Task list presentation
- Task detail presentation
- Task creation
- Task updating
- Task deletion
- authentication ownership behavior
- authorization behavior
- session handling
- unrelated future Task functionality

These belong to later Jira tickets.

---

## Validation

TA-42 should be validated with:

```bash
npm run lint
npm run format
npm run build
git diff --check
```

The implementation should also be manually reviewed to confirm:

- Task types match the validated API contract
- nullable fields remain nullable where required
- supported collection parameters are represented
- shared pagination infrastructure is reused
- `getTasks()` uses the shared Axios client
- `getTaskById()` uses the shared Axios client
- the detail response is typed directly as `Task`
- no duplicate Axios client exists
- no Task mutation service has been introduced
- no TanStack Query hooks have been introduced
- no authentication behavior has been introduced

---

## Future Integration

Later Task Management tickets can build on TA-42 without redesigning the service boundary.

The intended future architecture is:

```text
Task UI
        ↓
Task Query Hooks
        ↓
Task Read Services
        ↓
Shared Axios Client
        ↓
Todo API
```

Mutation services and hooks should be introduced only by their appropriate Jira tickets.

---

## Related Documentation

- API Reference
- API Types
- API Client
- API Error Normalization
- Server State
- Runtime Configuration
- Centralized Application Logging
- Frontend Architecture
- Project Structure

---

## Future Improvements

Future tickets may extend the Task domain and service layer when required by validated functionality.

Possible later additions include:

- Task mutation services
- TanStack Query hooks
- Task query-key conventions
- cache invalidation behavior
- authentication ownership integration
- Task-specific presentation components

These are deliberately outside TA-42.
