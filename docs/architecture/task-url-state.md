# Task URL State Synchronization

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-50                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-50 synchronizes the Todo Application Task collection state with URL query parameters.

The existing pagination, search, Status filtering, Priority filtering, and sorting capabilities are now represented in the browser URL rather than existing only as transient component state.

The supported URL parameters are:

```text
page
search
status
priority
sort
```

This allows Task collection views to survive refresh, restore from directly opened URLs, support browser Back/Forward navigation, and provide predictable shareable collection state.

TA-50 does not introduce new search, filtering, sorting, or pagination capabilities. It connects the capabilities established by TA-46 through TA-49 to URL state.

---

## Previous State Model

Before TA-50, the Tasks page primarily owned collection criteria through local React state:

```ts
const [page, setPage] = useState(1);
const [searchInput, setSearchInput] = useState("");
const [status, setStatus] = useState<TaskStatus | undefined>();
const [priority, setPriority] = useState<TaskPriority | undefined>();
const [sort, setSort] = useState<TaskOrder>("DESC");
```

The flow was:

```text
React state
↓
TaskReadParams
↓
useTasks()
↓
TanStack Query
↓
Task service
↓
Todo API
```

This worked during the current application session but did not provide externally restorable collection state.

---

## URL-Backed State Model

TA-50 changes the effective collection flow to:

```text
Browser URL
↓
React Router
↓
URLSearchParams
↓
Parse / validate / normalize
↓
page / search / status / priority / sort
↓
TaskReadParams
↓
useTasks()
↓
TanStack Query
↓
Task service
↓
Todo API
↓
TaskList
```

The reverse interaction flow is:

```text
User changes collection control
↓
Determine next criterion
↓
Clone existing URL parameters
↓
Update changed criterion
↓
Preserve unrelated criteria
↓
Reconcile pagination where required
↓
Update URL through React Router
↓
URL-derived state changes
↓
Task query changes
↓
UI renders new collection
```

The URL is therefore the authoritative source for effective Task collection state.

---

## React Router Integration

TA-50 uses:

```ts
useSearchParams();
```

from React Router.

Conceptually:

```ts
const [searchParams, setSearchParams] = useSearchParams();
```

The two values have separate responsibilities:

```text
searchParams
→ read current URL query parameters

setSearchParams
→ update URL query parameters
```

React Router performs these navigation updates without requiring a full browser reload.

---

## Supported URL State

| Criterion  | URL Parameter | Default        |
| ---------- | ------------- | -------------- |
| Pagination | `page`        | `1`            |
| Search     | `search`      | empty          |
| Status     | `status`      | All statuses   |
| Priority   | `priority`    | All priorities |
| Sorting    | `sort`        | `DESC`         |

Default values are generally omitted from the canonical URL.

---

## Pagination Parsing

The page parameter originates outside the application and must be validated.

TA-50 introduces:

```ts
const parsePage = (value: string | null): number => {
  if (value === null) {
    return 1;
  }

  const parsedPage = Number(value);

  if (!Number.isInteger(parsedPage) || parsedPage < 1) {
    return 1;
  }

  return parsedPage;
};
```

The algorithm is:

```text
Read page
↓
Missing?
├── Yes → 1
└── No
    ↓
Convert to number
    ↓
Integer and >= 1?
├── Yes → parsed page
└── No  → 1
```

Examples:

```text
?page=3
→ 3

?page=hello
→ 1

?page=0
→ 1

?page=-4
→ 1

?page=2.5
→ 1
```

The parser does not invent a maximum page because `totalPages` is not known until the API responds.

---

## Pagination URL Updates

Pagination is updated through the URL rather than local `page` state.

Conceptually:

```ts
const updatePage = (nextPage: number) => {
  const nextSearchParams = new URLSearchParams(searchParams);

  if (nextPage <= 1) {
    nextSearchParams.delete("page");
  } else {
    nextSearchParams.set("page", String(nextPage));
  }

  setSearchParams(nextSearchParams);
};
```

Page 1 is treated as the canonical default.

Therefore:

```text
/tasks
```

represents page 1.

Later pages are represented explicitly:

```text
/tasks?page=2
/tasks?page=3
```

Returning to page 1 removes the parameter.

---

## Preserving Criteria During Pagination

Every URL update begins from:

```ts
new URLSearchParams(searchParams);
```

rather than constructing a new query string from scratch.

For example:

```text
/tasks?status=DONE&priority=HIGH
```

followed by Next becomes:

```text
/tasks?status=DONE&priority=HIGH&page=2
```

The active filters are preserved.

---

## Status Parsing

Supported Status values are:

```ts
const taskStatuses: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE", "CANCELLED"];
```

The URL parser validates the external value:

```ts
const parseStatus = (value: string | null): TaskStatus | undefined => {
  if (value === null) {
    return undefined;
  }

  return taskStatuses.find((status) => status === value);
};
```

Examples:

```text
?status=DONE
→ DONE

?status=BANANA
→ undefined
→ All statuses
```

Unsupported URL strings are not treated as valid `TaskStatus` values.

---

## Status URL Updates

Selecting a Status updates only that criterion and resets pagination.

Conceptually:

```ts
if (nextStatus === undefined) {
  nextSearchParams.delete("status");
} else {
  nextSearchParams.set("status", nextStatus);
}

nextSearchParams.delete("page");
```

Examples:

```text
/tasks
↓ select Done
/tasks?status=DONE
```

Clearing the filter:

```text
/tasks?status=DONE
↓ select All statuses
/tasks
```

---

## Priority Parsing

Supported Priority values are:

```ts
const taskPriorities: TaskPriority[] = ["LOW", "MEDIUM", "HIGH"];
```

The URL parser is:

```ts
const parsePriority = (value: string | null): TaskPriority | undefined => {
  if (value === null) {
    return undefined;
  }

  return taskPriorities.find((priority) => priority === value);
};
```

Examples:

```text
?priority=HIGH
→ HIGH

?priority=EXTREME
→ undefined
→ All priorities
```

---

## Priority URL Updates

Priority changes preserve unrelated criteria and reset pagination.

Example:

```text
/tasks?page=4&status=DONE
```

selecting High becomes:

```text
/tasks?status=DONE&priority=HIGH
```

The Status remains active while page is reset to its default.

---

## Sorting Parsing

TA-49 established:

```ts
export type TaskOrder = "ASC" | "DESC";
```

TA-50 validates sorting from the URL:

```ts
const parseSort = (value: string | null): TaskOrder => {
  if (value === "ASC" || value === "DESC") {
    return value;
  }

  return "DESC";
};
```

Examples:

```text
?sort=ASC
→ ASC

?sort=DESC
→ DESC

?sort=RANDOM
→ DESC

?sort=asc
→ DESC

no sort parameter
→ DESC
```

---

## Canonical Default Sorting

`DESC` is the established default sorting direction.

TA-50 therefore treats:

```text
/tasks
```

as equivalent to the default descending collection.

Selecting Ascending adds:

```text
?sort=ASC
```

Returning to Descending removes the sort parameter.

This avoids unnecessarily verbose default URLs.

---

## Search Architecture

Search requires a slightly different model because TA-47 established a 500 ms debounce.

The required interaction is:

```text
User typing
↓
Immediate visible input
↓
500 ms debounce
↓
Effective search committed to URL
↓
API search
```

The reverse flow must also work:

```text
Direct URL / Refresh / Back / Forward
↓
URL search value
↓
Visible search input restored
↓
API search restored
```

The final ownership model is therefore:

```text
URL
→ effective search criterion

Local component state
→ transient input while typing
```

---

## URL-Derived Effective Search

The effective search is derived from:

```ts
const search = searchParams.get("search")?.trim() ?? "";
```

A URL such as:

```text
/tasks?search=meeting
```

therefore produces:

```text
search = "meeting"
```

which becomes part of `TaskReadParams`.

---

## Transient Search Input

The search control retains local state only for the transient typing/debounce experience.

Conceptually:

```ts
const [searchInput, setSearchInput] = useState(initialSearch);

const debouncedSearch = useDebounce(searchInput, 500);
```

The input updates immediately while the effective URL-backed criterion waits for the debounce period.

---

## Search Component Boundary

The transient search behavior is isolated in a focused search-input component.

Its responsibility is:

```text
Initial URL search
↓
Local input value
↓
User typing
↓
500 ms debounce
↓
Trim
↓
Notify parent of effective search
```

It does not own the effective Task collection query state.

---

## Keyed Search Restoration

The search component is rendered using the effective URL search as its React key:

```tsx
<TaskSearchInput key={search} initialSearch={search} onSearchChange={handleSearchChange} />
```

When browser navigation changes:

```text
?search=apple
```

to:

```text
?search=banana
```

the key changes from:

```text
apple
```

to:

```text
banana
```

React creates a new search-input instance initialized with the new URL value.

This restores the visible input from URL navigation without synchronously calling `setState` inside an effect.

---

## Debounced Search URL Updates

After the 500 ms debounce, the parent commits the effective search to the URL.

Conceptually:

```ts
if (nextSearch === search) {
  return;
}

const nextSearchParams = new URLSearchParams(searchParams);

if (nextSearch === "") {
  nextSearchParams.delete("search");
} else {
  nextSearchParams.set("search", nextSearch);
}

nextSearchParams.delete("page");

setSearchParams(nextSearchParams, { replace: true });
```

The page is reset when the effective search changes.

---

## Replace Navigation for Search

Debounced search updates use:

```ts
{
  replace: true;
}
```

This prevents intermediate settled typing states from unnecessarily filling browser history.

The desired history behavior is not:

```text
?search=t
?search=ta
?search=tas
?search=task
```

for normal typing.

Pagination, Status, Priority, and sorting interactions continue to use normal navigation history.

---

## Clearing Search

When the effective search becomes empty:

```ts
nextSearchParams.delete("search");
```

is used.

Therefore:

```text
/tasks?search=meeting
```

becomes:

```text
/tasks
```

when no unrelated criteria are active.

If filters remain active, they are preserved.

---

## Search Pagination Reconciliation

Pagination resets when the effective debounced search is committed.

For example:

```text
/tasks?page=4
↓
user types search
↓
input updates immediately
↓
500 ms debounce
↓
search committed
↓
page removed
↓
effective page = 1
```

This aligns pagination reconciliation with the actual search criterion used by the API.

---

## Pagination Reconciliation Rules

TA-50 establishes:

| Interaction     | Pagination Behavior |
| --------------- | ------------------- |
| Page change     | Change page only    |
| Search change   | Reset to page 1     |
| Status change   | Reset to page 1     |
| Priority change | Reset to page 1     |
| Sort change     | Reset to page 1     |

This prevents stale page selections from carrying into newly constrained or reordered collections.

---

## Canonical Default URL

The default Task collection uses:

```text
/tasks
```

The following defaults are omitted:

```text
page = 1
search = empty
status = All statuses
priority = All priorities
sort = DESC
```

This avoids URLs such as:

```text
/tasks?page=1&search=&status=&priority=&sort=DESC
```

---

## Runtime Validation Boundaries

TA-50 now protects two external/runtime boundaries.

### UI Boundary

```text
Native control
↓
browser string
↓
validate / narrow
↓
Task domain value
```

### URL Boundary

```text
Browser URL
↓
URLSearchParams
↓
string | null
↓
parse / validate
↓
Task domain value
```

TypeScript alone cannot validate values coming from the URL at runtime.

---

## Malformed URL Handling

Malformed and unsupported parameters safely fall back without breaking the page.

### Page

```text
?page=hello → 1
?page=0     → 1
?page=-5    → 1
?page=2.5   → 1
```

### Status

```text
?status=BANANA
→ All statuses
```

### Priority

```text
?priority=EXTREME
→ All priorities
```

### Sort

```text
?sort=RANDOM
?sort=UP
?sort=asc
```

all fall back to:

```text
Descending
```

TA-50 does not automatically rewrite malformed URLs. It safely normalizes their effective runtime values.

---

## URL Encoding

`URLSearchParams` handles query-string encoding.

For example:

```text
project meeting
```

may be represented as:

```text
search=project+meeting
```

while the application-facing search value remains:

```text
project meeting
```

The application does not manually concatenate query strings.

---

## Whitespace Handling

Search values are normalized using:

```ts
trim();
```

at the effective search boundary.

Whitespace-only searches therefore behave as no active search.

---

## Query Integration

The existing Task query architecture remains unchanged:

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

TA-50 changes the origin of those values rather than redesigning the data layer.

---

## Query Cache Identity

The existing Task query key includes `TaskReadParams`.

Therefore URL-derived collection criteria continue to participate in deterministic TanStack Query cache identity.

Conceptually:

```text
URL
↓
validated TaskReadParams
↓
taskQueryKeys.list(params)
↓
distinct server-state identity
```

No query-key changes were required.

---

## Browser History

Pagination, Status, Priority, and sorting updates create normal navigation history.

Search uses replacement navigation for debounced updates.

Manual Back/Forward testing confirmed that URL-backed collection state restores correctly across browser history.

The following were compared during testing:

```text
Address bar
Search input
Status
Priority
Sort
Page indicator
Task results
```

---

## Refresh and Direct Navigation

Valid Task collection URLs can be refreshed or opened directly.

The effective collection criteria restore from the URL and are passed back through the existing Task query architecture.

Manual validation covered combinations of:

```text
page
search
status
priority
sort
```

---

## Files Modified

```text
src/pages/Tasks.tsx
```

---

## Files Created

Production implementation:

```text
None
```

TA-50 intentionally avoids introducing a URL-state hook or utility abstraction before there is sufficient reuse to justify one.

---

## Existing Architecture Preserved

No unnecessary modifications were made to:

```text
src/components/tasks/TaskFilters.tsx
src/components/tasks/TaskSort.tsx
src/components/tasks/TaskList.tsx
src/hooks/useTasks.ts
src/constants/taskQueryKeys.ts
src/services/taskService.ts
```

The existing components and data layer already provide the required boundaries.

---

## Manual QA

Validated:

```text
Default page state                       PASS
Page URL updates                         PASS
Direct page URL                          PASS
Page refresh persistence                 PASS
Invalid page fallback                    PASS

Status URL updates                       PASS
Status clearing                          PASS
Direct Status URL                        PASS
Status refresh persistence               PASS
Invalid Status fallback                  PASS

Priority URL updates                     PASS
Priority clearing                        PASS
Direct Priority URL                      PASS
Priority refresh persistence             PASS
Invalid Priority fallback                PASS

Sort URL updates                         PASS
ASC persistence                          PASS
DESC canonical/default behavior          PASS
Invalid Sort fallback                    PASS

Search URL synchronization               PASS
500 ms debounce                          PASS
Search clearing                          PASS
Direct Search URL                        PASS
Search refresh persistence               PASS
Search URL encoding                      PASS
Whitespace handling                      PASS
Rapid typing                             PASS

Search + Pagination                      PASS
Search + Filters                         PASS
Search + Sorting                         PASS

Pagination preserves criteria            PASS
Search resets pagination                 PASS
Status resets pagination                 PASS
Priority resets pagination               PASS
Sort resets pagination                   PASS

Combined URL criteria                    PASS
Malformed combined URLs                  PASS
Browser Back                             PASS
Browser Forward                          PASS
Keyboard interaction regression          PASS
Unsupported URL values do not crash      PASS
```

---

## UI Follow-Up

Manual QA identified that the current Task collection does not provide dedicated:

```text
Clear Search
Clear Filters
Reset All
```

controls.

Users currently clear each criterion through its existing control.

This is intentionally outside TA-50.

Future Task collection UI work should consider:

- Clear Search
- Clear Filters
- Reset All
- active-filter indication
- disabled or hidden reset behavior when no criteria are active
- keyboard accessibility
- accessible naming
- responsive placement

These improvements belong to the dedicated UI Components & Design System work rather than URL-state synchronization.

---

## Scope Boundaries

TA-50 does not introduce:

- new search capabilities
- new filtering capabilities
- new sorting capabilities
- new pagination capabilities
- Clear Search control
- Clear Filters control
- Reset All control
- new Task query architecture
- new Task service architecture
- generalized loading/error UX
- Task CRUD
- authentication
- full Task collection redesign

---

## Validation Commands

After the final search refactor, rerun:

```bash
npm run lint
npm run format
npm run build
git diff --check
```

All quality gates must pass before merge.

---

## Evidence Required

Final evidence should include:

- page URL synchronization
- search URL synchronization
- Status URL synchronization
- Priority URL synchronization
- Sort URL synchronization
- direct valid URL restoration
- refresh persistence
- malformed page fallback
- malformed Status fallback
- malformed Priority fallback
- malformed Sort fallback
- pagination preserving active criteria
- search resetting pagination
- filters resetting pagination
- sorting resetting pagination
- combined five-criterion URL
- URL encoding
- whitespace search handling
- browser Back navigation
- browser Forward navigation
- keyboard regression validation
- successful lint
- successful formatting validation
- successful production build

---

## Relationship to Previous Tickets

### TA-46

Established server-driven Task pagination.

### TA-47

Established debounced API-backed Task search.

### TA-48

Established Status and Priority filtering.

### TA-49

Established API-backed Task sorting.

### TA-50

Synchronizes all established Task collection criteria with URL state:

```text
page
search
status
priority
sort
```

---

## Result

TA-50 changes the Task collection from transient collection state:

```text
React state
↓
Task query
```

to predictable URL-backed state:

```text
URL
↓
runtime validation
↓
Task collection criteria
↓
TanStack Query
↓
Todo API
```

The resulting Task collection supports:

```text
Shareable state
Refresh persistence
Direct navigation
Browser history
Safe URL input validation
Deterministic query criteria
Pagination reconciliation
Existing debounce behavior
Existing API/query architecture
```
