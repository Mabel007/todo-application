# Server State and TanStack Query

---

## Document Information

**Category:** Architecture

**Related Ticket:** TA-33 Configure TanStack Query and Query Client

**Epic:** Epic 3 Application Foundation

**Release:** v0.3.0

**Status:** Complete

---

## Overview

The Todo Application uses TanStack Query as its server-state management foundation.

Server state represents data whose authoritative source exists outside the React application, such as data retrieved from the Todo Application REST API.

TA-33 establishes the shared TanStack Query runtime, QueryClient configuration, and application-level provider integration required by later server-state features.

This ticket does not implement task queries, task mutations, authentication queries, or feature-specific cache behavior.

---

## Server State vs Client State

Server state and client state represent different concerns.

### Server State

Server state originates from an external system and may change independently from the frontend application.

Future examples include:

- Tasks retrieved from the API
- Individual task details
- Pagination metadata
- Authenticated user information
- Results of server mutations

TanStack Query will manage this category of state as feature-specific query functionality is introduced.

### Client State

Client state originates within and is controlled by the frontend application.

Examples include:

- Whether a dialog is open
- Mobile navigation visibility
- Selected local UI state
- Temporary component interaction state

Client state should not automatically be placed in TanStack Query.

---

## Server-State Architecture

The current application-level server-state architecture is:

```text
main.tsx
   │
   ▼
AppProviders
   │
   ▼
QueryClientProvider
   │
   ▼
RouterProvider
   │
   ▼
Routes
   │
   ▼
Layouts
   │
   ▼
Pages
TanStack Query is therefore available to descendants of the application-level provider composition without being configured independently inside pages or feature components.

QueryClient

The application uses a single shared QueryClient.

The QueryClient is configured in:

src/lib/queryClient.ts

The shared QueryClient provides the application-level runtime that future TanStack Query hooks will use.

Its responsibilities include:

Managing the query cache
Coordinating query lifecycle behavior
Providing global query defaults
Supporting future server-state queries
Supporting future cache invalidation
Supporting future mutation workflows

The QueryClient is created outside React presentation components so that the same client instance can be shared across the application.

QueryClientProvider

The shared QueryClient is provided to the React application through TanStack Query's QueryClientProvider.

Provider integration belongs within the centralized AppProviders composition established during TA-32.

Conceptually:

AppProviders
     │
     ▼
QueryClientProvider
     │
     ▼
RouterProvider
     │
     ▼
Application

This keeps TanStack Query runtime infrastructure separate from:

Application bootstrap
Route definitions
Layout components
Pages
Feature presentation components
Provider Composition

TA-32 established the application-level provider composition boundary.

TA-33 extends that existing architecture rather than creating another provider composition location.

The responsibility remains:

main.tsx
   │
   ▼
AppProviders
   │
   ├── QueryClientProvider
   │
   └── children

Future approved global providers should continue to be composed deliberately through AppProviders.

Current Query Defaults

The shared QueryClient currently establishes the following project-level query defaults:

Option	Configuration	Purpose
retry	false	Prevent automatic global retries
refetchOnWindowFocus	false	Prevent automatic refetch when browser focus returns
refetchOnReconnect	true	Allow stale queries to refetch after network reconnection

These values establish a conservative and predictable foundation before feature-specific query behavior is introduced.

Retry Strategy

The global QueryClient currently uses:

retry: false

This means failed queries are not automatically retried by the global configuration.

The decision is deliberate.

The Application Foundation does not yet contain the complete centralized API error-normalization infrastructure required to make reliable status-aware retry decisions globally.

Rather than blindly retrying failures, TA-33 establishes a conservative baseline where automatic retries are disabled.

This also ensures expected client and authentication failures are not repeatedly sent automatically.

Examples include:

Authentication failures
Authorization failures
Missing resources
Conflict responses
Validation failures

These failures generally require a change in user input, authentication state, permissions, or resource state rather than repeating the same request.

Future Retry Refinement

Disabling global retries does not mean the Todo Application can never retry requests.

Later architecture may introduce more deliberate retry behavior once API errors can be reliably classified and normalized.

Future retry decisions may distinguish between:

Expected deterministic failure
        │
        └── Do not retry

Transient network/server failure
        │
        └── Retry may be appropriate

Any future change to the global retry policy should be based on established application error contracts rather than assumptions about raw errors.

Feature-specific queries may also define different retry behavior where their requirements justify it.

Window Focus Refetching

The global configuration currently uses:

refetchOnWindowFocus: false

This prevents queries from automatically refetching merely because the user returns focus to the browser window.

This creates predictable behavior while the application foundation is being established and before feature-specific freshness requirements exist.

Future features may override this behavior where automatic focus refetching provides meaningful value.

Reconnect Refetching

The global configuration currently uses:

refetchOnReconnect: true

This allows eligible stale queries to refetch when network connectivity is restored.

Conceptually:

Application Online
       │
       ▼
Connection Lost
       │
       ▼
Connection Restored
       │
       ▼
Eligible stale server state may refetch

This is useful for server-backed application data because connectivity may be temporarily interrupted while the authoritative data continues to exist remotely.

Freshness and Cache Retention

TA-33 reviewed TanStack Query concepts such as query freshness and cache retention.

However, the shared QueryClient does not currently override global staleTime or gcTime.

The project therefore does not establish custom application-level values for these options during TA-33.

They should only be changed when actual application requirements justify a different policy.

This avoids introducing arbitrary cache timing values before task and authentication query behavior exists.

Query Keys

Query keys identify cached server-state resources within TanStack Query.

Future examples may include resources such as:

tasks
task details
authenticated user

TA-33 intentionally does not define these keys.

Task-specific query keys belong to the Task Management roadmap.

Authentication-specific query keys belong to the Authentication roadmap.

This keeps the Application Foundation independent from future feature behavior.

Queries

TA-33 does not implement any feature query.

The existence of QueryClientProvider means future approved query hooks will have access to TanStack Query infrastructure when rendered beneath the application provider tree.

Conceptually:

QueryClientProvider
        │
        ▼
Future Feature
        │
        ▼
Future Query Hook

The feature itself remains responsible for defining its query key, query function, and feature-specific behavior.

Mutations

TA-33 does not implement mutations.

Future mutation tickets may use TanStack Query for operations such as:

Create Task
Update Task
Delete Task

Those workflows may later require cache invalidation or cache updates.

TA-33 only establishes the shared runtime those features will depend on.

Cache Invalidation

Cache invalidation will become relevant when future mutations change server data.

Conceptually:

Mutation
    │
    ▼
Server Data Changes
    │
    ▼
Cached Data May Be Outdated
    │
    ▼
Invalidate Related Query
    │
    ▼
Refetch When Appropriate

No task-specific invalidation behavior is implemented during TA-33.

Error Handling Boundary

TanStack Query manages server-state lifecycle behavior, but it is not the application's complete error-normalization layer.

The Application Foundation roadmap separately introduces shared API contracts and centralized API error normalization.

The intended architecture evolves toward:

API
 │
 ▼
Axios
 │
 ▼
API Error / Response
 │
 ▼
Error Normalization
 │
 ▼
Query / Feature Layer
 │
 ▼
UI

Until that infrastructure exists, the QueryClient uses the conservative global retry: false policy rather than attempting to infer detailed retry behavior from incomplete error information.

Separation of Responsibilities

The server-state architecture follows these boundaries:

QueryClient
    ↓
Global TanStack Query runtime

Feature Query Hook
    ↓
Feature-specific server-state behavior

Service
    ↓
Domain/API operation

API Client
    ↓
HTTP communication

Component
    ↓
Presentation

The QueryClient should not contain task-specific or authentication-specific business behavior.

Development Guidelines

When future TanStack Query functionality is introduced:

Reuse the shared QueryClient.
Do not create QueryClient instances inside pages or components.
Compose QueryClientProvider through AppProviders.
Keep feature query keys within their approved feature architecture.
Keep feature queries outside global QueryClient configuration.
Keep API operations within the approved service/API layers.
Override global query behavior only when feature requirements justify it.
Do not move ordinary client UI state into TanStack Query.
Do not introduce task or authentication query behavior before its dedicated Jira ticket.
Revisit global retry behavior only when reliable error classification supports it.
Current Implementation Boundary

TA-33 establishes:

Shared QueryClient
        +
Global Query Defaults
        +
QueryClientProvider
        +
AppProviders Integration

TA-33 does not establish:

Task Queries
Task Query Keys
Task Mutations
Authentication Queries
Authentication Mutations
Feature Cache Invalidation
Feature-Specific Query Hooks
Validation

TanStack Query infrastructure should be validated using:

npm run lint
npm run format
npm run build

Manual validation should confirm:

The application starts successfully.
Existing routes continue to render.
QueryClientProvider is composed at application level.
The shared QueryClient is used by QueryClientProvider.
Existing Home and Tasks navigation remains functional.
No task-specific query behavior has been introduced.
No task mutation behavior has been introduced.
No authentication query behavior has been introduced.
Application Foundation Progress
TA-29 Runtime Dependencies          DONE
        ↓
TA-30 React Router                  DONE
        ↓
TA-31 Application Layouts           DONE
        ↓
TA-32 Global Providers              DONE
        ↓
TA-33 TanStack Query                DONE
        ↓
TA-34 Runtime Configuration         NEXT
Related Documentation
docs/
├── architecture/
│   ├── application-layout.md
│   ├── application-providers.md
│   ├── project-structure.md
│   ├── routing.md
│   └── server-state.md
│
└── development/
    └── runtime-dependencies.md

This document should be updated whenever the application's project-level TanStack Query configuration or server-state architecture materially changes.
```
