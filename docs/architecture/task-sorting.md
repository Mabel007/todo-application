# Task Sorting

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-49                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-49 introduces API-backed sorting for the Todo Application Task collection.

Users can change the ordering of Task results using the sorting directions supported by the verified Todo API contract:

```text
ASC
DESC
```

Sorting remains server-driven and integrates with the existing pagination, search, filtering, TanStack Query, Task service, and shared API architecture.

No client-side collection sorting or unsupported sort-field functionality is introduced.

---

## Verified API Contract

The existing Task domain defines:

```ts
export type TaskOrder = "ASC" | "DESC";
```

`TaskReadParams` already supports:

```ts
sort?: TaskOrder;
```

Manual API investigation confirmed requests using:

```text
sort=ASC
```

and:

```text
sort=DESC
```

are supported.

No verified API parameter currently exists for:

```text
sortBy
orderBy
field
```

TA-49 therefore does not expose unsupported field-selection controls.

---

## Observed API Ordering

Manual API testing established that the current backend behavior orders Tasks according to `createdAt`.

Observed behavior:

```text
ASC
→ oldest created Tasks first

DESC
→ newest created Tasks first
```

The API contract itself exposes only the sorting direction.

The UI therefore uses the contract-oriented labels:

```text
Ascending
Descending
```

rather than introducing unsupported sort-field functionality.

---

## Why Sorting Is Server-Driven

The Task collection is paginated.

The frontend receives only one subset of the complete Task collection.

Conceptually:

```text
Server
2637 Tasks
↓
Pagination
↓
Frontend
10 Tasks
```

Sorting only the current frontend array would sort only those records rather than the complete collection.

TA-49 therefore does not use:

```ts
tasks.sort(...)
```

for collection sorting.

The correct collection flow remains:

```text
Complete Task collection
↓
Search
↓
Filter
↓
Sort
↓
Paginate
↓
Return requested page
↓
Frontend renders result
```

---

## Sorting Architecture

The complete frontend flow is:

```text
Tasks.tsx
↓
page
search
status
priority
sort
↓
TaskReadParams
↓
useTasks(params)
↓
taskQueryKeys.list(params)
↓
TanStack Query
↓
getTasks(params)
↓
Shared Axios client
↓
Todo API
↓
Sorted paginated Task collection
```

Sorting reuses the existing Task collection infrastructure.

---

## Default Sorting State

The API documents descending sorting as the default.

The frontend explicitly initializes:

```ts
const [sort, setSort] = useState<TaskOrder>("DESC");
```

This keeps the frontend state, control, request, and API behavior synchronized:

```text
Frontend state = DESC
UI             = Descending
Request        = sort=DESC
API behavior   = descending
```

---

## TaskSort Component

TA-49 introduces:

```text
src/components/tasks/TaskSort.tsx
```

The component receives:

```ts
interface TaskSortProps {
  sort: TaskOrder;
  onSortChange: (sort: TaskOrder) => void;
}
```

`TaskSort` is responsible for:

- rendering the sorting control
- owning the DOM change event
- validating browser values
- forwarding valid `TaskOrder` values to the parent

It does not own Task server state.

---

## Responsibility Boundary

The responsibility split is:

```text
TaskSort.tsx
→ renders native select
→ receives browser string
→ validates ASC / DESC
→ forwards TaskOrder

Tasks.tsx
→ owns TaskOrder state
→ resets pagination
→ passes sort into useTasks()
```

This prevents DOM-specific events from leaking unnecessarily into the parent page.

---

## DOM Value Narrowing

Native HTML select values are typed as:

```ts
string;
```

The application domain expects:

```ts
TaskOrder;
```

TA-49 therefore validates:

```ts
if (value === "ASC" || value === "DESC") {
  onSortChange(value);
}
```

Conceptually:

```text
Browser
↓
string
↓
runtime validation
↓
TaskOrder
↓
application state
```

This avoids unchecked assertions such as:

```ts
value as TaskOrder;
```

and prevents unsupported values from intentionally entering sorting state.

---

## Sorting Control

The native select presents:

```text
Descending
Ascending
```

with API values:

```text
DESC
ASC
```

The control is controlled through:

```tsx
value = { sort };
onChange = { handleSortChange };
```

The browser-facing labels remain separate from the API-facing domain values.

---

## Query Integration

The Tasks page includes sorting in the existing Task collection query:

```ts
useTasks({
  page,
  limit: initialTaskParams.limit,
  search: search || undefined,
  status,
  priority,
  sort,
});
```

No separate sorting query or service is required.

---

## Query Cache Identity

The existing Task query-key factory incorporates `TaskReadParams`.

Therefore:

```ts
{
  page: 1,
  sort: "ASC"
}
```

and:

```ts
{
  page: 1,
  sort: "DESC"
}
```

represent different query identities.

Conceptually:

```text
["tasks", "list", { page: 1, sort: "ASC" }]
```

and:

```text
["tasks", "list", { page: 1, sort: "DESC" }]
```

are distinct TanStack Query cache entries.

No query-key redesign was required.

---

## Pagination Reconciliation

Changing sorting changes the ordering of the complete collection.

The selected page is therefore reset to:

```text
1
```

when sorting changes.

The handler is:

```ts
const handleSortChange = (nextSort: TaskOrder) => {
  setSort(nextSort);
  setPage(1);
};
```

Example:

```text
Before

page     = 4
search   = "meeting"
status   = TODO
priority = HIGH
sort     = DESC

↓ change sorting

After

page     = 1
search   = "meeting"
status   = TODO
priority = HIGH
sort     = ASC
```

Only the ordering and page change.

Existing search and filter criteria remain active.

---

## Search Integration

TA-47 API-backed search remains compatible with sorting.

Changing sorting while search is active:

```text
preserves search
changes sort
resets page to 1
requests newly ordered results
```

Manual validation confirmed this behavior.

---

## Filter Integration

TA-48 Status and Priority filtering remain compatible with sorting.

Changing sorting preserves:

```text
status
priority
```

while resetting pagination.

Manual validation confirmed both Status + Sort and Priority + Sort behavior.

---

## Combined Collection Criteria

The Task collection can now be represented by:

```text
page
limit
search
status
priority
sort
```

All active criteria flow through the same `TaskReadParams` object.

Conceptually:

```ts
{
  page: 1,
  limit: 10,
  search: "meeting",
  status: "TODO",
  priority: "HIGH",
  sort: "ASC"
}
```

represents one server-backed Task collection state.

---

## Responsive Collection Controls

TA-49 integrates sorting with the existing Status and Priority controls.

The collection-control layout uses:

```tsx
<div className="grid gap-4 lg:grid-cols-3">
```

`TaskFilters` contains Status and Priority and occupies two large-screen columns:

```text
lg:col-span-2
```

`TaskSort` occupies the remaining column.

The resulting large-screen layout is:

```text
Status | Priority | Sort
```

---

## Progressive Responsive Layout

On narrow screens:

```text
Search

Status

Priority

Sort
```

At larger widths:

```text
Search

Status | Priority | Sort
```

Each select uses:

```text
w-full
```

so the controls adapt to the available column width.

---

## Content Width

The Tasks page now uses:

```text
mx-auto
w-full
max-w-7xl
space-y-6
```

This establishes a deliberate maximum width for the Task collection experience on large displays.

Broader visual restructuring remains deferred to the dedicated UI epic.

---

## Accessibility

The sorting control uses a native:

```html
<select></select>
```

with an explicitly associated:

```html
<label></label>
```

The relationship is established using:

```text
htmlFor="task-sort"
id="task-sort"
```

Native select semantics provide standard keyboard and assistive technology behavior.

Manual keyboard validation confirmed users can:

- Tab to the sorting control
- interact with the native select
- navigate sorting options
- select Ascending or Descending
- continue navigating without requiring a mouse

Visible focus styling is also provided.

---

## Why TaskSort Is Separate from TaskFilters

Filtering answers:

```text
Which Tasks belong in the result?
```

Sorting answers:

```text
In what order should those Tasks appear?
```

Although both affect the same Task collection query, they represent separate user interactions and responsibilities.

TA-49 therefore introduces a dedicated `TaskSort` component instead of expanding `TaskFilters` into a general collection toolbar.

---

## Files Created

```text
src/components/tasks/TaskSort.tsx
```

---

## Files Modified

```text
src/pages/Tasks.tsx
src/components/tasks/TaskFilters.tsx
```

---

## Files Reviewed but Unchanged

```text
src/types/tasks.ts
src/services/taskService.ts
src/hooks/useTasks.ts
src/constants/taskQueryKeys.ts
```

The existing architecture already supported the `sort` parameter.

---

## Manual API Validation

### Descending

Test:

```text
GET /tasks?page=1&limit=10&sort=DESC
```

Observed:

```text
newer createdAt values first
```

Result:

```text
PASS
```

### Ascending

Test:

```text
GET /tasks?page=1&limit=10&sort=ASC
```

Observed:

```text
older createdAt values first
```

Result:

```text
PASS
```

---

## Functional QA

Validated:

```text
Default DESC sorting                 PASS
Ascending sorting                    PASS
Descending sorting                   PASS
Pagination reset after sort          PASS
Search + sort                        PASS
Status + sort                        PASS
Priority + sort                      PASS
Combined collection criteria         PASS
Keyboard accessibility               PASS
Responsive behavior                  PASS
```

---

## Scope Boundaries

TA-49 intentionally does not introduce:

- client-side collection sorting
- unsupported sort fields
- `sortBy`
- `orderBy`
- URL-state consolidation
- generalized loading-state architecture
- generalized error-state architecture
- Task CRUD
- authentication
- complete Task table redesign
- future UI epic functionality

---

## UI Follow-Up

During TA-49, additional visual improvements were identified around:

- large-screen composition
- collection toolbar polish
- Task table/list presentation
- spacing
- future sorting indicators
- search/filter/sort consolidation
- responsive collection presentation

These concerns are intentionally deferred to the dedicated UI epic.

A separate Confluence reference captures the future Task Collection/Table design work.

TA-49 implements only the responsive and accessibility adjustments required for its sorting scope.

---

## Validation Commands

Before TA-49 is completed, run:

```bash
npm run lint
npm run format
npm run build
git diff --check
```

All project quality gates must pass before merge.

---

## Evidence Required

Final TA-49 evidence should include:

- ASC API request/response
- DESC API request/response
- sorting control in the browser
- pagination reset after sorting
- Search + Sort
- Status + Sort
- Priority + Sort
- combined Search + Filter + Sort
- keyboard sorting interaction
- responsive layout
- successful lint output
- successful formatting validation
- successful production build

---

## Relationship to Previous Tickets

### TA-42

Established the `TaskOrder` domain and `sort` Task read parameter.

### TA-43

Established parameter-aware Task query identity.

### TA-44

Established Task collection presentation.

### TA-46

Established server-driven pagination.

### TA-47

Established API-backed search.

### TA-48

Established API-backed Status and Priority filtering.

### TA-49

Adds:

```text
API-backed sorting
ASC / DESC controlled state
sorting UI
DOM-to-domain value narrowing
pagination reset on sort changes
search/filter/sort integration
responsive collection-control integration
```

---

## Future Integration

TA-50 will handle URL collection-state synchronization.

Broader collection presentation and visual cleanup remain assigned to the dedicated UI epic rather than TA-49.
