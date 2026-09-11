# Task List Experience

---

## Document Information

| Field          | Value                                          |
| -------------- | ---------------------------------------------- |
| Category       | Frontend Architecture                          |
| Related Ticket | TA-44                                          |
| Title          | Implement Task List Experience                 |
| Epic           | Epic 4 - Task Management Core                  |
| Release        | v0.4.0                                         |
| Branch         | `feature/TA-44-implement-task-list-experience` |
| Status         | Implemented                                    |

---

## Overview

TA-44 introduces the first user-facing, API-backed Task collection experience in the Todo
Application.

The Tasks page consumes the read architecture established by TA-42 and TA-43 and converts the
returned server state into a concise, responsive collection. The page presents the collection
total and the list-level information needed to identify each Task: its name, optional description,
status, and priority.

TA-44 owns presentation. It does not redesign the Task domain, HTTP services, query keys, or
TanStack Query integration.

---

## Architecture

The implemented data flow is:

```text
Tasks Page
    ↓
useTasks(params)
    ↓
TanStack Query
    ↓
existing task service
    ↓
shared Axios client
    ↓
Todo API
```

`Tasks.tsx` calls the existing `useTasks()` collection hook. That hook owns the TanStack Query
integration, delegates retrieval to the existing Task service, and uses the centralized Task query
keys.

The presentation layer does not call Axios because HTTP configuration, response typing,
interceptors, error normalization, and diagnostics already belong to the shared API and service
layers. It also does not recreate `useQuery`; doing so would duplicate cache identity and
server-state behavior that TA-43 already centralized.

---

## Query Usage

The Tasks page supplies a fixed initial read request:

```ts
const initialTaskParams = {
  page: 1,
  limit: 10,
} as const;

const { data, isError, isLoading } = useTasks(initialTaskParams);
```

Passing these values through `useTasks()` keeps request parameters within the existing typed
`TaskReadParams` contract and includes them in the existing Task collection query key.

`page: 1` and `limit: 10` describe the requested server-side slice. They do not implement
pagination UI. Users cannot change the page or limit in TA-44, and the page does not synchronize
query state with the URL.

The response can contain up to 10 records in `data.data` while `data.meta.total` reports the
number of matching Tasks across the full server collection. The rendered record count and the
collection total are therefore different concepts. The page renders the requested slice from
`data.data` and displays the API-provided collection total from `data.meta.total`.

---

## TaskList Presentation Boundary

`TaskList` is a focused presentation component. It receives an already-fetched `Task[]`; it
does not fetch, cache, copy, or mutate server data.

Its responsibilities are:

- render the Task collection as a semantic list;
- use each stable Task identifier as its React render key;
- show the Task name, optional description, status, and priority;
- translate machine-readable status and priority values into readable labels;
- omit a nullable description when no description exists;
- keep long content safe within the available layout;
- provide the minimal empty defensive message when the supplied collection is empty.

The local label maps translate values such as `IN_PROGRESS` to `In Progress` and `HIGH` to
`High`. The original typed values remain unchanged.

---

## React List Keys

Each Task list item uses:

```tsx
key={task.id}
```

`task.id` is stable across renders and identifies the same domain entity when records are
reordered, added, or removed. This allows React to preserve the correct relationship between an
entity and its rendered element.

An array index is positional rather than entity-based, so `key={index}` can associate the wrong
rendered element with a Task after collection changes. Random keys change on every render and
force React to discard and recreate elements unnecessarily.

React render keys are not TanStack Query cache keys. The React key identifies one rendered Task
within the list. The centralized TanStack Query key identifies the cached server query, including
its collection parameters.

---

## Semantic HTML

The implementation uses:

- `<section>` for the page-level Tasks region;
- `<header>` for the page heading and supporting text;
- one `<h1>` for the Tasks page;
- `<ul>` for the Task collection;
- `<li>` for each Task;
- `<article>` for each self-contained Task summary;
- `<h2>` for each Task name;
- `<dl>`, `<dt>`, and `<dd>` for status and priority metadata;
- `<p>` for descriptions and defensive state messages.

The shared application layout already owns the `<main>` landmark, so the Tasks page does not
create a nested main landmark.

Native elements communicate the collection, item, heading, and metadata relationships without
generic nested or clickable `div` structures. Task items are not made artificially interactive
because no Task Details destination currently exists.

---

## Accessibility

The page maintains a logical heading hierarchy: the page has one `h1`, and each Task summary has
an `h2` associated with its article.

Status and priority are presented as visible text with visible `Status:` and `Priority:` terms.
Their meaning does not depend on color. No badge color system or color-only encoding is introduced.

The native list and definition-list structures expose useful semantics without redundant ARIA.
The page region uses `aria-labelledby` to associate it with the visible Tasks heading. The small
loading message uses `role="status"`, and the retrieval failure message uses `role="alert"`.

TA-44 adds no non-native interactive controls. Existing Header navigation remains keyboard
operable, while future Task-detail links will be introduced with the owning route rather than
simulated with clickable containers.

Long names and descriptions can wrap instead of clipping or forcing horizontal overflow. The
flexible metadata layout can wrap during narrow-screen reflow.

---

## Responsive Behavior

The implementation relies on the existing responsive application shell and uses a small set of
local layout protections:

- `min-w-0` allows Task rows to shrink within their container;
- `break-words` allows long names and descriptions to wrap;
- `flex-wrap` lets status and priority metadata move onto additional lines;
- `gap-x-5` and `gap-y-2` preserve readable spacing after wrapping;
- `p-4 sm:p-5` increases row padding at the existing small breakpoint;
- `line-clamp-2` limits description previews to two lines;
- the list uses the available container width without a fixed width.

These techniques provide the baseline TA-44 responsive behavior. Representative browser-width,
zoom, and reflow checks remain part of manual QA before ticket closure.

---

## Loading, Error, and Empty Boundary

TA-44 includes only the defensive states required to keep asynchronous rendering safe:

- `Loading tasks…`
- `Tasks could not be loaded.`
- `No tasks are available.`

The Task list renders only after data is available. It does not attempt to read collection data
during the initial request or after a failed request.

These messages are intentionally minimal:

- TA-51 owns the dedicated loading and empty Task experience.
- TA-52 owns the dedicated retrieval error and not-found experience.

TA-44 does not introduce skeletons, illustrations, retry controls, specialized error pages, or
other polished asynchronous-state systems.

---

## Task Details Boundary

TA-44 does not add Task Details navigation because the current repository does not define a Task
Details route or route helper. Creating a destination during this ticket would invent routing and
detail behavior outside the established architecture.

TA-45 owns the Task Details experience. Its implementation can add semantic links to the Task
summaries after the corresponding route contract exists.

---

## Scope Boundaries

TA-44 does not implement:

- pagination controls;
- search;
- filtering;
- sorting;
- URL query-state synchronization;
- Task create, update, delete, or archive controls;
- mutations;
- authentication;
- Task Details content or routing;
- advanced loading or empty-state UX;
- advanced retrieval error or not-found UX;
- design-system or theme architecture;
- Home dashboard functionality.

The fixed initial query parameters and collection metadata are foundations for reading the first
slice only. They do not authorize later interaction features.

---

## Files Changed

### Tasks Page

```text
src/pages/Tasks.tsx
```

Responsibilities:

- call `useTasks()` with the fixed initial parameters;
- own query-state branching;
- display the API collection total;
- pass fetched Task records into `TaskList`;
- provide the page heading and supporting text.

### TaskList

```text
src/components/tasks/TaskList.tsx
```

Responsibilities:

- render an already-fetched Task collection;
- provide semantic list and per-Task summary markup;
- humanize status and priority values;
- safely handle nullable descriptions and an empty array;
- provide baseline responsive content behavior.

---

## Automated Validation

The implementation completed:

```text
npm run lint
npm run format
npm run format:check
npm run build
git diff --check
```

All commands passed. The development server also returned HTTP 200 for `/tasks`.

Browser-based responsive and interactive manual QA remains required before TA-44 closure.

---

## Manual QA Checklist

- [ ] `/tasks` loads successfully.
- [ ] API records render.
- [ ] Exactly the requested page slice is rendered.
- [ ] The API collection total is displayed correctly.
- [ ] The collection total is not mistaken for the rendered-record count.
- [ ] Task names render correctly.
- [ ] Optional descriptions render safely.
- [ ] A missing description does not leave broken UI.
- [ ] Status renders correctly.
- [ ] `IN_PROGRESS` displays as `In Progress`.
- [ ] Priority renders correctly.
- [ ] Long Task names wrap safely.
- [ ] Long descriptions do not break the layout.
- [ ] Multiple Tasks render.
- [ ] One Task renders.
- [ ] The empty defensive state remains safe.
- [ ] The loading defensive state remains safe.
- [ ] The error defensive state remains safe.
- [ ] No horizontal overflow occurs at approximately 320px.
- [ ] The page is usable at approximately 375px and 390px.
- [ ] The page is usable at approximately 768px.
- [ ] The page is usable at approximately 1024px.
- [ ] The page is usable at approximately 1280px and wider.
- [ ] Browser zoom and reflow remain usable.
- [ ] The semantic heading hierarchy is correct.
- [ ] Keyboard navigation remains usable.
- [ ] The existing Home route works.
- [ ] Header, Footer, and shared layout remain correct.
- [ ] The Not Found route remains unaffected.
- [ ] No pagination controls exist.
- [ ] No search controls exist.
- [ ] No filter controls exist.
- [ ] No sorting controls exist.
- [ ] No CRUD controls exist.
- [ ] No Task Details implementation exists.
- [ ] No temporary console logging exists.

---

## Related Documentation

- Task Domain Models and Read API Services
- Task Query Keys and TanStack Query Hooks
- Server State
- API Client
- API Error Normalization
- Application Layout
- Routing

---

## Learning Summary

> TA-44 does not own fetching architecture. It consumes the task server-state architecture
> established by TA-42 and TA-43 and converts that data into an accessible, responsive user-facing
> collection experience.
