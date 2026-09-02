# Application Layout

---

## Document Information

**Category:** Architecture

**Related Ticket:** TA-31 Create Application Layouts and Route Composition

**Epic:** Epic 3 Application Foundation

**Release:** v0.3.0

**Status:** Complete

---

## Overview

The Todo Application uses a reusable route-level application layout to provide consistent structure across application pages.

The layout establishes shared header, main content, navigation, branding, and footer regions while allowing React Router to render route-specific content through a dedicated nested route region.

The architecture separates shared application structure from page content and feature-specific business behavior.

---

## Layout Architecture

The current application shell follows this structure:

```text
AppLayout
│
├── Header
│   ├── AppLogo
│   └── Navigation
│       ├── Home
│       └── Tasks
│
├── Main
│   └── Responsive Content Container
│       └── Outlet
│           └── Current Route Page
│
└── Footer
```

`AppLayout` acts as the reusable route-level composition component.

---

## AppLayout

The main application layout is located under:

```text
src/layouts/
```

Its responsibility is to compose shared application structure around route-specific content.

The layout provides:

- Shared Header.
- Main content region.
- Responsive content container.
- React Router `Outlet`.
- Shared Footer.
- Full viewport-height application shell.

The layout must remain independent of task, authentication, and other feature-specific business logic.

---

## Layout Flow

The application layout uses three primary vertical regions:

```text
Header
  │
  ▼
Main
  │
  ▼
Footer
```

The shell follows the conceptual grid structure:

```text
auto
1fr
auto
```

This means:

- The Header occupies the space required by its content.
- Main expands to consume the remaining available viewport space.
- The Footer occupies the space required by its content.

Combined with a minimum viewport height, this prevents short pages from causing the footer to float unnecessarily in the middle of the screen.

---

## Header

The Header is a reusable shared component.

It currently provides:

- Application branding.
- Application logo.
- Home navigation.
- Tasks navigation.
- Responsive navigation composition.

The logo also provides navigation back to the Home route.

Known application destinations reuse centralized route paths rather than maintaining independent route definitions inside the Header.

---

## Application Logo

Application branding is represented through a reusable `AppLogo` component.

The logo is used within the Header instead of duplicating logo markup directly inside layout composition.

This maintains separation between:

```text
Brand presentation
        │
        ▼
AppLogo

Shared navigation
        │
        ▼
Header

Route composition
        │
        ▼
AppLayout
```

Brand assets remain governed by the project's Design System documentation.

---

## Navigation

The current shared navigation exposes the foundation routes:

```text
Home
Tasks
```

Navigation exists only to support the current application shell.

The final navigation design and future navigation behavior remain outside the scope of the Application Layout ticket.

Navigation should continue to use centralized route paths as the application route tree grows.

---

## Main Content Region

The semantic `main` element represents the primary page-content region.

It provides:

- Full available width.
- Consistent horizontal spacing.
- Consistent vertical spacing.
- A responsive content container.
- The nested route rendering region.

Page components should focus on their own content instead of recreating the application's outer page spacing.

---

## Content Container

The application uses responsive content-width behavior.

Conceptually:

```text
Small viewport
┌────────────────────────┐
│ padding                │
│ ┌────────────────────┐ │
│ │ Route Content      │ │
│ └────────────────────┘ │
└────────────────────────┘
```

On larger viewports:

```text
Large viewport
┌──────────────────────────────────────┐
│                                      │
│       ┌──────────────────────┐       │
│       │    Route Content     │       │
│       └──────────────────────┘       │
│                                      │
└──────────────────────────────────────┘
```

Content can use the available width on smaller screens while being constrained and centered at larger breakpoints.

This prevents application content from becoming unnecessarily wide on desktop displays.

---

## Outlet

React Router's `Outlet` provides the insertion point for nested route content.

Conceptually:

```text
AppLayout
    │
    ├── Header
    │
    ├── Main
    │     │
    │     └── Outlet
    │           │
    │           └── Current Page
    │
    └── Footer
```

When the route changes, React Router replaces the content rendered through the `Outlet` while preserving the shared application shell.

---

## Footer

The Footer is implemented as a reusable shared component.

It provides the common application footer region and copyright information.

The application shell keeps the Footer structurally separate from route-specific page content.

This prevents individual pages from needing to implement their own footer behavior.

---

## Shared Components

Reusable application-wide components are organized separately from route-level layouts.

Conceptually:

```text
components/
└── shared/
    ├── Header
    └── Footer

layouts/
└── AppLayout
```

This distinction reflects different responsibilities.

### Shared Components

Shared components provide reusable pieces of interface.

Examples:

- Header.
- Footer.
- Shared branding.

### Layouts

Layouts compose shared components and determine where route content is rendered.

### Pages

Pages provide content associated with individual routes.

### Features

Features provide domain and business behavior.

---

## Separation of Responsibilities

The application follows this responsibility model:

```text
Layout
   ↓
Shared application structure

Page
   ↓
Route-specific content

Component
   ↓
Reusable UI

Feature
   ↓
Business behavior
```

Layouts must not become containers for unrelated feature logic.

---

## Responsive Design

The application layout follows a mobile-first responsive approach.

### Mobile

The Header can stack shared regions vertically where necessary.

```text
┌──────────────────────┐
│ Logo                 │
│ Navigation           │
├──────────────────────┤
│                      │
│ Page Content         │
│                      │
├──────────────────────┤
│ Footer               │
└──────────────────────┘
```

### Tablet and Desktop

At larger breakpoints, the Header can compose branding and navigation horizontally.

```text
┌────────────────────────────────────┐
│ Logo                  Navigation   │
├────────────────────────────────────┤
│                                    │
│        Page Content                │
│                                    │
├────────────────────────────────────┤
│ Footer                             │
└────────────────────────────────────┘
```

The content region is constrained at larger widths to maintain readability and visual consistency.

---

## Semantic Structure

The shared application shell uses semantic HTML landmarks where appropriate:

```text
header
nav
main
footer
```

Native semantic elements should be preferred over unnecessary ARIA replacements.

The primary route content belongs within the application's main landmark.

---

## Accessibility Considerations

Application layouts should:

- Maintain a clear semantic page structure.
- Preserve keyboard-accessible navigation.
- Use meaningful link destinations.
- Maintain visible focus behavior.
- Avoid unnecessary landmark duplication.
- Prevent content from becoming inaccessible at narrow viewport widths.
- Support zoom and responsive reflow.
- Avoid horizontal overflow under representative viewport sizes.

Accessibility requirements should continue to be validated as the final navigation and feature components are introduced.

---

## Business Logic Boundaries

Application layouts must not contain:

- Task API requests.
- Task CRUD behavior.
- Task filtering logic.
- Authentication checks.
- Authentication API requests.
- Form state.
- Feature-specific server state.
- Feature-specific mutation logic.

Those responsibilities belong to their dedicated feature architecture.

---

## Validation

Layout changes should be validated using:

```bash
npm run lint
npm run format
npm run build
```

Manual validation should include:

- Home renders inside the application layout.
- Tasks renders inside the application layout.
- Header remains shared between routes.
- Footer remains shared between routes.
- Nested content renders through `Outlet`.
- Navigation works without full page reloads.
- Mobile layout remains usable.
- Tablet layout remains usable.
- Desktop layout remains usable.
- No unexpected horizontal overflow occurs.

---

## Scope Boundaries

TA-31 establishes the reusable application shell and route composition only.

It does not implement:

- Final navigation design.
- Mobile menu behavior.
- Protected routes.
- Authentication behavior.
- Task-management behavior.
- API integration.
- Feature-specific state.

These capabilities belong to their respective Jira tickets.

---

## Related Documentation

```text
docs/
├── architecture/
│   ├── application-layout.md
│   ├── project-structure.md
│   └── routing.md
│
├── design-system/
│   └── application-theme.md
│
└── development/
    └── runtime-dependencies.md
```

This document will be updated whenever the shared route-level application shell or layout composition architecture materially changes.
