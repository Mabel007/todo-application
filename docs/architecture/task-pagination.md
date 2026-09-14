# Task Pagination

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-46                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-46 introduces server-driven pagination for the API-backed Task collection.

The Todo Application does not retrieve and render the complete Task collection at once. Instead, the API returns a page of Task records together with pagination metadata.

The frontend uses that metadata to determine the current page, available pages, and navigation boundaries.

TA-46 builds on the existing Task read architecture rather than introducing a separate pagination data layer.

---

## Architecture

The pagination flow is:

```text
Pagination Controls
        ↓
React Page State
        ↓
useTasks({ page, limit })
        ↓
Task Query Key
        ↓
Task Read Service
        ↓
Shared Axios Client
        ↓
Tasks API
        ↓
PaginatedResponse<Task>
        ↓
Task List + Pagination Metadata
```

The API remains the source of truth for pagination.

---

## Existing Pagination Contract

The shared API architecture already defines:

```ts
export interface ApiPaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

Paginated responses use:

```ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: ApiPaginatedMeta;
}
```

The Task collection reuses:

```ts
export type TaskCollectionResponse = PaginatedResponse<Task>;
```

TA-46 does not introduce duplicate pagination interfaces.

---

## Pagination Metadata

The server provides:

| Property          | Responsibility                    |
| ----------------- | --------------------------------- |
| `total`           | Total number of Task records      |
| `page`            | Current server-confirmed page     |
| `limit`           | Maximum records returned per page |
| `totalPages`      | Number of available pages         |
| `hasNextPage`     | Whether another page exists       |
| `hasPreviousPage` | Whether a previous page exists    |

These values determine pagination behavior.

---

## Source of Truth

Pagination boundaries come from API metadata.

The frontend does not determine whether another page exists using:

```ts
tasks.length;
```

A page containing exactly the configured limit does not prove another page exists.

Instead:

```text
Can navigate forward?
→ meta.hasNextPage

Can navigate backward?
→ meta.hasPreviousPage
```

---

## Page State

The Tasks page maintains the selected page:

```ts
const [page, setPage] = useState(1);
```

The page begins at:

```text
1
```

and is passed to the existing collection hook:

```ts
useTasks({
  page,
  limit: initialTaskParams.limit,
});
```

---

## Page-State Flow

Changing page state causes React to re-render.

The new page is included in `TaskReadParams`.

Conceptually:

```text
setPage()
   ↓
React re-render
   ↓
useTasks receives new page
   ↓
query key changes
   ↓
TanStack Query resolves new query
   ↓
API request
   ↓
new Task page
   ↓
UI update
```

---

## Query Identity

TA-43 already established collection query keys containing `TaskReadParams`.

Therefore:

```text
["tasks", "list", { page: 1, limit: 10 }]
```

and:

```text
["tasks", "list", { page: 2, limit: 10 }]
```

represent different Task queries.

TA-46 reuses this existing architecture.

---

## Previous Navigation

Previous navigation updates local page state:

```ts
setPage((currentPage) => currentPage - 1);
```

Availability is controlled by:

```ts
data.meta.hasPreviousPage;
```

The resulting rule is:

```text
hasPreviousPage = true
→ Previous enabled

hasPreviousPage = false
→ Previous disabled
```

---

## Next Navigation

Next navigation updates local page state:

```ts
setPage((currentPage) => currentPage + 1);
```

Availability is controlled by:

```ts
data.meta.hasNextPage;
```

The rule is:

```text
hasNextPage = true
→ Next enabled

hasNextPage = false
→ Next disabled
```

---

## Pagination Boundaries

### First Page

```text
Previous disabled
Next enabled when another page exists
```

### Middle Page

```text
Previous enabled
Next enabled
```

### Final Page

```text
Previous enabled
Next disabled
```

### Single Page

```text
Previous disabled
Next disabled
```

The server metadata determines each boundary.

---

## Current Page Indicator

The UI presents:

```text
Page X of Y
```

using:

```ts
data.meta.page;
data.meta.totalPages;
```

The indicator deliberately uses the server-confirmed page rather than local state.

This ensures the displayed pagination state reflects the response currently rendered.

---

## TaskList Responsibility

`TaskList` remains responsible for rendering Task records.

It does not own:

- page state
- pagination metadata
- Previous navigation
- Next navigation
- page reconciliation

These responsibilities belong to the Tasks page.

The separation is:

```text
Tasks
→ query + pagination orchestration

TaskList
→ Task record presentation
```

---

## `keepPreviousData`

The existing `useTasks()` hook uses:

```ts
placeholderData: keepPreviousData;
```

This keeps the previous Task page available while the next requested page is being retrieved.

Without this behavior:

```text
Page 1
→ request Page 2
→ existing data disappears
→ Page 2 arrives
```

With previous-data preservation:

```text
Page 1
→ request Page 2
→ Page 1 remains temporarily visible
→ Page 2 arrives
→ Page 2 replaces Page 1
```

This provides a more stable pagination transition.

---

## Placeholder Data

TanStack Query exposes:

```ts
isPlaceholderData;
```

while the previous page is temporarily being used for a new query identity.

TA-46 uses this state to protect pagination controls.

Conceptually:

```text
new page requested
      ↓
previous data temporarily visible
      ↓
isPlaceholderData = true
      ↓
Previous / Next disabled
      ↓
new response arrives
      ↓
isPlaceholderData = false
      ↓
controls use new metadata
```

This prevents repeated navigation based on stale page metadata.

---

## Page Reconciliation

The number of available pages can change.

For example:

```text
selected page = 8
server totalPages = 6
```

The selected page is no longer valid.

TA-46 reconciles this condition:

```ts
if (page > totalPages) {
  setPage(totalPages);
}
```

The resulting state becomes:

```text
page = 6
```

---

## Conditional Reconciliation

Reconciliation only occurs when:

```text
selected page > server totalPages
```

For example:

```text
page = 4
totalPages = 6
```

requires no state change.

This prevents unnecessary state updates.

---

## Empty Collection Protection

An empty collection may report:

```text
totalPages = 0
```

TA-46 does not reconcile the selected page to:

```text
0
```

because page zero is not a normal pagination page.

The reconciliation therefore exits when there are no pages.

Dedicated empty-state presentation remains outside TA-46.

---

## Accessibility

Pagination controls use native:

```html
<button></button>
```

elements.

This provides built-in:

- keyboard focus
- Enter/Space activation
- button semantics
- disabled behavior

Unavailable navigation actions use the actual:

```html
disabled
```

attribute.

The implementation does not use clickable non-semantic elements for pagination.

---

## Button Type

Pagination buttons explicitly use:

```html
type="button"
```

This makes their behavior clear and prevents accidental form-submission semantics if the surrounding structure changes in the future.

---

## Responsive Layout

Pagination controls use a wrapping flex layout.

Conceptually:

```text
flex
flex-wrap
items-center
justify-between
gap
```

This allows:

```text
Previous
Page X of Y
Next
```

to adapt when available horizontal space decreases.

---

## Scope Boundaries

TA-46 intentionally does not implement:

- search
- filtering
- sorting
- URL pagination synchronization
- numbered page navigation
- dedicated loading UX
- dedicated empty-state redesign
- dedicated retrieval-error UX
- Task CRUD operations
- mutation behavior

These concerns remain assigned to their corresponding downstream tickets.

---

## Manual QA

### First Page

Confirm:

- Page 1 renders
- Previous is disabled
- Next is enabled when another page exists
- indicator displays Page 1

### Middle Page

Confirm:

- Previous is enabled
- Next is enabled
- correct Task records render
- page indicator matches server metadata

### Final Page

Confirm:

- Previous is enabled
- Next is disabled
- final-page records render correctly

### Navigation

Confirm:

- Next advances one page
- Previous returns one page
- rapid repeated navigation is prevented while placeholder data is active

### Reconciliation

Where reproducible, confirm an invalid selected page is corrected to the latest valid server page.

### Accessibility

Confirm:

- Previous and Next are reachable with keyboard navigation
- Enter/Space activates enabled buttons
- disabled buttons cannot be activated
- focus remains visible

### Responsive Design

Validate representative:

- mobile
- tablet
- desktop

Confirm controls remain readable and usable without horizontal overflow.

---

## Validation Commands

Before completing TA-46, run:

```bash
npm run lint
npm run format
npm run format:check
npm run build
git diff --check
```

All required checks must pass before merge.

---

## Relationship to Previous Tickets

### TA-42

Established the Task domain and read services.

### TA-43

Established deterministic Task query keys and reusable Task query hooks.

### TA-44

Established the Task List presentation.

### TA-45

Established Task Details routing and presentation.

### TA-46

Adds server-driven navigation through Task collection pages.

The resulting collection flow is:

```text
Tasks Page
    ↓
Pagination State
    ↓
Task Query Layer
    ↓
Task Service
    ↓
Tasks API
    ↓
Paginated Task Response
    ↓
Task List
    +
Pagination Controls
```

---

## Future Integration

Later tickets may add:

- search
- filtering
- sorting
- URL query-state synchronization
- dedicated loading and empty states
- retrieval-error states
- Task CRUD behavior

Those capabilities should be implemented only through their corresponding Jira tickets.

---

## Related Documentation

- Task Domain Models and Read API Services
- Task Query Keys and TanStack Query Hooks
- Task List Experience
- Task Details Experience
- Server State
- API Types
- Frontend Architecture
- Accessibility Standards
- Testing Strategy
