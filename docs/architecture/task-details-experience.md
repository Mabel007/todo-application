# Task Details Experience

---

## Document Information

| Field          | Value                         |
| -------------- | ----------------------------- |
| Category       | Frontend Architecture         |
| Related Ticket | TA-45                         |
| Epic           | Epic 4 - Task Management Core |
| Release        | v0.4.0                        |
| Status         | Implemented                   |

---

## Overview

TA-45 introduces the user-facing Task Details experience.

The implementation connects the Task List established in TA-44 to a routed page for viewing a specific Task.

The feature reuses the Task domain, read service, query keys, and TanStack Query hooks established in TA-42 and TA-43 rather than recreating those layers.

The resulting architecture keeps route handling and presentation separate from data retrieval.

---

## Architecture

The complete Task Details read flow is:

```text
Task List
    ↓
Task Link
    ↓
/tasks/{task.id}
    ↓
React Router
    ↓
TaskDetails
    ↓
useParams()
    ↓
taskId
    ↓
useTask(taskId)
    ↓
getTaskById(taskId)
    ↓
Shared Axios Client
    ↓
Todo API
```

TA-45 owns:

- route integration
- Task Details presentation
- Task information hierarchy
- navigation from the Task List
- back-to-list navigation
- responsive behavior
- baseline accessibility

TA-45 does not own HTTP requests or query architecture.

---

## Task Details Page

The Task Details page is implemented in:

```text
src/pages/TaskDetails.tsx
```

It represents the screen for viewing one specific Task.

The page reads the route identifier and delegates retrieval to the existing Task query hook.

Conceptually:

```text
TaskDetails
      ↓
useParams()
      ↓
taskId
      ↓
useTask(taskId)
```

No direct Axios request is performed by the page.

---

## Dynamic Task Route

The Task Details route follows the pattern:

```text
/tasks/:taskId
```

The static portion is:

```text
/tasks/
```

The dynamic segment is:

```text
:taskId
```

A URL such as:

```text
/tasks/abc123
```

provides:

```text
taskId = "abc123"
```

to the routed page.

---

## Central Route Definition

The central route paths include the Task Details route.

Conceptually:

```ts
taskDetails: "/tasks/:taskId";
```

The routing structure becomes:

```text
/tasks
→ Task collection

/tasks/:taskId
→ Task Details

*
→ Application Not Found page
```

The Task Details route remains separate from the application's wildcard route.

---

## Route Parameter Boundary

React Router route parameters may be unavailable at the component boundary.

The Task Details page therefore does not assume that the identifier is automatically valid API data.

The value is passed to the existing TA-43 detail hook:

```ts
useTask(taskId);
```

TA-43 already owns conditional query execution and prevents invalid requests when an identifier is unavailable.

TA-45 does not redesign that behavior.

---

## Query Layer Reuse

TaskDetails consumes:

```text
useTask()
```

from the existing Task query layer.

The page does not call:

```text
getTaskById()
```

directly.

It also does not call:

```text
apiClient.get(...)
```

directly.

The architecture remains:

```text
Presentation
     ↓
Query Hook
     ↓
Service
     ↓
HTTP Client
```

---

## Safe Rendering

Task data is not necessarily available during the first render.

TA-45 therefore guards access to Task properties.

The current boundary is conceptually:

```text
Task available?
    │
    ├── No
    │    ↓
    │ return without Task presentation
    │
    └── Yes
         ↓
      render details
```

This prevents unsafe property access.

Final loading presentation remains outside TA-45.

---

## Loading and Error Ownership

TA-45 deliberately does not implement the project's complete asynchronous-state experience.

### TA-51

Owns dedicated Task loading and empty-state UX.

### TA-52

Owns dedicated Task retrieval-error and task-not-found UX.

TA-45 only performs the minimum defensive rendering required to safely display Task data.

---

## Task Information Presented

The current Task Details experience displays:

```text
Name
Description
Status
Priority
Start
End
Created At
```

Nullable fields are shown only when values exist.

The UI does not expose every API field merely because it exists in the Task model.

---

## Task Name

The Task name is the primary page heading:

```html
<h1></h1>
```

This provides a clear page title and appropriate heading semantics.

---

## Description

When present, the Task description is rendered as normal paragraph content:

```html
<p></p>
```

It has lower visual emphasis than the Task heading while remaining readable.

When the Task has no description, no empty description block is displayed.

---

## Task Metadata

Task metadata is represented using a semantic description list:

```html
<dl>
  <dt>Status</dt>
  <dd>To Do</dd>
</dl>
```

This structure represents label/value relationships directly in HTML.

Metadata includes supported values such as:

- Status
- Priority
- Start
- End
- Created At

---

## Nullable Metadata

The Task model contains nullable properties.

For example:

```ts
description: string | null;
start: string | null;
end: string | null;
createdAt: string | null;
```

TA-45 checks each nullable value before rendering it.

Conceptually:

```text
Does value exist?
      │
      ├── Yes
      │    ↓
      │ render label + value
      │
      └── No
           ↓
         omit pair
```

This prevents output such as:

```text
Start:
```

with no corresponding value.

---

## Shared Task Labels

Task status and priority values originate from the API as domain values such as:

```text
TODO
IN_PROGRESS
MEDIUM
```

The application presents these values using human-readable labels.

Shared mappings are defined in:

```text
src/constants/taskLabels.ts
```

### Status Labels

```text
TODO
→ To Do

IN_PROGRESS
→ In Progress

DONE
→ Done

CANCELLED
→ Cancelled
```

### Priority Labels

```text
LOW
→ Low

MEDIUM
→ Medium

HIGH
→ High
```

Both TaskList and TaskDetails reuse these mappings.

This avoids duplicating presentation terminology.

---

## Date Formatting

A reusable date utility is defined in:

```text
src/utils/formatDate.ts
```

The formatter owns presentation of supported Task date strings.

The responsibility split is:

```text
TaskDetails
→ decides if and where a date is rendered

formatDate
→ decides how the date is displayed
```

The formatter uses a readable `en-GB` representation with:

```text
day
short month
year
```

This prevents raw API timestamps from being displayed directly to users.

---

## Task List Navigation

TA-44 introduced the Task collection.

TA-45 connects each Task name to its details route.

Conceptually:

```text
Task List
    ↓
Task name
    ↓
React Router Link
    ↓
/tasks/{task.id}
    ↓
Task Details
```

This establishes the approved Task collection-to-detail navigation path.

---

## Back Navigation

TaskDetails provides a visible link back to the Task collection:

```text
← Back to Tasks
```

The link targets:

```text
/tasks
```

A deterministic collection link is used instead of relying on:

```text
navigate(-1)
```

because browser history may not always originate from the Task collection.

The explicit `/tasks` destination guarantees predictable behavior.

---

## Decorative Icon

The back-navigation arrow uses a Lucide icon.

Because visible link text already communicates the action, the icon is decorative and uses:

```text
aria-hidden="true"
```

This prevents duplicate announcement by assistive technology.

---

## Responsive Layout

Task metadata is responsive.

### Mobile

```text
single column
```

### `sm` Breakpoint and Above

```text
two columns
```

Conceptually:

```text
grid-cols-1
sm:grid-cols-2
```

This provides enough width for metadata while allowing values to wrap naturally.

---

## Content Width

The Task Details container uses a constrained maximum width.

Conceptually:

```text
max-w-md
mx-auto
```

The amount of information presented by TA-45 does not require a wide desktop layout.

The constrained width improves readability and prevents excessive line lengths.

---

## Accessibility

TA-45 includes baseline accessibility requirements.

The page uses:

- a single primary heading
- semantic sections
- paragraph content
- semantic description lists
- real navigation links
- visible keyboard focus
- keyboard-operable navigation
- text-based status and priority presentation
- responsive content that reflows without horizontal scrolling

Status and priority meaning is not conveyed by color alone.

---

## Focus Styling

Navigation uses visible `focus-visible` styling.

The implementation relies on existing ShadCN/Tailwind design tokens rather than hard-coded arbitrary focus colors.

This provides consistency with the rest of the application.

---

## Deep Linking

Because Task Details has its own dynamic route, users can navigate directly to URLs such as:

```text
/tasks/abc123
```

React Router resolves the URL to TaskDetails.

The route identifier is then passed through the existing Task query architecture.

Deep-link behavior should be included in manual QA.

---

## Service Boundary

The complete responsibility chain is:

| Layer               | Responsibility                  |
| ------------------- | ------------------------------- |
| Route               | Identify requested Task         |
| TaskDetails         | Present Task information        |
| `useTask()`         | Manage Task detail server state |
| `getTaskById()`     | Perform Task detail request     |
| Shared Axios client | Common HTTP infrastructure      |
| API                 | Provide Task data               |

No layer duplicates another layer's responsibility.

---

## Error Boundary Separation

A missing Task and an unknown client-side URL are not the same problem.

### Unknown Client Route

Owned by the existing application wildcard/Not Found routing.

### Task Does Not Exist

Handled by Task retrieval behavior and ultimately TA-52.

### React Render Failure

Handled by the Application Error Boundary.

TA-45 does not merge these states.

---

## Scope Boundaries

TA-45 intentionally does not implement:

- create Task
- edit Task
- delete Task
- mutation hooks
- optimistic updates
- pagination
- search
- filtering
- sorting
- URL collection-state synchronization
- final loading UI
- dedicated task-not-found UI
- dedicated retrieval-error UI
- authentication
- protected routes
- new Axios infrastructure
- new query infrastructure

These responsibilities remain assigned to downstream tickets.

---

## Manual QA

TA-45 should be validated against:

### Routing

- `/tasks/:taskId` resolves correctly
- route identifier reaches `useTask()`
- direct detail URL navigation works
- browser refresh on the detail route works in development

### Data

- correct Task is displayed
- Task name renders correctly
- optional description renders only when present
- nullable dates render safely
- no undefined properties are displayed

### Navigation

- Task List links open the correct Task
- Back to Tasks returns to `/tasks`
- navigation remains client-side

### Accessibility

- one clear `<h1>` exists
- links are keyboard operable
- focus is visible
- metadata has semantic label/value relationships
- status and priority remain understandable without color

### Responsive Design

Validate representative:

- mobile
- tablet
- desktop

Confirm:

- no horizontal overflow
- long names wrap
- long descriptions wrap
- metadata remains readable
- navigation remains usable

### Architecture

Confirm:

- no direct Axios call exists in TaskDetails
- existing `useTask()` is reused
- existing `getTaskById()` remains reused through the query layer
- no duplicate Task data infrastructure exists

### Scope

Confirm TA-45 contains no:

- create/edit/delete controls
- mutations
- pagination
- search
- filtering
- sorting
- authentication
- final error/not-found UI
- future-ticket functionality

---

## Validation Commands

Before completing TA-45, run:

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

Established:

```text
Task domain models
+
Task read services
```

### TA-43

Established:

```text
Task query keys
+
Task read hooks
```

### TA-44

Established:

```text
Task collection presentation
```

### TA-45

Adds:

```text
Task detail route
+
Task details presentation
+
collection-to-detail navigation
```

The combined read architecture is now:

```text
Task Collection
      ↓
Task List
      ↓
Task Details Link
      ↓
Task Details Route
      ↓
Task Details Page
      ↓
Task Query Hook
      ↓
Task Read Service
      ↓
Todo API
```

---

## Related Documentation

- Task Domain Models and Read API Services
- Task Query Keys and TanStack Query Hooks
- Task List Experience
- Routing
- Application Layout
- API Client
- API Error Normalization
- Frontend Architecture
- Project Structure
- Accessibility Standards

---

## Future Integration

Later tickets may extend this experience with:

- pagination
- search
- filtering
- sorting
- URL query-state synchronization
- loading and empty-state presentation
- Task retrieval-error states
- Task not-found states
- Task CRUD actions

Those capabilities should only be introduced through their corresponding Jira tickets.
