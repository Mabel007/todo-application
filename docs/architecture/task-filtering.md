# Task Status and Priority Filtering

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-48                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-48 introduces API-backed Status and Priority filtering for the Todo Application Task collection.

Users can constrain Task results using the Status and Priority values supported by the Task API.

Filtering remains server-driven and integrates with the existing Task collection architecture, including pagination, search, TanStack Query cache identity, Task services, and shared domain types.

---

## Supported Filter Values

### Status

The Task API supports:

```text
TODO
IN_PROGRESS
DONE
CANCELLED
```

The UI presents these values as:

```text
To Do
In Progress
Done
Cancelled
```

### Priority

The Task API supports:

```text
LOW
MEDIUM
HIGH
```

The UI presents these values as:

```text
Low
Medium
High
```

The existing shared Task labels are reused for presentation.

---

## Filtering Architecture

The complete collection flow is:

```text
Search
+
Status
+
Priority
+
Page
↓
TaskReadParams
↓
useTasks(params)
↓
Task query key
↓
getTasks(params)
↓
Shared Axios client
↓
Todo API
↓
Filtered paginated Task collection
```

Filtering does not operate against only the currently rendered page.

---

## Why Filtering Is API-Backed

The Task collection is paginated.

The frontend may have only a small subset of the complete collection at any given time.

Using:

```ts
tasks.filter(...)
```

would therefore filter only the Tasks currently loaded in the browser.

Instead, TA-48 sends structured filter values to the API so filtering is performed against the server-side Task collection.

---

## Existing Domain Types

TA-48 reuses the existing Task domain unions:

```ts
export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE" | "CANCELLED";

export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
```

The existing Task read parameters already support:

```ts
status?: TaskStatus;
priority?: TaskPriority;
```

No new filtering domain model was required.

---

## Optional Filter State

The Tasks page stores filters as:

```ts
TaskStatus | undefined;
```

and:

```ts
TaskPriority | undefined;
```

`undefined` represents no active filter.

Conceptually:

```text
Status = undefined
→ all statuses

Priority = undefined
→ all priorities
```

---

## TaskFilters Component

The filter presentation is separated into:

```text
src/components/tasks/TaskFilters.tsx
```

The component receives the current domain state and callbacks from the Tasks page.

Conceptually:

```ts
interface TaskFiltersProps {
  status: TaskStatus | undefined;
  priority: TaskPriority | undefined;
  onStatusChange: (status: TaskStatus | undefined) => void;
  onPriorityChange: (priority: TaskPriority | undefined) => void;
}
```

This keeps the component reusable and prevents it from owning Task server state.

---

## Responsibility Boundary

The responsibility split is:

types/tasks.ts
→ owns canonical type-level TaskStatus and TaskPriority unions

constants/taskValues.ts
→ owns canonical ordered runtime values used by filter options and URL validation

constants/taskLabels.ts
→ owns canonical display-label mappings

```text
Tasks.tsx
→ owns filter state
→ owns pagination state
→ owns search state
→ calls useTasks()

TaskFilters.tsx
→ renders filter controls
→ handles browser select values
→ converts values to domain values
→ invokes callbacks
```

`TaskFilters` does not call:

```text
Axios
getTasks()
useTasks()
```

---

## Native Select Controls

TA-48 uses native:

```html
<select></select>
```

elements.

The repository did not require an additional Select component dependency for this ticket.

Native selects provide built-in:

- keyboard behavior
- focus behavior
- selection semantics
- assistive technology support

---

## Status Options

The Status control conceptually provides:

```text
All statuses
To Do
In Progress
Done
Cancelled
```

The actual values are:

```text
""
"TODO"
"IN_PROGRESS"
"DONE"
"CANCELLED"
```

---

## Priority Options

The Priority control conceptually provides:

```text
All priorities
Low
Medium
High
```

The actual values are:

```text
""
"LOW"
"MEDIUM"
"HIGH"
```

---

## Clearing Filters

The UI does not send:

```text
status=ALL
```

or:

```text
priority=ALL
```

because `ALL` is not part of either domain union.

Instead:

```text
All statuses
↓
empty UI value
↓
undefined
↓
status omitted
```

and:

```text
All priorities
↓
empty UI value
↓
undefined
↓
priority omitted
```

This keeps the UI aligned with the validated API contract.

---

## Runtime Type Narrowing

Browser select values are strings.

The application cannot automatically assume every browser string is a valid Task domain value.

TA-48 therefore validates incoming values before treating them as:

```ts
TaskStatus;
```

or:

```ts
TaskPriority;
```

The flow is:

```text
Browser string
↓
Runtime validation
↓
Supported value?
├── Yes → narrowed domain value
└── No  → no unsupported domain value forwarded
```

This avoids bypassing the type system with `any`.

---

## Query Integration

The Tasks page passes the active criteria into the existing query:

```ts
useTasks({
  page,
  limit: initialTaskParams.limit,
  search: search || undefined,
  status,
  priority,
});
```

No separate filtered Task query is necessary.

---

## Query Cache Identity

The existing Task query-key factory includes the complete `TaskReadParams` object.

Conceptually:

```text
["tasks", "list", {
  page: 1,
  limit: 10,
  status: "TODO"
}]
```

and:

```text
["tasks", "list", {
  page: 1,
  limit: 10,
  status: "DONE"
}]
```

represent different query identities.

Similarly:

```text
priority=LOW
```

and:

```text
priority=HIGH
```

produce distinct parameterized Task collection identities.

No TA-48 modification to the query-key factory was required.

---

## Pagination Reconciliation

Changing a filter changes the result collection.

The selected page is therefore reset to:

```text
1
```

when either Status or Priority changes.

Conceptually:

```text
Page 2
Priority HIGH
↓
User selects MEDIUM
↓
Priority MEDIUM
Page 1
↓
new filtered collection requested
```

Manual API testing confirmed this behavior.

---

## Combined Status and Priority

Status and Priority can be active simultaneously.

Examples successfully tested include:

```text
status=IN_PROGRESS
priority=MEDIUM
```

and:

```text
status=IN_PROGRESS
priority=LOW
```

The API receives both parameters as part of the same Task collection request.

---

## Search Integration

TA-47 search remains compatible with filtering.

The combined collection criteria can be:

```text
search
+
status
+
priority
+
page
+
limit
```

A manually validated example included:

```text
search=name
status=IN_PROGRESS
priority=LOW
```

This returned a successful API-backed Task result.

---

## Independent Filter State

The filters do not unnecessarily clear one another.

For example:

```text
Status = IN_PROGRESS
Priority = MEDIUM
```

then clearing Priority produces:

```text
Status = IN_PROGRESS
Priority = undefined
```

The resulting request keeps:

```text
status=IN_PROGRESS
```

while omitting Priority.

---

## API Validation

### Status

The following values were manually tested:

```text
All
TODO
IN_PROGRESS
DONE
CANCELLED
```

The active values produced the corresponding API parameters.

`All` omitted the Status parameter.

All requests returned successful responses.

### Priority

The following values were manually tested:

```text
All
LOW
MEDIUM
HIGH
```

The active values produced the corresponding API parameters.

`All` omitted the Priority parameter.

All requests returned successful responses.

---

## Accessibility

Both filter controls use explicit labels associated through:

```text
label htmlFor
+
select id
```

Native selects provide standard keyboard behavior.

Manual keyboard testing included:

```text
Tab
Alt + Down
Arrow keys
Enter
```

Both Status and Priority controls were successfully operated through the keyboard.

Visible focus treatment remains available through the existing focus styles.

---

## Responsive Design

The filter layout adapts to available width.

### Narrow Viewports

```text
Status
[                    ]

Priority
[                    ]
```

The controls stack vertically.

### Larger Viewports

```text
Status                  Priority
[               ]       [               ]
```

The controls share the available row.

Manual mobile and desktop testing confirmed the controls remain usable without visible horizontal overflow.

---

## Files Created

```text
src/components/tasks/TaskFilters.tsx
```

---

## Files Modified

```text
src/pages/Tasks.tsx
```

---

## Files Reviewed but Unchanged

```text
src/components/tasks/TaskList.tsx
src/hooks/useTasks.ts
src/types/tasks.ts
src/constants/taskQueryKeys.ts
src/constants/taskLabels.ts
src/services/taskService.ts
```

The existing architecture already supports filter parameters.

---

## Scope Boundaries

TA-48 intentionally does not introduce:

- sorting
- URL-state consolidation
- query-string filter synchronization
- generalized loading-state redesign
- generalized empty/no-results redesign
- generalized retrieval-error handling
- Task CRUD
- authentication
- duplicate Task services
- duplicate query hooks
- local filtering of the current page

Search from TA-47 remains supported but was not reimplemented.

Sorting belongs to TA-49.

URL collection-state synchronization belongs to TA-50.

---

## Manual QA

### Status Filtering

Verify:

```text
TODO
IN_PROGRESS
DONE
CANCELLED
```

individually.

Confirm the API receives only supported values.

### Priority Filtering

Verify:

```text
LOW
MEDIUM
HIGH
```

individually.

Confirm the API receives only supported values.

### Clearing

Verify:

```text
All statuses
```

removes Status from the request.

Verify:

```text
All priorities
```

removes Priority from the request.

### Combined Filters

Verify Status and Priority can remain active simultaneously.

### Independent Clearing

Verify clearing one filter does not clear the other.

### Pagination

Begin on a later page where available.

Change a filter.

Confirm the resulting filtered collection starts from page 1.

### Search Regression

Combine:

```text
search
+
status
+
priority
```

and verify the API receives all active criteria.

### Keyboard

Verify:

- Tab reaches both filter controls
- visible focus is present
- selections can be changed through keyboard interaction

### Responsive Layout

Validate representative mobile, tablet, and desktop widths.

Confirm:

- controls remain inside the viewport
- labels remain associated and readable
- no horizontal overflow occurs
- Task List and pagination remain usable

---

## Validation Commands

Before TA-48 is completed, run:

```bash
npm run lint
npm run format
npm run build
git diff --check
```

All required project quality gates must pass before merge.

---

## Relationship to Previous Tickets

### TA-42

Established Task Status/Priority domain types and read parameters.

### TA-43

Established parameter-aware Task query keys and collection hooks.

### TA-44

Established Task List presentation.

### TA-45

Established Task Details navigation and presentation.

### TA-46

Established server-driven pagination.

### TA-47

Established API-backed search.

### TA-48

Adds:

```text
API-backed Status filtering
API-backed Priority filtering
filter clearing
runtime domain-value validation
pagination reset
combined filtering
search + filter integration
```

---

## Future Integration

The next Task Management Core capabilities remain separate:

```text
TA-49 → sorting
TA-50 → URL collection-state synchronization
```

These capabilities should be introduced only through their corresponding Jira tickets.
