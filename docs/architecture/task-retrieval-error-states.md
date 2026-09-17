# Task Retrieval Error and Not Found States

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-52                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-52 introduces controlled retrieval-error and Task-specific not-found states for Task read operations.

The implementation ensures that Task API failures are normalized through the application's centralized error model before reaching the presentation layer.

The resulting architecture distinguishes between:

- Task collection retrieval failures
- Task detail retrieval failures
- Task-specific not-found responses
- Missing or blank Task identifiers
- Valid empty collections
- Valid No Results collections
- Unknown application routes
- Unexpected React rendering failures

TA-52 does not introduce mutation-error handling or authentication-specific error experiences.

---

## Error Architecture

Task read failures follow this flow:

```text
API failure
↓
apiClient
↓
Technical logging
↓
taskService
↓
normalizeApiError()
↓
AppError
↓
TanStack Query
↓
Page-level presentation decision
```

This prevents Task pages from directly inspecting Axios implementation details.

Pages do not need to use:

```ts
axios.isAxiosError();
error.response;
error.response.status;
```

Instead, they consume application-level `AppError` values.

---

## Error Responsibility Boundaries

TA-52 preserves distinct application failure boundaries.

```text
Task request fails
→ Task Retrieval Error

Requested Task does not exist
→ Task Not Found

Application URL does not exist
→ NotFoundPage

Unexpected React rendering failure
→ ApplicationErrorBoundary
```

These states represent different problems and are intentionally not collapsed into one generic error experience.

---

## Task Service Normalization

Both Task read services normalize failures before rethrowing them.

Conceptually:

```ts
export const getTasks = async (params?: TaskReadParams): Promise<TaskCollectionResponse> => {
  try {
    const response = await apiClient.get<TaskCollectionResponse>("/tasks", { params });

    return response.data;
  } catch (error: unknown) {
    throw normalizeApiError(error);
  }
};
```

Task detail retrieval follows the same pattern:

```ts
export const getTaskById = async (id: string): Promise<Task> => {
  try {
    const response = await apiClient.get<Task>(`/tasks/${id}`);

    return response.data;
  } catch (error: unknown) {
    throw normalizeApiError(error);
  }
};
```

---

## Why Errors Are Thrown

Normalized errors are thrown:

```ts
throw normalizeApiError(error);
```

rather than returned.

This preserves the rejected Promise contract required by TanStack Query.

The result is:

```text
Request succeeds
→ Promise resolves
→ Query success state

Request fails
→ AppError thrown
→ Promise rejects
→ Query error state
```

Returning an `AppError` as normal data would incorrectly turn the failed request into a successful query result.

---

## Logging Responsibility

TA-52 does not add duplicate technical logging inside `taskService`.

The shared Axios client already owns request/error logging.

The responsibilities remain:

```text
apiClient
→ technical request/error logging

taskService
→ normalize transport failure

TanStack Query
→ manage async request state

page
→ choose user-facing presentation
```

---

## Typed Query Error Contract

The Task collection query explicitly uses `AppError` as its error contract.

Conceptually:

```ts
useQuery<TaskCollectionResponse, AppError>({
  queryKey: taskQueryKeys.list(params),
  queryFn: () => getTasks(params),
  placeholderData: keepPreviousData,
});
```

The Task detail query similarly uses:

```ts
useQuery<Task, AppError>({
  ...
});
```

This aligns TypeScript with the runtime contract established by the Task service.

---

## Existing Query Behavior Preserved

TA-52 preserves:

```ts
placeholderData: keepPreviousData;
```

for Task collections.

The existing query architecture remains responsible for server-state lifecycle behavior.

TA-52 does not introduce duplicate retry, previous-data, or error state through React `useState`.

---

## Task Collection Retrieval Error

A collection retrieval failure should block the collection only when no usable Task collection data is available.

The page derives:

```ts
const hasBlockingError = isError && !data;
```

This distinction matters because:

```text
Error + no usable data
→ Blocking Retrieval Error

Error + existing usable data
→ Do not automatically destroy usable content
```

---

## Collection Error Presentation

A blocking collection failure presents a controlled error state:

```text
Unable to load tasks

We couldn't retrieve your tasks.
Please try again.

[Try again]
```

The state uses the shared Task collection-state presentation with alert semantics.

No raw API message, Axios response object, stack trace, or backend implementation detail is exposed.

---

## Collection Retry

Collection recovery uses TanStack Query's:

```ts
refetch();
```

The application does not introduce a second retry implementation.

The retry state is derived from query state:

```ts
const isRetrying = hasBlockingError && isFetching;
```

The interaction becomes:

```text
Retrieval failure
↓
Try again
↓
refetch()
↓
Trying again...
↓
Retry button temporarily disabled
↓
Success or controlled failure
```

---

## Why Retry Is Manual

The global QueryClient configuration establishes:

```ts
retry: false;
```

TA-52 preserves that application-level policy.

The ticket introduces meaningful user-controlled recovery rather than changing the global retry architecture.

---

## Preserving Existing Collection Data

The successful collection presentation no longer requires the absence of `isError` when usable data exists.

Conceptually, the populated branch can remain available when:

```text
data exists
+
background retrieval problem occurs
```

This avoids contradicting the established principle of preserving usable collection content where practical.

---

## Empty and No Results Remain Separate

TA-52 does not change the TA-51 classification rules.

```text
Successful request
+
zero Tasks
+
no narrowing criteria
→ Empty Collection
```

```text
Successful request
+
zero Tasks
+
active search/filter criteria
→ No Results
```

A failed request with no data instead becomes:

```text
Retrieval Error
```

A retrieval failure cannot therefore accidentally be classified as Empty or No Results.

---

## Task Detail State Model

Task Details now explicitly handles:

```text
Missing/blank identifier
Loading
Task Not Found
Retrieval Error
Success
```

The previous implementation:

```ts
if (!task) {
  return null;
}
```

has been removed.

A missing `task` value no longer causes several unrelated states to collapse into a blank page.

---

## Task Identifier Normalization

The route parameter is normalized:

```ts
const normalizedTaskId = taskId?.trim();
```

The existing `useTask()` hook also preserves:

```ts
const taskId = id?.trim();
```

and:

```ts
queryFn: taskId ? () => getTaskById(taskId) : skipToken;
```

This safely prevents a request when a usable identifier is unavailable.

---

## Missing or Blank Identifier

When:

```ts
!normalizedTaskId;
```

the page renders a controlled state rather than attempting an invalid request or failing unexpectedly.

The meaningful recovery action is:

```text
Back to Tasks
```

Retry is not shown because retrying the same missing identifier cannot resolve the problem.

---

## Identifier Validation Boundary

TA-52 does not invent numeric Task ID validation.

The verified Task contract defines:

```ts
id: string;
```

There is no established frontend contract requiring Task identifiers to contain only numeric values.

TA-52 therefore validates whether an identifier is usable without inventing unsupported domain constraints.

---

## Task Loading

While a valid Task detail request is loading, the page displays:

```text
Loading task

Please wait while the task is being loaded.
```

This replaces the previous blank-screen behavior.

---

## Task-Specific Not Found

When the normalized query error is:

```ts
error.type === "not-found";
```

the Task Details page displays:

```text
Task not found

The task you're looking for could not be found.

Back to Tasks
```

This is a resource-level 404 rather than a route-level 404.

---

## Resource 404 vs Route 404

These states remain separate.

### Resource 404

```text
/tasks/abc123
↓
React Router matches Task Details route
↓
API reports that Task abc123 does not exist
↓
Task Not Found
```

### Route 404

```text
/unknown-application-route
↓
No application route matches
↓
NotFoundPage
```

The generic `NotFoundPage` is therefore not reused for a missing Task resource.

---

## Task Detail Retrieval Error

A non-not-found Task retrieval failure presents:

```text
Unable to load task

We couldn't retrieve this task.
Please try again.

[Try again] [Back to Tasks]
```

Retry uses the existing query:

```ts
refetch();
```

while navigation provides an alternative recovery path.

---

## Detail Retry State

The retry state is derived from TanStack Query:

```ts
const isRetrying = isError && isFetching;
```

This provides:

```text
Try again
↓
Trying again...
↓
button disabled while request runs
```

No duplicate local retry state is required.

---

## Meaningful Recovery Actions

TA-52 intentionally varies recovery actions by state.

| State                         | Retry | Back to Tasks |
| ----------------------------- | ----- | ------------- |
| Collection retrieval failure  | Yes   | Not required  |
| Task detail retrieval failure | Yes   | Yes           |
| Task Not Found                | No    | Yes           |
| Missing/blank Task ID         | No    | Yes           |
| Task Loading                  | No    | No            |

Retry is shown only when repeating the failed request could reasonably recover.

---

## Shared State Presentation

TA-52 extends the existing:

```text
TaskCollectionState
```

component with optional:

```ts
children?: ReactNode;
```

This allows the shared presentation to contain recovery controls without becoming responsible for retry or navigation behavior.

Responsibility remains:

```text
TaskCollectionState
→ state presentation

Tasks / TaskDetails
→ recovery behavior
```

---

## Why TaskCollectionState Was Reused

The first Task Details implementation represented the correct states but repeated similar state-card JSX for each branch.

That significantly increased the size and duplication of `TaskDetails.tsx`.

The implementation was refactored to reuse the existing state presentation component.

This preserves:

- focused page logic
- consistent state presentation
- existing successful Task Details UI
- lower JSX duplication
- clearer responsibility boundaries

The component is not renamed or consolidated into a broader design-system abstraction during TA-52.

That work can be considered in the appropriate UI/design-system ticket.

---

## Sensitive Error Information

User-facing error states use controlled application copy.

The pages do not expose:

- Axios error objects
- HTTP response payload details
- stack traces
- internal server messages
- backend implementation details
- technical logging context

Technical details remain within the established logging architecture.

---

## Accessibility

Error states use appropriate alert semantics.

Normal loading states use status semantics.

Recovery actions are implemented using semantic buttons and links.

Retry buttons are disabled while the retry request is active.

Existing keyboard focus treatment is preserved.

The implementation does not rely on color alone to communicate failure.

---

## Responsive Behavior

The reused state presentation follows the existing responsive Task experience.

Recovery controls remain usable at representative mobile, tablet, and desktop widths.

TA-52 does not introduce a new layout or final design-system treatment.

---

## Files Modified

```text
src/services/taskService.ts
src/components/tasks/TaskCollectionState.tsx
src/hooks/useTasks.ts
src/hooks/useTask.ts
src/pages/Tasks.tsx
src/pages/TaskDetails.tsx
```

---

## Files Created

Production implementation:

```text
None
```

Repository documentation:

```text
docs/architecture/task-retrieval-error-states.md
```

---

## Existing Foundation Preserved

TA-52 does not modify:

```text
src/api/errors.ts
src/api/client.ts
src/types/api.ts
src/types/errors.ts
src/types/tasks.ts
src/lib/queryClient.ts
src/routes/routeConfig.tsx
src/pages/NotFoundPage.tsx
src/components/shared/ApplicationErrorBoundary.tsx
src/providers/AppProviders.tsx
```

The existing foundation already provides the required normalization, logging, routing, and application-error boundaries.

---

## Manual QA

TA-52 negative-path validation should cover:

### Collection Retrieval Failure

Verify:

```text
GET /tasks fails
↓
controlled error state
↓
Try again available
```

Confirm raw backend information is not displayed.

### Collection Retry

Trigger retry and verify:

```text
Try again
↓
Trying again...
↓
button disabled
↓
request executes again
```

### Task Not Found

Request a valid-format Task identifier that does not exist.

Verify:

```text
Task not found
```

is displayed rather than the generic application `NotFoundPage`.

### Task Detail Retrieval Failure

Produce a recoverable detail request failure.

Verify:

```text
Unable to load task
```

with:

```text
Try again
Back to Tasks
```

### Missing/Blank Identifier

Verify a missing or blank identifier is handled without an uncontrolled application error or invalid API request.

### Normal Task Detail

Verify an existing Task still displays the established Task Details UI.

### Empty Collection Regression

Verify a successful unrestricted zero-result collection still displays the TA-51 Empty state.

### No Results Regression

Verify a successful filtered/searched zero-result collection still displays the TA-51 No Results state.

### Generic Route 404 Regression

Navigate to an unknown application route and confirm the existing generic `NotFoundPage` still owns that case.

### Error Boundary Regression

Confirm TA-52 does not replace the existing `ApplicationErrorBoundary` responsibility for unexpected React rendering failures.

### Accessibility and Responsive Validation

Verify:

- error messages are understandable
- alert/status semantics remain appropriate
- retry controls are keyboard operable
- navigation links are keyboard operable
- disabled retry state is communicated
- focus styling remains visible
- layouts remain usable across representative viewport widths

---

## Scope Boundaries

TA-52 does not introduce:

- mutation error handling
- authentication-specific error handling
- authorization workflows
- automatic retry policies
- QueryClient retry changes
- new Error Boundary behavior
- generic route 404 redesign
- Task CRUD
- numeric Task ID validation
- final UI polish
- design-system consolidation

---

## Validation Commands

Before merge, run:

```bash
npm run format
npm run lint
npm run build
git diff --check
```

All engineering quality gates must pass.

---

## Evidence Required

Final evidence should include:

- collection retrieval failure
- collection retry
- collection retry-in-progress state
- Task detail loading
- Task-specific Not Found
- Task detail retrieval failure
- Task detail retry
- missing/blank identifier handling
- successful Task detail regression
- Empty collection regression
- No Results regression
- generic route 404 regression
- responsive error states
- keyboard/accessibility validation
- no raw backend error exposure
- successful formatting
- successful lint
- successful production build

---

## Relationship to Previous Tickets

### TA-37

Established centralized API error normalization.

### TA-38

Established the Application Error Boundary for unexpected rendering/runtime failures.

### TA-43

Established typed TanStack Query Task hooks.

### TA-45

Established the Task Details experience.

### TA-51

Established Loading, Empty and No Results collection states.

### TA-52

Completes the Task read-state distinction with:

```text
Collection Retrieval Error
Task Detail Retrieval Error
Task Not Found
Missing/Invalid Identifier Safety
Meaningful Recovery
```

---

## Final Architecture

```text
API
↓
apiClient
├── technical logging
↓
taskService
├── normalizeApiError()
↓
AppError
↓
TanStack Query
├── request state
├── refetch
↓
Presentation
├── Tasks
│   └── Retrieval Error + Retry
│
└── TaskDetails
    ├── Loading
    ├── Missing ID
    ├── Task Not Found
    ├── Retrieval Error + Recovery
    └── Success
```

Separate application boundaries remain:

```text
Unknown URL
→ NotFoundPage

Unexpected React rendering failure
→ ApplicationErrorBoundary
```

---

## Result

TA-52 completes controlled Task read-error handling without exposing transport-layer implementation details to presentation components.

The implementation provides:

```text
Normalized Task read failures
Controlled collection retrieval errors
Task-specific resource Not Found
Safe missing-ID behavior
Meaningful manual retry
Safe user-facing error copy
Clear route/resource/error-boundary separation
Existing collection-state preservation
Existing logging architecture preservation
```
