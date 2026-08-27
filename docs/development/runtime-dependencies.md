# Runtime Dependencies

---

## Document Information

**Category:** Development

**Related Ticket:** TA-29 Review and Install Application Runtime Dependencies

**Epic:** Epic 3 Application Foundation

**Release:** v0.3.0

**Status:** Complete

---

## Overview

The Todo Application uses a deliberately selected set of runtime dependencies to support application routing, server-state management, and REST API communication.

Runtime dependencies are packages required by the application while it is running. They are different from development dependencies, which primarily support development activities such as linting, formatting, testing, building, and tooling.

The Application Foundation dependency baseline was established in TA-29 before routing, API integration, and server-state configuration were implemented.

This ensures dependencies are introduced intentionally and only when required by approved application scope.

---

## Runtime Dependency Principles

Dependencies should be introduced according to the following principles:

- Install packages only when required by approved Jira scope.
- Avoid installing dependencies for future Epics prematurely.
- Avoid multiple libraries that solve the same responsibility without a documented reason.
- Confirm compatibility with the current React, TypeScript, and Vite environment.
- Prefer actively maintained libraries with strong TypeScript support.
- Understand the responsibility of a dependency before introducing it.
- Keep runtime and development dependencies correctly classified.
- Validate the application after dependency changes.

---

## Application Foundation Dependencies

The Application Foundation currently introduces three major runtime dependencies:

| Dependency     | Responsibility                                        |
| -------------- | ----------------------------------------------------- |
| React Router   | Client-side routing and route composition             |
| TanStack Query | Server-state management, caching, and synchronization |
| Axios          | REST API communication                                |

These packages establish infrastructure required by subsequent Application Foundation and feature tickets.

---

## React Router

React Router provides client-side routing for the Todo Application.

Its responsibilities include:

- Mapping URLs to application pages.
- Supporting navigation without full browser reloads.
- Providing nested route composition.
- Rendering route-level layouts.
- Supporting dynamic routes in future task features.
- Supporting protected routes during the Authentication Epic.
- Supporting URL-driven application state where appropriate.

React Router was installed during TA-29 and configured separately during TA-30.

Installing the dependency did not include implementing application routing behavior.

---

## TanStack Query

TanStack Query is the project's server-state management solution.

It will be responsible for managing data retrieved from external APIs.

Expected responsibilities include:

- Fetching server data.
- Caching API responses.
- Synchronizing server state with the UI.
- Managing loading states.
- Managing error states.
- Refetching stale data.
- Invalidating cached data after mutations.
- Supporting task CRUD operations in later tickets.

TanStack Query was installed as part of the Application Foundation dependency baseline.

Its provider and application-level configuration are handled by dedicated Application Foundation work rather than TA-29.

---

## Axios

Axios is the project's HTTP client for REST API communication.

Expected responsibilities include:

- Sending HTTP requests.
- Configuring reusable API clients.
- Managing base API configuration.
- Applying shared request configuration.
- Handling API responses.
- Supporting centralized error handling.
- Supporting future authentication headers and interceptors where required.

Axios was installed during TA-29.

API client configuration and feature-specific API requests remain the responsibility of their dedicated tickets.

---

## Dependencies vs Development Dependencies

The project's `package.json` separates packages according to their responsibility.

### Dependencies

Packages required by the running application belong under:

```text
dependencies
```

Examples include:

```text
React
React DOM
React Router
TanStack Query
Axios
```

### Development Dependencies

Packages used primarily while developing, validating, testing, or building the application belong under:

```text
devDependencies
```

Examples may include:

```text
TypeScript
ESLint
Prettier
Vite
testing tools
build tooling
```

The exact classification should always be based on how the package is used by the project.

---

## Version Management

Dependency versions follow Semantic Versioning where supported.

Versions generally use the format:

```text
MAJOR.MINOR.PATCH
```

Where:

- **MAJOR** represents potentially incompatible API changes.
- **MINOR** represents backward-compatible functionality.
- **PATCH** represents backward-compatible fixes.

A version range declared in `package.json` is not necessarily the exact version installed.

The resolved dependency versions are recorded by the project's lockfile.

When investigating dependency-specific behavior, developers should inspect both:

```text
package.json
```

and:

```text
package-lock.json
```

The installed dependency tree can also be inspected using npm when required.

---

## Dependency Installation Policy

New packages must not be installed simply because they may become useful later.

Before introducing a runtime dependency, confirm:

1. The current Jira ticket requires it.
2. Existing project dependencies do not already solve the same responsibility.
3. The package is compatible with the current application stack.
4. The package is actively maintained and appropriate for production use.
5. Its purpose is understood.
6. Its addition does not prematurely implement future Epic scope.

This keeps the application dependency graph intentional and maintainable.

---

## Validation

Changes to runtime dependencies must be validated before completion.

The standard validation includes:

```bash
npm run lint
npm run format
npm run build
```

The application should also be manually started where necessary to confirm that dependency changes do not prevent the development environment from initializing successfully.

---

## Scope Boundaries

TA-29 established the dependency baseline only.

The ticket did not configure:

- React Router behavior.
- TanStack Query providers.
- Axios clients.
- Task API integration.
- Authentication.
- Forms.
- Testing frameworks planned for later Epics.

Those responsibilities remain isolated within their dedicated Jira tickets.

---

## Related Documentation

```text
docs/
├── architecture/
│   ├── project-structure.md
│   ├── routing.md
│   └── application-layout.md
│
└── development/
    ├── runtime-dependencies.md
    ├── environment-setup.md
    ├── development-workflow.md
    └── contribution-guidelines.md
```

This document will be updated whenever the project's major runtime dependency strategy changes.
