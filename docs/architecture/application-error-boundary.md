# Application Error Boundary

---

## Document Information

| Field              | Value                                                                |
| ------------------ | -------------------------------------------------------------------- |
| **Category**       | Architecture                                                         |
| **Related Ticket** | TA-38 - Implement Application Error Boundary and Fallback Experience |
| **Epic**           | TA-20 - Application Foundation                                       |
| **Release**        | v0.3.0                                                               |
| **Status**         | Complete                                                             |

---

## Overview

The Todo Application uses an application-level React Error Boundary to provide a controlled fallback when an unexpected render-time failure occurs within the routed application UI.

Without an Error Boundary, an uncaught React rendering failure can leave the affected application tree unavailable and result in a broken or blank experience.

TA-38 introduces a class-based Error Boundary that:

- catches unexpected render and lifecycle failures in its descendant React tree;
- replaces the failed application UI with a controlled fallback;
- provides a practical recovery action;
- prevents raw technical error details from being displayed to users;
- logs technical error information for development and manual QA;
- keeps API, query, form, and expected feature errors outside its responsibility.

The boundary is intentionally placed around `AppLayout` so that the routed application UI is protected without unnecessarily wrapping every page, component, or application provider.

---

## Relevant Files

The implementation affects the application error-handling and routing architecture:

```text
src/
├── components/
│   └── shared/
│       └── ApplicationErrorBoundary.tsx
│
└── routes/
    └── routeConfig.tsx
```

The responsibilities are:

| File                           | Responsibility                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------- |
| `ApplicationErrorBoundary.tsx` | Detects descendant React render failures and provides the fallback and recovery behavior |
| `routeConfig.tsx`              | Places the Error Boundary around the routed application layout                           |

---

## Architecture

The boundary is composed into the routed application tree around `AppLayout`.

```text
RouterProvider
└── ErrorBoundary
    └── AppLayout
        └── Outlet
            ├── Home
            └── Tasks
```

This establishes one application UI failure boundary rather than adding Error Boundaries throughout individual pages and components.

A render failure occurring within a covered route follows this flow:

```text
Covered Component
        │
        ▼
Unexpected Render Failure
        │
        ▼
ErrorBoundary
        │
        ├── Update boundary state
        ├── Record technical details for debugging
        └── Replace failed UI
        │
        ▼
Controlled Fallback
        │
        ▼
Try Again
        │
        ▼
Reset Boundary State
        │
        ▼
Attempt Render Again
```

---

## Error Boundary Pattern

The implementation uses React's class-based Error Boundary pattern.

The boundary maintains:

```ts
interface State {
  hasError: boolean;
  error: Error | null;
}
```

Its initial state is:

```ts
{
  hasError: false,
  error: null,
}
```

When no descendant error has been caught, the boundary renders:

```tsx
this.props.children;
```

When a covered descendant fails during rendering, the boundary updates its state and displays the fallback experience instead.

---

## Error Boundary Lifecycle

The implementation uses two React class lifecycle methods for different responsibilities.

### `getDerivedStateFromError`

```ts
public static getDerivedStateFromError(error: Error): State {
  return {
    hasError: true,
    error,
  };
}
```

`getDerivedStateFromError` updates the boundary state after a descendant throws.

Setting:

```text
hasError = true
```

causes the next render to display the fallback rather than attempting to continue rendering the failed application tree normally.

The captured `Error` is retained internally but is not displayed in the fallback UI.

### `componentDidCatch`

```ts
public componentDidCatch(
  error: Error,
  errorInfo: React.ErrorInfo,
): void {
  logger.error("APPLICATION_RUNTIME", "app.error_boundary.caught", {
  error: {
    name: error.name,
    message: error.message,
  },
  componentStack: errorInfo.componentStack,
});
}
```

`componentDidCatch` handles technical reporting for the caught failure.

The current implementation sends selected render-failure diagnostics through the centralized application logger. The logger applies environment-aware output and sanitization before writing technical diagnostics, while the user-facing fallback remains unchanged.

Technical information is not rendered to the user.

Production observability or external monitoring integration is outside TA-38.

---

## Boundary Placement

The boundary is placed in the route configuration:

```tsx
{
  path: routePaths.home,
  element: (
    <ErrorBoundary>
      <AppLayout />
    </ErrorBoundary>
  ),
  children: [
    {
      index: true,
      element: <Home />,
    },
    {
      path: routePaths.tasks,
      element: <Tasks />,
    },
  ],
}
```

This means `AppLayout` and the route elements rendered through its `Outlet` belong to the covered React tree.

---

## Why `AppLayout` Is Wrapped

The Error Boundary deliberately wraps `AppLayout` instead of wrapping every individual page or component.

This placement provides an application-level UI boundary with a clear responsibility.

It means:

- `AppLayout` is protected;
- route children rendered through its `Outlet` are protected;
- `Home` is protected;
- `Tasks` is protected;
- future routes composed beneath this layout can inherit the same boundary;
- individual components do not require unnecessary Error Boundary wrappers.

This keeps the architecture centralized and avoids fragmented error handling.

---

## Why the Provider Layer Is Not Wrapped

The application provider and router infrastructure remain outside this Error Boundary.

The purpose of TA-38 is to protect the routed application UI from unexpected React render failures, not to create a catch-all wrapper around every piece of application infrastructure.

The selected architecture is:

```text
Application Infrastructure
        │
        ▼
RouterProvider
        │
        ▼
ErrorBoundary
        │
        ▼
Routed Application UI
```

This keeps the Error Boundary focused on the application UI it is intended to protect.

Provider-level failures occurring outside the boundary are therefore not handled by this instance.

If the architecture later requires protection for provider initialization or other infrastructure rendering, that should be evaluated deliberately rather than silently expanding the responsibility of this boundary.

---

## Error Boundary vs Router Error Handling

TA-38 deliberately uses a React Error Boundary rather than replacing the implementation with a React Router `errorElement`.

The application Error Boundary owns unexpected React failures within its covered component tree.

Router-specific error handling has a different architectural responsibility.

Keeping these concepts separate makes the failure boundaries explicit and prevents routing concerns from replacing the application-level React Error Boundary required by TA-38.

---

## What the Boundary Covers

The boundary is designed for unexpected React failures occurring within its descendant tree, including supported render and lifecycle failures.

Within the current route composition, the covered UI includes:

```text
AppLayout
└── Outlet
    ├── Home
    └── Tasks
```

Future routed descendants placed beneath the same layout can also inherit this protection.

---

## What the Boundary Does Not Cover

The Error Boundary is not a general-purpose error handler.

It does not own:

- API request failures;
- Axios failures;
- TanStack Query error states;
- form validation errors;
- expected feature-level failures;
- event-handler errors;
- asynchronous errors occurring outside React's Error Boundary handling;
- failures outside its descendant component tree;
- authentication recovery;
- production observability integration.

These responsibilities remain with their appropriate application layers.

---

## Fallback Experience

When the boundary enters its error state, it replaces the failed application UI with a controlled full-screen fallback.

The fallback contains:

```text
Something went wrong

We couldn't display this page properly.
Please try again.

[ Try again ]
```

The fallback intentionally does not display:

- the thrown error message;
- a stack trace;
- component stack information;
- internal implementation details.

This prevents technical debugging information from becoming part of the user-facing experience.

---

## Theme Integration

The fallback uses existing Tailwind theme tokens:

```text
bg-background
text-foreground
text-muted-foreground
bg-primary
text-primary-foreground
ring-ring
```

This allows the fallback to remain visually aligned with the application theme rather than introducing hard-coded fallback colors.

The fallback is also self-contained so it does not depend on the failed `AppLayout` continuing to render.

---

## Reset and Recovery Behavior

The fallback provides a `Try again` action.

The reset handler is:

```ts
private handleReset = (): void => {
  this.setState({
    hasError: false,
    error: null,
  });
};
```

The action clears the boundary's captured error state and allows React to attempt to render the covered application tree again.

The recovery flow is:

```text
Fallback
   │
   ▼
Try again
   │
   ▼
hasError = false
error = null
   │
   ▼
Render children again
```

The reset does not automatically refresh the browser or navigate away from the current route.

This provides a lightweight recovery attempt before requiring more disruptive recovery behavior.

---

## Persistent Failure Behavior

Resetting an Error Boundary does not repair the underlying application defect.

If the same component still throws when React attempts to render it again:

```text
Try again
    │
    ▼
Render children
    │
    ▼
Same error occurs
    │
    ▼
ErrorBoundary catches again
    │
    ▼
Fallback returns
```

This is expected behavior.

The boundary provides controlled containment and recovery opportunity, not automatic correction of application defects.

---

## Accessibility

The fallback includes:

```tsx
role = "alert";
```

This identifies the fallback as important error information for assistive technologies.

The recovery action uses a native:

```html
<button type="button"></button>
```

which provides built-in keyboard operability.

The button also includes visible keyboard focus treatment through:

```text
focus-visible:ring-2
focus-visible:ring-ring
focus-visible:ring-offset-2
```

The fallback uses centered responsive layout constraints:

```text
min-h-screen
px-6
max-w-md
```

which allow the content to remain usable across different viewport sizes.

Final manual QA should verify keyboard operation, visible focus, responsive presentation, and theme contrast.

---

## Relationship to API Error Handling

TA-37 established centralized API error normalization.

TA-38 solves a different failure category.

```text
Expected API / Transport Failure
        │
        ▼
normalizeApiError()
        │
        ▼
AppError
        │
        ▼
Query / Feature Error State
```

Compared with:

```text
Unexpected React Render Failure
        │
        ▼
ErrorBoundary
        │
        ▼
Application Fallback
```

API failures should therefore not be thrown into the Error Boundary simply to obtain a fallback screen.

Expected request failures remain part of normal application state and should be handled by services, TanStack Query, forms, or feature-level presentation as appropriate.

---

## Manual Failure Validation

The boundary was manually exercised by temporarily forcing a covered route component to throw during rendering.

The temporary validation mechanism used `Home`:

```tsx
export default function Home() {
  const shouldCrash = true;

  if (shouldCrash) {
    throw new Error("TA-38 manual QA: Home render failure");
  }

  return <div>Home View</div>;
}
```

This creates a render-time failure inside the tree covered by the Error Boundary.

The expected flow is:

```text
Home throws
    │
    ▼
Failure propagates through routed UI
    │
    ▼
ErrorBoundary catches failure
    │
    ▼
Custom fallback appears
```

This temporary failure code is a manual QA mechanism only and must not remain in the production implementation.

Final validation should be performed after restoring the normal `Home` implementation.

---

## Edge Cases and Limitations

### Repeated Render Failure

If the underlying component continues throwing after `Try again`, the Error Boundary returns to its fallback state.

### Event Handler Errors

Errors thrown directly from event handlers are not handled by this Error Boundary simply because the component is a descendant.

Expected event failures should be handled where the event or associated operation is managed.

### Asynchronous Failures

Asynchronous failures outside React's Error Boundary handling are not automatically caught by this boundary.

API and query failures remain part of their dedicated error-handling architecture.

### Boundary Self-Failure

An Error Boundary cannot provide useful protection if its own fallback rendering fails.

For this reason, the fallback is intentionally small and self-contained.

### Provider and Router Infrastructure

Infrastructure outside the boundary is not protected by this instance.

This is intentional under the current TA-38 architecture.

### Reset Does Not Repair Defects

`Try again` resets boundary state only. It does not fix the source of a persistent render failure.

### Observability

The current implementation uses the centralized application logger for technical debugging. Render failures are logged through `logger.error()` using the `APPLICATION_RUNTIME` category, while the Error Boundary continues to render the same safe user-facing fallback.

Production monitoring, telemetry, and external observability integrations are outside TA-38.

---

## Final Implementation Decisions

TA-38 establishes the following decisions:

| Decision                       | Implementation                                               |
| ------------------------------ | ------------------------------------------------------------ |
| Boundary pattern               | React class-based Error Boundary                             |
| Scope                          | Application-level routed UI                                  |
| Placement                      | Around `AppLayout` in route configuration                    |
| Route coverage                 | Layout and descendant routes rendered through `Outlet`       |
| Provider coverage              | Intentionally excluded                                       |
| Fallback                       | Self-contained full-screen application fallback              |
| Recovery                       | Reset boundary state and retry rendering                     |
| Technical logging              | Centralized `logger.error()` through `src/utils/logger.ts`   |
| User-visible technical details | Not exposed                                                  |
| API/query failures             | Remain outside Error Boundary responsibility                 |
| Separate fallback component    | Not introduced at current scope                              |
| Router `errorElement`          | Not used as a replacement for the application Error Boundary |
| Production observability       | Out of scope                                                 |

---

## Application Foundation Relationship

TA-38 follows the centralized API error-normalization work while maintaining a separate responsibility:

```text
TA-37
API Error Normalization
        │
        │ Expected transport/API failures
        ▼
Query / Feature Error Handling


TA-38
Application Error Boundary
        │
        │ Unexpected React failures
        ▼
Controlled Application Fallback
```

Together, these layers prevent expected API failures and unexpected React rendering failures from being incorrectly handled through the same mechanism.

---

## Final Architecture

```text
Application Infrastructure
        │
        ▼
RouterProvider
        │
        ▼
ErrorBoundary
        │
        ▼
AppLayout
        │
        ▼
Outlet
        │
        ├── Home
        └── Tasks
              │
              ▼
Unexpected React Failure
              │
              ▼
      ErrorBoundary State
              │
              ▼
      Controlled Fallback
              │
              ▼
          Try Again
              │
              ▼
       Reset and Retry
```

This architecture provides one controlled application UI failure boundary while keeping API errors, query states, expected feature failures, provider infrastructure, and production observability within their appropriate responsibilities.
