# Shared API Types

---

## Document Information

| Field              | Value                                                          |
| ------------------ | -------------------------------------------------------------- |
| **Category**       | Architecture                                                   |
| **Related Ticket** | TA-36 - Define Shared API Response, Error and Pagination Types |
| **Epic**           | TA-20 - Application Foundation                                 |
| **Release**        | v0.3.0                                                         |
| **Status**         | Complete                                                       |

---

## Overview

The Todo Application defines reusable TypeScript types for common structures returned by the backend API.

These shared types establish consistent contracts for:

- paginated API metadata;
- paginated collection responses;
- single-resource responses;
- standard API error responses.

The types are based on API structures validated during API investigation rather than invented frontend response shapes.

TA-36 defines TypeScript contracts only.

It does not implement runtime validation, error normalization, feature-specific domain models, or API service behavior.

---

## Type Location

Shared API infrastructure types are located at:

```text
src/types/api.ts
```

The relevant application structure is:

```text
src/
├── api/
│   └── client.ts
├── config/
│   └── env.ts
├── services/
└── types/
    └── api.ts
```

Each directory has a separate responsibility:

| Location        | Responsibility                           |
| --------------- | ---------------------------------------- |
| `src/config/`   | Runtime application configuration        |
| `src/api/`      | Shared HTTP communication infrastructure |
| `src/types/`    | Shared TypeScript contracts              |
| `src/services/` | Future feature-specific API operations   |

---

## Architecture

TA-36 extends the API foundation established by TA-34 and TA-35.

```text
Runtime Configuration
        │
        ▼
Shared Axios Client
        │
        ▼
Backend API
        │
        ▼
Shared API Structures
        │
        ▼
src/types/api.ts
        │
        ▼
Future API Services
```

The shared types describe common API structures without introducing feature-specific business models.

---

## Shared Type Architecture

The current shared API type layer contains four primary contracts:

```text
src/types/api.ts
│
├── ApiPaginatedMeta
│
├── PaginatedResponse<T>
│
├── SingleResponse<T>
│
└── ApiErrorResponse
```

These types can be reused by future services while keeping task and authentication domain models separate.

---

## Pagination Metadata

The `ApiPaginatedMeta` interface represents pagination metadata returned by validated paginated API endpoints.

```ts
export interface ApiPaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
```

### Properties

| Property          | Type      | Purpose                                                  |
| ----------------- | --------- | -------------------------------------------------------- |
| `total`           | `number`  | Total number of available records                        |
| `page`            | `number`  | Current page                                             |
| `limit`           | `number`  | Maximum number of records requested or returned per page |
| `totalPages`      | `number`  | Total number of available pages                          |
| `hasNextPage`     | `boolean` | Indicates whether another page follows the current page  |
| `hasPreviousPage` | `boolean` | Indicates whether a page exists before the current page  |

Keeping pagination metadata in a shared interface prevents individual feature services from redefining the same pagination contract.

---

## Paginated Collection Response

Paginated collection endpoints use the generic `PaginatedResponse<T>` interface.

```ts
export interface PaginatedResponse<T> {
  data: T[];
  meta: ApiPaginatedMeta;
}
```

The generic type parameter `<T>` represents the domain model contained in the response.

The shared infrastructure type does not need to know whether that model represents a task, user, or another future resource.

Conceptually:

```text
PaginatedResponse<T>
│
├── data: T[]
│
└── meta: ApiPaginatedMeta
```

A future feature can supply its own domain type while reusing the shared response contract.

For example:

```ts
PaginatedResponse<Task>;
```

In this example, `Task` would be defined by the appropriate task-domain layer, not by `src/types/api.ts`.

TA-36 therefore establishes the response structure without implementing the task model itself.

---

## Single Resource Response

The `SingleResponse<T>` interface represents the standard wrapper for a single API resource.

```ts
export interface SingleResponse<T> {
  data: T;
}
```

Like `PaginatedResponse<T>`, it uses a generic type parameter.

Conceptually:

```text
SingleResponse<T>
      │
      └── data: T
```

This allows future feature services to reuse the response wrapper without creating duplicate infrastructure types.

For example:

```ts
SingleResponse<Task>;
```

or:

```ts
SingleResponse<User>;
```

These examples demonstrate generic reuse only. Task and authentication domain models remain outside TA-36.

---

## Why Generics Are Used

The shared response structure remains the same even when the resource inside the response changes.

Without generics, the application could eventually accumulate duplicate structures such as:

```text
TaskResponse
UserResponse
ProfileResponse
OtherResourceResponse
```

even when each API response follows the same wrapper structure.

Generics allow the infrastructure contract to remain reusable:

```text
SingleResponse<T>
        │
        ├── Task
        ├── User
        └── Other future domain models
```

The same principle applies to paginated collections:

```text
PaginatedResponse<T>
        │
        ├── Task[]
        ├── User[]
        └── Other future collections
```

This separates the shared API structure from the feature data contained inside it.

---

## API Error Response

The `ApiErrorResponse` interface represents the validated shared API error structure.

```ts
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: {
    issues: Array<{
      path: string | number[];
      message: string;
      code: string;
    }>;
  };
}
```

The shared error response contains:

| Property       | Type            | Purpose                                                        |
| -------------- | --------------- | -------------------------------------------------------------- |
| `success`      | `boolean`       | Represents the API operation success state                     |
| `message`      | `string`        | Provides the API response message                              |
| `error`        | optional object | Contains additional structured error information when provided |
| `error.issues` | `Array`         | Contains individual validation/error issues                    |

Each issue currently contains:

| Property  | Type                 | Purpose                                                              |
| --------- | -------------------- | -------------------------------------------------------------------- |
| `path`    | `string \| number[]` | Identifies the affected path according to the validated API contract |
| `message` | `string`             | Describes the individual issue                                       |
| `code`    | `string`             | Identifies the issue/error code returned by the API                  |

The `error` property is optional because the shared API response contract does not require structured issues on every error response.

---

## Error Type vs Error Normalization

TA-36 defines the shape of supported API errors.

It does **not** decide how the application should interpret, transform, display, or normalize those errors.

These are different responsibilities.

```text
Backend Error Response
        │
        ▼
ApiErrorResponse
        │
        │ describes the structure
        ▼
TA-37 Error Normalization
        │
        │ interprets/transforms errors
        ▼
Application Error Handling
```

`ApiErrorResponse` therefore remains a TypeScript contract.

Centralized error normalization behavior belongs to TA-37.

---

## TypeScript Types Are Not Runtime Validation

The shared API interfaces provide compile-time TypeScript contracts.

They do not validate network responses at runtime.

```text
Backend JSON
     │
     ▼
Network Response
     │
     ▼
Application Runtime
```

TypeScript interfaces are removed during compilation and cannot independently guarantee that external JSON matches an interface.

The purpose of TA-36 is to represent the API contract accurately for application development based on the behavior already validated during API investigation.

Runtime validation should not be added to TA-36 unless introduced through a separately approved scope.

---

## Separation of Shared and Domain Types

Shared infrastructure types must remain independent of feature business models.

Correct responsibility:

```text
Shared API Types
│
├── ApiPaginatedMeta
├── PaginatedResponse<T>
├── SingleResponse<T>
└── ApiErrorResponse
```

Feature-specific models belong elsewhere:

```text
Domain Types
│
├── Task
├── User
├── Authentication models
└── Other feature models
```

The shared API type layer should not contain fields such as:

```text
task title
task status
user email
password
authentication token
```

Those values belong to their respective feature/domain contracts.

---

## Relationship to the Axios Client

TA-35 established:

```text
src/api/client.ts
```

as the reusable HTTP client.

TA-36 complements that infrastructure by defining the shared TypeScript contracts future API services can use.

```text
src/api/client.ts
        │
        │ performs HTTP communication
        ▼
Future Service
        │
        │ uses shared response contracts
        ▼
src/types/api.ts
```

The Axios client and API types therefore solve different problems:

| Layer           | Responsibility                                     |
| --------------- | -------------------------------------------------- |
| Axios client    | How HTTP communication is configured               |
| API types       | What shared API structures look like               |
| Future services | What feature-specific API operations are performed |

---

## Contract Accuracy

Shared API types must reflect documented and observed backend behavior.

Do not add fields simply because they are commonly found in other APIs.

For example, fields such as:

```text
status
timestamp
links
currentPage
nextPage
previousPage
errors
```

must not be introduced unless they are part of the validated Todo Application API contract.

This prevents the frontend type system from describing capabilities or response structures that the backend does not actually provide.

---

## Current Implementation Boundary

TA-36 includes:

- shared pagination metadata;
- generic paginated collection response structure;
- generic single-resource response structure;
- shared API error response structure;
- reusable generic TypeScript contracts.

TA-36 does not include:

- task-domain models;
- authentication-domain models;
- Axios configuration;
- feature service methods;
- runtime response validation;
- centralized API error normalization;
- error presentation behavior;
- authentication behavior.

---

## Application Foundation Sequence

TA-36 continues the API infrastructure sequence:

```text
TA-34
Runtime Configuration
        ↓
TA-35
Shared Axios API Client
        ↓
TA-36
Shared API Types
        ↓
TA-37
Centralized API Error Normalization
```

Each ticket introduces one infrastructure responsibility without implementing later feature behavior early.

---

## Validation

TA-36 should be validated with:

```bash
npm run format
npm run lint
npm run build
```

Validation should additionally confirm:

- `src/types/api.ts` compiles successfully;
- shared response types are reusable through generics;
- pagination fields match the validated API contract;
- error fields match the validated API contract;
- no task-domain models were introduced;
- no authentication-domain models were introduced;
- no error-normalization behavior was introduced;
- no unsupported API response fields were invented.

---

## Related Repository Documentation

- `docs/architecture/api-client.md`
- `docs/development/runtime-configuration.md`
- `docs/api/`
- `docs/architecture/project-structure.md`
- `README.md`

---

## Future Evolution

Future API services can import these shared types when their response structures match the validated shared API contract.

Feature-specific models should remain separately defined and supplied through generic parameters where appropriate.

TA-37 builds on the validated error structures through the centralized API error normalization in `src/api/errors.ts`.

Any future changes to these shared interfaces should be based on verified backend contract changes rather than frontend assumptions.

---

## Final Architecture

```text
Backend REST API
        │
        ▼
Shared API Contract
        │
        ├── Collection
        │     └── PaginatedResponse<T>
        │             ├── data: T[]
        │             └── ApiPaginatedMeta
        │
        ├── Single Resource
        │     └── SingleResponse<T>
        │             └── data: T
        │
        └── Error
              └── ApiErrorResponse
                    ├── success
                    ├── message
                    └── error?.issues
```

This shared type layer provides reusable TypeScript contracts for future API services while keeping infrastructure structures separate from task, authentication, and other feature-domain models.
