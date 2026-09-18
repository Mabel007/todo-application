# Task Collection States

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-51                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-51 introduces explicit presentation states for the Todo Application Task collection.

The Task experience now distinguishes between:

- Initial loading
- A genuinely empty Task collection
- No Tasks matching active search or filter criteria
- A populated Task collection
- Background collection transitions where existing usable data should remain visible

The implementation builds on the existing TanStack Query architecture and the URL-backed Task collection state established in TA-50.

Retrieval errors remain within TA-52 scope.

---

## Collection State Model

The Task collection follows this decision model:

```text
useTasks(params)
↓
Query state + collection data
↓
Initial loading?
├── Yes → Loading
└── No
    ↓
    Retrieval error?
    ├── Yes → Existing error presentation
    └── No
        ↓
        Successful data
        ↓
        Total Tasks = 0?
        ├── No → Task List + Pagination
        └── Yes
            ↓
            Active narrowing criteria?
            ├── Yes → No Results
            └── No  → Empty Collection
```

This prevents different zero-data scenarios from being presented as if they mean the same thing.

---

## Initial Loading

Initial loading occurs while the initial Task collection request is being resolved and usable collection data is not yet available.

The Tasks page uses the existing TanStack Query loading state and renders:

```tsx
<TaskCollectionState
  title="Loading tasks"
  description="Please wait while your tasks are being loaded."
/>
```

The loading presentation provides meaningful visible text and an accessible status region.

---

## Initial Loading vs Background Fetching

Initial loading and background fetching represent different user experiences.

Conceptually:

```text
No usable data + initial request
→ Initial Loading

Existing usable data + another request
→ Background Fetching
```

The application should not unnecessarily replace existing usable Task content with a full loading state during normal collection transitions.

---

## TanStack Query Integration

The existing `useTasks()` hook already uses:

```ts
placeholderData: keepPreviousData;
```

This allows previous successful collection data to remain available while a changed Task query is being fetched.

TA-51 preserves this architecture.

No additional previous-data state was introduced.

For example, TA-51 does not add:

```ts
const [previousTasks, setPreviousTasks] =
  useState(...)
```

TanStack Query remains responsible for server-state lifecycle behavior.

---

## Placeholder Data

Existing pagination behavior continues to use:

```ts
isPlaceholderData;
```

while a changed collection query is resolving.

This prevents pagination interactions from being based on stale metadata while placeholder collection data is being presented.

---

## Empty Collection

A genuine empty collection means:

```text
Successful Task request
+
zero matching Tasks
+
no active search
+
no active Status filter
+
no active Priority filter
```

The application presents:

```tsx
<TaskCollectionState title="No tasks yet" description="Your task collection is currently empty." />
```

This communicates that the collection itself contains no Tasks for the current unrestricted result set.

---

## No Results

No Results represents a different situation:

```text
Successful Task request
+
zero matching Tasks
+
active result-narrowing criteria
```

The active criteria considered by TA-51 are:

```text
Search
Status
Priority
```

The presentation is:

```tsx
<TaskCollectionState
  title="No matching tasks"
  description="No tasks match your current search or filters."
/>
```

This tells the user that the collection query succeeded but the current criteria produced no matches.

---

## Active Criteria

TA-51 derives active narrowing criteria from the existing collection state:

```ts
const hasActiveCriteria = search.length > 0 || status !== undefined || priority !== undefined;
```

This is derived state.

No additional React state is necessary.

---

## Why Sorting Is Excluded

Sorting changes:

```text
the order of results
```

rather than:

```text
which Tasks belong in the result
```

Therefore `sort` is not treated as a result-narrowing criterion when deciding between Empty and No Results.

---

## Why Pagination Is Excluded

Pagination selects a subset of an existing result collection.

It does not define which Tasks belong to that collection.

Pagination is therefore not treated as a narrowing criterion for Empty versus No Results classification.

---

## Zero-Task Detection

TA-51 derives zero-result state from collection metadata:

```ts
const hasNoTasks = data?.meta.total === 0;
```

This is preferred over relying only on:

```ts
data.data.length;
```

because `data.data` represents the currently returned page while:

```text
meta.total
```

represents the total number of Tasks matching the current collection query.

---

## Derived No Results State

The No Results condition is:

```ts
const hasNoResults = hasNoTasks && hasActiveCriteria;
```

This supports zero-result scenarios caused by:

- Search
- Status
- Priority
- Search + Status
- Search + Priority
- Status + Priority
- Search + Status + Priority

---

## Derived Empty State

The genuine Empty condition is:

```ts
const hasEmptyCollection = hasNoTasks && !hasActiveCriteria;
```

This prevents a filtered or searched zero-result collection from being incorrectly presented as if the user has no Tasks at all.

---

## TaskCollectionState Component

TA-51 introduces:

```text
src/components/tasks/TaskCollectionState.tsx
```

The component provides shared presentation for collection states such as:

```text
Loading tasks
No tasks yet
No matching tasks
```

Its responsibility is presentation rather than collection-state classification.

Conceptually:

```text
Tasks.tsx
→ decides which state applies

TaskCollectionState.tsx
→ presents that state
```

---

## Why One Shared State Component

TA-51 does not introduce separate:

```text
TaskLoadingState
TaskEmptyState
TaskNoResultsState
```

components.

These states currently share enough presentation structure that three separate abstractions would add unnecessary complexity.

A single reusable collection-state component keeps the implementation focused while still separating presentation from decision logic.

---

## TaskList Responsibility

Before TA-51, `TaskList` contained a generic zero-task fallback.

Conceptually:

```tsx
if (tasks.length === 0) {
  return <p>No tasks are available.</p>;
}
```

This was insufficient because `TaskList` does not know whether zero Tasks resulted from:

- an empty collection
- search
- Status filtering
- Priority filtering

TA-51 removes that decision from `TaskList`.

The responsibility is now:

```text
Tasks.tsx
→ classify collection state

TaskList.tsx
→ render actual Task records
```

---

## Populated Collection

When the request succeeds and the collection contains Tasks, the existing Task list is rendered:

```tsx
<TaskList tasks={data.data} />
```

Pagination remains part of the populated collection branch.

---

## Pagination Presentation

Pagination is not rendered for genuine Empty or No Results states.

The desired behavior is:

```text
Empty
→ Empty presentation

No Results
→ No Results presentation

Populated
→ TaskList + Pagination
```

This prevents invalid or confusing states such as:

```text
0 tasks
No tasks yet
Page 1 of 0
```

---

## URL-State Integration

TA-51 preserves the URL-backed collection architecture from TA-50.

The flow remains:

```text
URL
↓
validated page/search/status/priority/sort
↓
TaskReadParams
↓
useTasks()
↓
Task collection response
↓
TA-51 state classification
↓
collection presentation
```

TA-51 does not introduce duplicate local collection state.

---

## Accessibility

Collection states provide visible textual information.

Normal collection-state messages use:

```text
role="status"
```

where appropriate.

The existing retrieval-error presentation continues to use:

```text
role="alert"
```

TA-51 does not:

- communicate state through color alone
- require icons to understand state
- move keyboard focus when state changes
- introduce custom inaccessible controls

Existing keyboard behavior for search, filters, sorting, and pagination remains intact.

---

## Error Boundary with TA-52

TA-51 does not classify failed Task requests as Empty or No Results.

The existing error presentation remains separate:

```tsx
{
  isError && (
    <p role="alert" className="text-destructive">
      Tasks could not be loaded.
    </p>
  );
}
```

TA-52 owns the final retrieval-error experience, including any expanded recovery or not-found behavior.

---

## Files Created

```text
src/components/tasks/TaskCollectionState.tsx
```

Purpose:

```text
Reusable accessible presentation for
Loading, Empty and No Results states.
```

---

## Files Modified

```text
src/pages/Tasks.tsx
src/components/tasks/TaskList.tsx
```

### `Tasks.tsx`

Updated to:

- derive active result-narrowing criteria
- detect zero matching Tasks
- distinguish Empty from No Results
- present explicit initial Loading state
- render populated Task collections separately
- render pagination only with populated results
- preserve URL-backed collection state
- preserve existing error handling for TA-52
- preserve placeholder-data pagination behavior

### `TaskList.tsx`

Updated to:

- remove the generic zero-task fallback
- focus exclusively on rendering actual Task records
- leave collection-state classification to the Tasks page

---

## Files Reviewed but Unchanged

```text
src/hooks/useTasks.ts
src/types/tasks.ts
```

The existing query and domain architecture already provide the required behavior.

---

## Manual QA

Validate the following scenarios:

### Initial Loading

Confirm the initial collection request presents:

```text
Loading tasks
```

with meaningful supporting text.

### Genuine Empty Collection

Confirm a successful unrestricted collection with zero Tasks presents:

```text
No tasks yet
```

### Search No Results

Confirm an active search producing zero matches presents:

```text
No matching tasks
```

### Status No Results

Confirm a Status criterion producing zero matches presents the No Results state.

### Priority No Results

Confirm a Priority criterion producing zero matches presents the No Results state.

### Combined No Results

Confirm combined narrowing criteria producing zero matches present the No Results state.

### Clear Criteria

Clear active search/filter criteria and verify the collection reclassifies correctly.

### Populated Collection

Confirm Tasks and pagination render normally when matching Tasks exist.

### Background Transition

Change collection criteria while previous data is available.

Confirm existing usable content is not unnecessarily replaced with the full initial-loading presentation.

### URL State

Verify refresh, direct Task URLs, and browser Back/Forward continue to restore the collection correctly.

### Accessibility

Verify:

- meaningful state text is visible
- loading/status communication is accessible
- retrieval errors remain alerts
- keyboard focus is not unexpectedly moved
- existing collection controls remain keyboard operable

### Responsive Behavior

Validate representative mobile, tablet, and desktop widths.

Confirm collection-state content remains readable and does not introduce horizontal overflow.

---

## Scope Boundaries

TA-51 intentionally does not introduce:

- final retrieval-error UX
- retry/recovery controls
- Task not-found handling
- Task CRUD
- authentication
- Skeleton design-system component
- spinner architecture
- new URL-state behavior
- new search capabilities
- new filtering capabilities
- new sorting capabilities
- new pagination capabilities

Retrieval errors and not-found behavior remain TA-52 scope.

---

## Validation Commands

Before merge, run:

```bash
npm run lint
npm run format
npm run build
git diff --check
```

All project quality gates must pass.

---

## Evidence Required

Final evidence should include:

- initial Loading state
- genuine Empty state
- Search No Results
- Status No Results
- Priority No Results
- combined No Results
- clearing criteria
- populated collection
- pagination
- background collection transition
- refresh/direct URL regression
- browser Back/Forward regression
- responsive validation
- accessibility validation
- successful lint
- successful formatting validation
- successful production build

---

## Relationship to Previous Tickets

### TA-46

Established Task pagination.

### TA-47

Established API-backed Task search.

### TA-48

Established Status and Priority filtering.

### TA-49

Established Task sorting.

### TA-50

Established URL-backed collection state.

### TA-51

Adds explicit presentation and classification for:

```text
Initial Loading
Empty Collection
No Results
Populated Collection
Background Collection Transitions
```

---

## Next Ticket Boundary

TA-52 owns:

```text
Task retrieval errors
Task not-found handling
final error-state presentation
recovery behavior where required
```

TA-51 deliberately leaves that work untouched.
