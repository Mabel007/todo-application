# Application Routing

---

## Document Information

**Category:** Architecture

**Related Ticket:** TA-30 Configure React Router and Central Route Definitions

**Epic:** Epic 3 Application Foundation

**Release:** v0.3.0

**Status:** Complete

---

## Overview

The Todo Application uses React Router to provide client-side routing and centralized route composition.

The routing architecture separates route paths, route definitions, router creation, application initialization, layouts, and page content into clearly defined responsibilities.

This prevents route configuration from becoming scattered throughout feature components and provides a scalable foundation for future task-management and authentication routes.

---

## Routing Architecture

The current routing flow is:

```text
main.tsx
   │
   ▼
RouterProvider
   │
   ▼
router
   │
   ▼
createBrowserRouter
   │
   ▼
routeConfig
   │
   ▼
AppLayout
   │
   └── Outlet
       │
       ├── Home
       └── Tasks
```

Each layer has a specific responsibility.

---

## Route Structure

Routing is centralized under:

```text
src/routes/
```

The routing structure separates:

```text
routes/
├── index.tsx
├── routeConfig.tsx
└── routePaths.ts
```

This structure prevents route paths and route composition from being unnecessarily duplicated throughout the application.

---

## Route Paths

Centralized route path constants are defined through:

```text
routePaths
```

The current foundation routes are:

| Route    | Purpose               |
| -------- | --------------------- |
| `/`      | Home page             |
| `/tasks` | Tasks foundation page |

Centralizing these values provides a single source of truth for application URLs.

Components that navigate to known application routes should reuse the centralized paths rather than independently duplicating path strings.

---

## Route Configuration

Application route composition is centralized through:

```text
routeConfig
```

The current configuration establishes `AppLayout` as the parent route-level layout.

The Home and Tasks pages are composed as nested routes beneath the application layout.

Conceptually:

```text
AppLayout
│
├── /        → Home
│
└── /tasks   → Tasks
```

The Home route uses the parent route's index behavior, while Tasks is represented by its dedicated path.

---

## Browser Router

The application router is created using React Router's browser router.

Conceptually:

```text
routeConfig
     │
     ▼
createBrowserRouter
     │
     ▼
router
```

The resulting router becomes the application's centralized router instance.

This architecture provides the foundation for browser-history-based client-side routing and future deep-link support.

---

## Router Provider

The application router is supplied at the application entry point through React Router's router provider.

Conceptually:

```text
React Application
       │
       ▼
RouterProvider
       │
       ▼
Application Routes
```

This makes routing context available to the route tree and allows React Router to determine which route and layout should render for the current URL.

---

## Nested Routes

The Todo Application uses nested route composition.

The parent layout owns shared application structure while child routes provide page-specific content.

Conceptually:

```text
AppLayout
│
├── Shared Structure
│
└── Outlet
    │
    ├── Home
    └── Tasks
```

When the current URL changes, React Router selects the matching child route and renders its page content through the layout's `Outlet`.

---

## Client-Side Navigation

Internal application navigation uses React Router navigation primitives instead of normal browser document navigation.

This allows navigation between routes such as:

```text
/
```

and:

```text
/tasks
```

without requiring a complete browser page reload.

Client-side navigation preserves the single-page application experience.

---

## Pages

Route-level page components are stored under:

```text
src/pages/
```

The current foundation pages are:

```text
pages/
├── Home
└── Tasks
```

These pages provide route-specific content.

Shared application structure should not be duplicated inside individual page components.

---

## Layout Composition

Routes use the shared application layout established by the Application Foundation.

The relationship is:

```text
Router
  │
  ▼
AppLayout
  │
  ▼
Outlet
  │
  ▼
Matched Page
```

Detailed application layout architecture is documented separately in:

```text
docs/architecture/application-layout.md
```

---

## Route Design Principles

Application routes should follow these principles:

- Keep route paths centralized.
- Keep route composition centralized.
- Avoid hardcoding known route paths throughout components.
- Use nested routes for shared route-level structure.
- Keep page content separate from layout structure.
- Keep business logic outside route configuration.
- Introduce routes only when required by approved Jira scope.
- Keep route naming predictable and maintainable.

---

## Current Scope

The current Application Foundation defines:

```text
/
└── Home

/tasks
└── Tasks
```

The Tasks page currently exists only as required by the approved foundation scope.

Task-management behavior belongs to later task feature tickets.

---

## Future Routing

The routing architecture is designed to support future application requirements such as:

- Task detail routes.
- Task creation routes.
- Task editing routes.
- Authentication routes.
- Protected routes.
- URL-driven filters and pagination.
- Not Found handling.
- Production deep-link validation.

These routes and behaviors must not be introduced before their dedicated Jira scope is approved.

---

## Out of Scope

TA-30 did not implement:

- Task-management functionality.
- Authentication.
- Protected routes.
- Final Not Found behavior.
- Task CRUD routing behavior.
- API integration.

TA-30 established the routing foundation required for those later capabilities.

---

## Validation

Routing changes should be validated using:

```bash
npm run lint
npm run format
npm run build
```

Manual routing validation should confirm:

- The application initializes successfully.
- `/` renders the Home page.
- `/tasks` renders the Tasks page.
- Internal navigation does not trigger a full page reload.
- Nested content renders within the expected layout region.

---

## Related Documentation

```text
docs/
└── architecture/
    ├── project-structure.md
    ├── routing.md
    └── application-layout.md
```

This document will remain synchronized with the application's route architecture as new routes are introduced through approved Jira tickets.
