# Task Search

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-47                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-47 introduces API-backed search for the Todo Application Task collection.

Users can enter Task search criteria through the Tasks page and receive matching results from the Todo API.

Search remains server-driven and reuses the existing Task query and service architecture.

The implementation also introduces intentional debouncing, pagination reset behavior, predictable cleared-search handling, and a minimal accessible no-match state.

---

## Search Architecture

The complete search flow is:

```text
User input
↓
searchInput
↓
useDebounce(searchInput, 500)
↓
debouncedSearch
↓
trim()
↓
effective search
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
Matching Task collection
```

Search is not performed locally against only the Tasks currently displayed.

---

## Why Search Is API-Backed

The Task collection is paginated.

The frontend may currently have only:

```text
10 Tasks
```

while the server contains thousands of Tasks.

Filtering only the current browser collection would therefore produce incomplete results.

TA-47 sends the search criterion to the API so the complete server-side Task collection can be searched.

---

## Controlled Search Input

The Tasks page owns the current input value:

```ts
const [searchInput, setSearchInput] = useState("");
```

The search input uses:

```tsx
value = { searchInput };
onChange = { handleSearchChange };
```

React therefore remains the source of truth for the displayed search value.

---

## Search Event

The input change handler receives:

```ts
ChangeEvent<HTMLInputElement>;
```

The latest input value is obtained from:

```ts
event.target.value;
```

The handler updates the search input and resets pagination:

```ts
const handleSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
  setSearchInput(event.target.value);
  setPage(1);
};
```

---

## Pagination Reset

A search criterion changes the result collection.

A page selected for the previous collection should therefore not automatically carry over to the new search.

TA-47 resets page state to:

```text
1
```

when the input changes.

Conceptually:

```text
Current collection
Page 3
↓
User changes search
↓
page = 1
↓
debounce completes
↓
new searched collection requested from page 1
```

---

## Reusable Debounce Hook

TA-47 introduces:

```text
src/hooks/useDebounce.ts
```

The hook is generic:

```ts
export const useDebounce = <T>(value: T, delay: number): T => {
  // ...
};
```

It receives a value of type `T` and returns a debounced value of the same type.

For Task search:

```text
T = string
```

---

## Debounce Behavior

The Tasks page uses:

```ts
const debouncedSearch = useDebounce(searchInput, 500);
```

The conceptual behavior is:

```text
User types
↓
500 ms timer starts
↓
value changes before timer completes?
├── Yes
│   ↓
│ cancel previous timer
│ start new timer
│
└── No
    ↓
    publish debounced value
```

This prevents normal rapid typing from generating uncontrolled request storms.

---

## Debounce Cleanup

The hook clears its pending timeout when the input or delay changes.

Conceptually:

```ts
return () => {
  clearTimeout(timer);
};
```

This prevents an outdated pending timer from publishing a value after a newer input change has already occurred.

---

## Raw and Effective Search Values

TA-47 intentionally distinguishes:

```text
searchInput
```

from:

```text
search
```

`searchInput` represents exactly what the user currently sees in the field.

The effective search value is derived from the debounced value:

```ts
const search = debouncedSearch.trim();
```

This avoids changing the user's raw input merely to normalize the API criterion.

---

## Whitespace Normalization

Surrounding whitespace is removed before the value becomes an API search criterion.

Conceptually:

```text
"  welcome  "
↓
trim()
↓
"welcome"
```

A whitespace-only effective value becomes:

```text
""
```

and therefore does not become an active search criterion.

---

## Query Integration

The existing `useTasks()` query hook is reused:

```ts
useTasks({
  page,
  limit: initialTaskParams.limit,
  search: search || undefined,
});
```

No separate search-specific Task query hook is required.

---

## Cleared Search

When the effective search is empty:

```ts
search || undefined;
```

produces:

```ts
undefined;
```

The collection request therefore returns to the normal Task query without an active search criterion.

Manual testing confirmed clearing the search restores the normal collection.

---

## Query Identity

The existing Task query-key factory already incorporates `TaskReadParams`.

Conceptually:

```text
["tasks", "list", {
  page: 1,
  limit: 10,
  search: "welcome"
}]
```

and:

```text
["tasks", "list", {
  page: 1,
  limit: 10,
  search: "tasks"
}]
```

represent different query identities.

TanStack Query therefore manages each searched collection according to its parameters.

---

## Stale Search Results

Search values form part of the Task query identity.

The debounce hook also cancels obsolete pending timers before publishing newer input.

Together, these mechanisms prevent normal rapid input from being treated as one uncontrolled stream of requests against a single cache entry.

Final rapid-replacement behavior should be manually validated before ticket closure.

---

## Search-Specific No-Match State

TA-47 derives whether a successful searched collection contains no matches:

```ts
const hasSearch = search.length > 0;

const hasNoSearchResults = hasSearch && data?.meta.total === 0;
```

When true, the page displays:

```text
0 tasks

No tasks match your search.
```

This is intentionally search-specific.

It does not replace the generalized empty/no-results experience owned by downstream work.

---

## Accessible No-Match Message

The no-match message uses:

```html
role="status"
```

so the successful change in search-result state can be communicated accessibly.

Pagination is omitted because the searched collection contains no result pages that the user needs to navigate.

---

## Search Control Semantics

The search control uses an explicit label:

```html
<label for="task-search"> Search tasks </label>
```

and corresponding input:

```html
<input id="task-search" type="search" />
```

The placeholder is supplemental and is not relied upon as the accessible name.

---

## Keyboard Accessibility

The native search input provides standard keyboard behavior.

Manual validation should confirm:

- Tab reaches the search input
- visible focus is present
- text can be entered normally
- browser-native clear behavior remains usable
- subsequent interactive controls remain keyboard reachable

---

## Search and Pagination

TA-46 pagination remains active for searched collections.

Conceptually:

```text
search = "welcome"
↓
API reports 17 matches
↓
Page 1 of 2
↓
Next
↓
Page 2 of 2
```

Search does not replace the pagination architecture.

It changes the collection being paginated.

---

## Task Service Boundary

The existing Task service already accepts:

```ts
TaskReadParams;
```

including:

```ts
search?: string;
```

No modification to `taskService.ts` was required.

The responsibility chain remains:

| Layer               | Responsibility                              |
| ------------------- | ------------------------------------------- |
| Tasks page          | Own search input and collection interaction |
| `useDebounce()`     | Delay rapidly changing values               |
| `useTasks()`        | Manage Task collection server state         |
| Query keys          | Identify parameter-specific collections     |
| `getTasks()`        | Perform Task collection request             |
| Shared Axios client | Common HTTP infrastructure                  |
| Todo API            | Search the complete Task collection         |

---

## Files Created

```text
src/hooks/useDebounce.ts
```

---

## Files Modified

```text
src/pages/Tasks.tsx
```

---

## Files Reviewed but Unchanged

```text
src/services/taskService.ts
src/hooks/useTasks.ts
src/constants/taskQueryKeys.ts
src/types/tasks.ts
```

The existing layers already support Task search.

---

## Responsive Behavior

The search control uses the available page width and is designed to reflow with the existing Tasks layout.

Manual validation should include representative:

- mobile
- tablet
- desktop

Confirm:

- input remains inside the viewport
- labels remain readable
- Task cards remain usable
- pagination remains usable
- no horizontal overflow occurs

---

## Accessibility

TA-47 uses:

- explicit search labeling
- native search input semantics
- keyboard-operable controls
- visible focus treatment
- accessible no-match status messaging
- responsive content
- existing semantic Task presentation

No clickable non-semantic replacement for the search control is introduced.

---

## Scope Boundaries

TA-47 intentionally does not implement:

- status filtering
- priority filtering
- sorting
- URL-state consolidation
- query-string search synchronization
- generalized loading-state redesign
- generalized empty/no-results redesign
- generalized retrieval-error experience
- Task CRUD
- authentication
- local-only Task filtering
- new Axios infrastructure
- duplicate Task query hooks

Filtering belongs to TA-48.

Sorting belongs to TA-49.

URL collection-state synchronization belongs to TA-50.

---

## Manual QA

### Normal Collection

Verify:

```text
/tasks?page=1&limit=10
```

continues to return and render the normal Task collection.

### Debouncing

Rapidly type a search value.

Confirm a request is not produced for every individual intermediate character during normal rapid typing.

### API Search

Verify the effective search value is included in the API request.

Example:

```text
search=welcome
```

### Matching Search

Verify matching API Tasks render correctly.

### No-Match Search

Verify a successful zero-result response produces:

```text
0 tasks
No tasks match your search.
```

and does not display unnecessary pagination.

### Clear Search

Clear the input.

Confirm:

- the search criterion is removed
- normal Task collection returns
- pagination represents the normal collection again

### Pagination Reset

Begin from a later page and change the search criterion.

Confirm the searched collection begins from page 1.

### Search Pagination

Use a search with more than one result page.

Confirm:

- Next preserves the search
- Previous preserves the search
- page metadata corresponds to the searched collection

### Rapid Replacement

Enter one search and quickly replace it with another.

Confirm older results do not visibly replace the newer effective search state.

### Whitespace

Test:

```text
"   "
```

and:

```text
"  welcome  "
```

Confirm whitespace-only input behaves as no active search and surrounding whitespace is normalized before API use.

### Keyboard

Verify:

- search is reachable with Tab
- visible focus is present
- typing works
- browser-native clearing remains usable
- pagination remains keyboard operable

### Responsive Design

Validate representative mobile, tablet, and desktop widths.

Confirm there is no horizontal overflow and the search/results hierarchy remains understandable.

---

## Validation Commands

Before TA-47 is completed, run:

```bash
npm run lint
npm run format
npm run build
git diff --check
```

Applicable existing tests should also pass.

---

## Relationship to Previous Tickets

### TA-42

Established Task read parameters and service support, including the API search parameter.

### TA-43

Established parameter-aware Task query keys and collection query hooks.

### TA-44

Established Task List presentation.

### TA-45

Established Task Details navigation and presentation.

### TA-46

Established server-driven Task pagination.

### TA-47

Adds:

```text
API-backed Task search
controlled search input
debounced effective criteria
pagination reset
cleared-search behavior
search-specific no-match behavior
```

---

## Future Integration

Later Task Management Core tickets will extend collection controls with:

```text
TA-48 → filtering
TA-49 → sorting
TA-50 → URL collection-state synchronization
```

Those capabilities remain outside TA-47.
