# Not Found Routing

---

## Document Information

| Field              | Value                                                |
| ------------------ | ---------------------------------------------------- |
| **Category**       | Architecture                                         |
| **Related Ticket** | TA-39 - Implement Not Found Route and 404 Experience |
| **Epic**           | TA-20 - Application Foundation                       |
| **Release**        | v0.3.0                                               |
| **Status**         | Complete                                             |

---

## Overview

The Todo Application provides an explicit client-side not-found experience for URLs that do not match a defined application route.

TA-39 introduces a wildcard route within the existing application route tree and a dedicated `NotFoundPage`.

This ensures that:

- valid application routes continue to resolve normally;
- unmatched client-side URLs render a controlled 404 experience;
- users receive a clear explanation that the requested page could not be found;
- users have a safe navigation path back to the application home route;
- the not-found experience remains part of the shared application layout and routing architecture.

This routing behavior is separate from API resource not-found responses and application render failures.

---

## Relevant Files

The implementation affects the routing and page layers:

```text
src/
├── pages/
│   └── NotFoundPage.tsx
│
└── routes/
    └── routeConfig.tsx
```

| File                         | Responsibility                                                 |
| ---------------------------- | -------------------------------------------------------------- |
| `src/pages/NotFoundPage.tsx` | Presents the user-facing 404 experience and return navigation  |
| `src/routes/routeConfig.tsx` | Defines the wildcard route used for unmatched client-side URLs |

---

## Routing Architecture

The wildcard route is defined as a child of the existing root application route.

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
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ],
}
```

The resulting route tree is:

```text
RouterProvider
└── ErrorBoundary
    └── AppLayout
        └── Outlet
            ├── Home
            ├── Tasks
            └── NotFoundPage
```

This keeps the not-found experience inside the same routed application structure as the application's valid pages.

---

## Wildcard Route Behavior

The wildcard route uses:

```tsx
path: "*";
```

The wildcard acts as the fallback for child URLs that do not match a more specific route in the same route branch.

For example:

```text
/          → Home
/tasks     → Tasks
/unknown   → NotFoundPage
/example   → NotFoundPage
```

The wildcard does not replace or override valid route definitions.

It provides the fallback when the router cannot resolve the requested child URL to one of the application's defined routes.

---

## Why Valid Routes Are Not Intercepted

The wildcard route exists alongside the application's explicit routes:

```text
index
tasks
*
```

React Router evaluates the route definitions and selects the appropriate route match.

Known application routes therefore continue to render their intended page.

The wildcard provides the fallback for URLs that remain unmatched.

Conceptually:

```text
Requested URL
     │
     ▼
Route Matching
     │
     ├── Known route
     │      │
     │      ▼
     │   Valid Page
     │
     └── No known route
            │
            ▼
        Wildcard Route
            │
            ▼
       NotFoundPage
```

This allows one centralized not-found route without adding 404 logic to individual pages.

---

## Route Placement

The wildcard route is intentionally placed beneath the existing root application route rather than being implemented as an unrelated route tree.

This placement means the not-found experience participates in the same route composition as the rest of the application.

```text
Root Application Route
        │
        ▼
AppLayout
        │
        ▼
Outlet
        │
        ├── Home
        ├── Tasks
        └── NotFoundPage
```

The placement keeps client-side fallback routing centralized and avoids duplicating layout or application infrastructure.

---

## Relationship to AppLayout

`NotFoundPage` is rendered through the `Outlet` owned by `AppLayout`.

This means an unknown client-side URL remains inside the shared routed application structure rather than bypassing the application's route composition.

The page itself is responsible only for the not-found content and recovery navigation.

Shared route composition remains the responsibility of `AppLayout` and the route configuration.

---

## NotFoundPage Responsibility

`NotFoundPage` provides the user-facing representation of an unmatched application route.

The experience contains:

```text
404

Page Not Found

Sorry, we couldn't find the page you're looking for.
Perhaps the address was mistyped or the page has moved.

Go Back Home
```

Its responsibilities are deliberately limited to:

- identifying the not-found state;
- explaining the problem in user-facing language;
- providing a clear route back into the application.

It does not attempt to determine why the URL was invalid or perform API resource lookup logic.

---

## Navigation and Recovery

The not-found experience provides navigation back to:

```ts
routePaths.home;
```

Navigation uses React Router client-side routing rather than forcing a full browser reload.

The recovery path is therefore:

```text
Unknown URL
    │
    ▼
NotFoundPage
    │
    ▼
Go Back Home
    │
    ▼
routePaths.home
    │
    ▼
Home
```

The navigation control should remain a semantic link because its purpose is navigation.

Application button styling may be applied to that link without converting the navigation action into a nested or semantically incorrect button control.

---

## Interactive Element Composition

The return-home action must use one semantic interactive element.

A button containing a link should be avoided:

```tsx
<Button>
  <Link to={routePaths.home}>Go Back Home</Link>
</Button>
```

This can create nested interactive elements when `Button` renders a native `<button>`.

For the project's Base UI/ShadCN configuration, the navigation link should instead remain the interactive element and receive the shared button styling through the project's button variant helper.

Conceptually:

```tsx
<Link
  to={routePaths.home}
  className={buttonVariants(...)}
>
  Go Back Home
</Link>
```

This preserves:

- correct link semantics;
- keyboard navigation;
- client-side React Router navigation;
- shared application button styling;
- a single interactive element.

---

## Relationship to the Application Error Boundary

TA-38 and TA-39 handle different application failure conditions.

### TA-38

The Application Error Boundary handles unexpected React failures within its covered component tree.

```text
Unexpected React Render Failure
        │
        ▼
ApplicationErrorBoundary
        │
        ▼
Controlled Error Fallback
```

### TA-39

The not-found route handles successful React rendering where the requested client-side URL does not match a defined route.

```text
Unknown Client-Side URL
        │
        ▼
React Router
        │
        ▼
Wildcard Route
        │
        ▼
NotFoundPage
```

These responsibilities must remain separate.

An unknown route is not a React rendering exception and should not trigger the Application Error Boundary.

---

## Error Boundary Coverage

Because the wildcard route remains beneath the route element containing:

```tsx
<ErrorBoundary>
  <AppLayout />
</ErrorBoundary>
```

the resulting route tree remains:

```text
RouterProvider
└── ErrorBoundary
    └── AppLayout
        └── Outlet
            └── NotFoundPage
```

The 404 experience therefore remains part of the routed UI covered by the existing application-level Error Boundary.

This does not mean that the Error Boundary handles the not-found condition itself.

The router selects `NotFoundPage`; the Error Boundary remains available only for unexpected React failures within the covered tree.

---

## Accessibility

The not-found experience uses semantic page content and a semantic navigation action.

The page includes:

- a `<main>` landmark;
- visible 404 identification;
- a clear page-not-found heading;
- explanatory text;
- a semantic link for returning to a valid route;
- keyboard-operable navigation.

The return-home control should remain a single link rather than nesting a link inside a button.

The final implementation should also maintain visible keyboard focus through the shared button/link styling.

---

## Heading Structure

The page currently presents:

```text
404
Page Not Found
```

using separate heading elements.

The final implementation should preserve a logical heading hierarchy so assistive technologies can interpret the page structure predictably.

The visible `404` may serve as the primary heading, with `Page Not Found` providing the next descriptive heading level, as long as the hierarchy remains intentional and consistent.

---

## Responsive Behavior

The page uses a centered layout:

```text
flex-center
min-h-screen
space-y-8
text-center
mx-auto
max-w-xl
```

This keeps the not-found experience focused and constrains explanatory text to a readable width.

Representative viewport validation should verify that:

- content remains visible without horizontal overflow;
- text remains readable;
- the return-home control remains reachable;
- spacing remains appropriate on narrow and wide screens.

---

## Client-Side 404 vs API 404

TA-39 handles client-side route matching only.

These two conditions are different:

```text
Unknown Browser Route
        │
        ▼
React Router
        │
        ▼
NotFoundPage
```

and:

```text
Valid Application Route
        │
        ▼
API Request
        │
        ▼
HTTP 404
        │
        ▼
API / Query Error Handling
```

An API `404 Not Found` response does not mean the application route itself is unknown.

API resource failures remain part of the API and feature error-handling architecture established separately from TA-39.

---

## Relationship to API Error Normalization

TA-37 established application-facing normalization for API failures, including HTTP 404 responses.

TA-39 does not replace or reuse that mechanism for route matching.

The responsibilities remain:

| Failure                         | Responsible Layer                |
| ------------------------------- | -------------------------------- |
| Unknown client-side URL         | React Router wildcard route      |
| API HTTP 404                    | API/query/feature error handling |
| Unexpected React render failure | Application Error Boundary       |

This separation prevents unrelated failure conditions from being treated as the same type of error.

---

## Limitations and Out-of-Scope Behavior

TA-39 does not implement:

- API resource not-found handling;
- Axios 404 handling;
- TanStack Query resource error presentation;
- feature-specific missing-resource pages;
- Vercel deep-link configuration;
- production server rewrite configuration;
- deployment-platform routing behavior.

Vercel and production deep-link configuration remain part of the production-readiness roadmap.

---

## Manual QA Expectations

Before TA-39 is closed, manually verify representative valid and invalid URLs.

### Valid Routes

Confirm that defined routes continue to resolve normally.

Examples include:

```text
/
```

and:

```text
/tasks
```

Expected result:

```text
Defined page renders
NotFoundPage does not render
```

### Unknown Routes

Navigate directly to representative undefined URLs.

For example:

```text
/unknown
```

```text
/does-not-exist
```

Expected result:

```text
NotFoundPage renders
```

### Recovery Navigation

From the not-found page:

1. Focus the `Go Back Home` link using the keyboard.
2. Confirm visible focus treatment.
3. Activate the link.
4. Confirm navigation to `routePaths.home`.
5. Confirm navigation occurs through the client-side router.

### Responsive Validation

Verify the not-found experience at representative narrow and wide viewport sizes.

### Regression Validation

Confirm that adding the wildcard route does not interfere with existing valid application routes.

---

## Final Implementation Decisions

| Decision             | Implementation                                       |
| -------------------- | ---------------------------------------------------- |
| Not-found mechanism  | React Router wildcard route                          |
| Wildcard path        | `*`                                                  |
| Placement            | Child of the existing root application route         |
| UI                   | Dedicated `NotFoundPage`                             |
| Shared layout        | Preserved through `AppLayout`                        |
| Error Boundary       | Existing TA-38 boundary continues to cover routed UI |
| Recovery destination | `routePaths.home`                                    |
| Navigation mechanism | React Router `Link`                                  |
| Navigation semantics | Single semantic link styled as an application action |
| API 404 handling     | Separate responsibility                              |
| Vercel deep links    | Out of scope                                         |
| Server routing       | Out of scope                                         |

---

## Validation Checklist

Before closure, verify:

- `/` continues to render the Home page;
- `/tasks` continues to render the Tasks page;
- undefined client-side URLs render `NotFoundPage`;
- valid routes are not intercepted by the wildcard;
- return-home navigation resolves to `routePaths.home`;
- return-home navigation is keyboard operable;
- visible keyboard focus is present;
- no nested interactive elements remain in the return-home action;
- the page remains usable at representative viewport sizes;
- the not-found route remains within the shared `AppLayout` route tree;
- the existing Error Boundary continues to wrap the routed UI;
- formatting passes;
- lint passes;
- production build passes;
- direct-navigation and unknown-route validation pass.

---

## Final Architecture

```text
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
   ┌────┼───────────┐
   │    │           │
   ▼    ▼           ▼
 Home  Tasks   NotFoundPage
                  ▲
                  │
             path: "*"
                  ▲
                  │
          Unknown Route
```

TA-39 therefore establishes one centralized client-side routing fallback while preserving the responsibilities of the shared application layout, application Error Boundary, API error handling, and future deployment configuration.
