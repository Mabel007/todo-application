# API Error Normalization

---

## Document Information

| Field              | Value                                                 |
| ------------------ | ----------------------------------------------------- |
| **Category**       | Architecture                                          |
| **Related Ticket** | TA-37 - Implement Centralized API Error Normalization |
| **Epic**           | TA-20 - Application Foundation                        |
| **Release**        | v0.3.0                                                |
| **Status**         | Complete                                              |

---

## Overview

The Todo Application uses a centralized API error-normalization layer to convert raw Axios and backend API failures into predictable application-facing error structures.

This prevents feature components and future API services from repeatedly parsing Axios errors, inspecting HTTP response shapes, or depending directly on transport-specific error objects.

TA-37 introduces three related pieces of infrastructure:

1. A reusable API validation issue type in `src/types/api.ts`
2. A discriminated application error model in `src/types/errors.ts`
3. Runtime API error validation and normalization in `src/api/errors.ts`

The normalization layer preserves safe information required by later feature-level error handling while avoiding exposure of raw Axios errors, stack traces, and unsupported backend details.

---

## Architecture

The error flow is:

```text
Backend / Network Failure
        │
        ▼
Axios Error
        │
        ▼
src/api/errors.ts
        │
        ├── Identify Axios error
        ├── Detect network failure
        ├── Validate API error payload
        ├── Inspect HTTP status
        └── Normalize safe information
        │
        ▼
AppError
        │
        ▼
Future Services / Query Hooks / UI
```

Feature components can therefore work with `AppError` rather than understanding Axios internals.

---

## Relevant Files

TA-37 affects the following error-handling infrastructure:

```text
src/
├── api/
│   ├── client.ts
│   └── errors.ts
│
└── types/
    ├── api.ts
    └── errors.ts
```

Responsibilities are separated as follows:

| File                  | Responsibility                                                   |
| --------------------- | ---------------------------------------------------------------- |
| `src/types/api.ts`    | Describes validated backend API structures                       |
| `src/types/errors.ts` | Defines normalized application error structures                  |
| `src/api/errors.ts`   | Validates unknown API failures and converts them into `AppError` |
| `src/api/client.ts`   | Provides the shared Axios HTTP client                            |

---

## API Validation Issue Type

TA-37 extracts the validation issue structure into the reusable `ApiValidationIssue` interface.

```ts
export interface ApiValidationIssue {
  path: Array<string | number>;
  message: string;
  code: string;
}
```

This represents an individual validation issue returned by the validated backend contract.

### Fields

| Field     | Type                      | Purpose                                                |
| --------- | ------------------------- | ------------------------------------------------------ |
| `path`    | `Array<string \| number>` | Identifies the location of the invalid value           |
| `message` | `string`                  | Describes the validation failure                       |
| `code`    | `string`                  | Contains the validation issue code returned by the API |

A validation path can contain both strings and numbers.

For example:

```ts
["title"];
```

or:

```ts
["items", 0, "name"];
```

This type is reusable both in the backend response contract and in normalized validation errors.

---

## Updated API Error Response

The shared API error response uses `ApiValidationIssue` rather than defining the validation issue structure inline.

```ts
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: {
    issues: ApiValidationIssue[];
    name: string;
  };
}
```

The API response contains:

| Field          | Type                   | Purpose                                                     |
| -------------- | ---------------------- | ----------------------------------------------------------- |
| `success`      | `boolean`              | Represents the API operation outcome                        |
| `message`      | `string`               | Provides the backend error message                          |
| `error`        | Optional object        | Contains structured validation error details when available |
| `error.issues` | `ApiValidationIssue[]` | Contains individual validation failures                     |
| `error.name`   | `string`               | Identifies the backend validation or error type             |

Making `error` optional allows the shared structure to represent API failures that provide a general message without structured validation issues.

---

## Application Error Model

Normalized application errors are defined in:

```text
src/types/errors.ts
```

The application uses a discriminated union named:

```ts
AppError;
```

Each error variant contains a `type` property that allows consumers to distinguish failures safely.

Current supported error types are:

```text
AppError
│
├── validation
├── unauthenticated
├── unauthorized
├── not-found
├── conflict
├── rate-limit
├── server
├── network
└── unknown
```

---

## Why a Discriminated Union Is Used

Every `AppError` contains a literal `type` value.

For example:

```ts
{
  type: "unauthorized",
  status: 403,
  message: "Access denied"
}
```

A future consumer can inspect:

```ts
error.type;
```

and TypeScript can narrow the error to the correct variant.

Conceptually:

```ts
if (error.type === "validation") {
  // TypeScript knows error.issues exists here
}
```

This provides a predictable application contract without exposing the original Axios error.

---

## Validation Error

Validation failures use:

```ts
{
  type: "validation";
  message: string;
  status: 422;
  issues: ApiValidationIssue[];
}
```

Validation errors preserve structured field-level issues because later forms or feature-level error states may need that information.

The normalized structure contains:

```text
validation
├── status: 422
├── message
└── issues[]
    ├── path
    ├── message
    └── code
```

Raw Axios response objects are not exposed.

---

## Unauthenticated Error

HTTP `401` responses normalize to:

```ts
{
  type: "unauthenticated";
  message: string;
  status: 401;
}
```

This represents a request that requires authentication or where authentication has failed.

TA-37 only identifies the error.

It does not implement token refresh, session recovery, login redirects, or other authentication behavior.

---

## Unauthorized Error

HTTP `403` responses normalize to:

```ts
{
  type: "unauthorized";
  message: string;
  status: 403;
}
```

This represents an authenticated or identified request that is not permitted to access the requested resource.

Presentation and permission-specific UI behavior remain outside this normalization layer.

---

## Not Found Error

HTTP `404` responses normalize to:

```ts
{
  type: "not-found";
  message: string;
  status: 404;
}
```

This represents an API resource that could not be found.

This is different from the application's route-level 404 experience.

Unknown browser routes are handled separately by TA-39.

---

## Conflict Error

HTTP `409` responses normalize to:

```ts
{
  type: "conflict";
  message: string;
  status: 409;
}
```

Conflict handling is included because the validated API behavior can return HTTP `409` failures.

The normalization layer identifies the failure category while leaving feature-specific presentation decisions to later consumers.

---

## Rate Limit Error

HTTP `429` responses normalize to:

```ts
{
  type: "rate-limit";
  message: string;
  status: 429;
}
```

This distinguishes rate limiting from general server or unknown failures.

Retry timing or feature-specific retry behavior is not implemented by TA-37.

---

## Server Error

HTTP responses between `500` and `599` normalize to:

```ts
{
  type: "server";
  status: number;
  message: "The server encountered an error";
}
```

The server response message is intentionally not passed through for this category.

This avoids exposing potentially sensitive backend implementation details through normalized application-facing data.

---

## Network Error

An Axios error without an HTTP response is normalized as:

```ts
{
  type: "network";
  message: "Unable to reach the server";
}
```

This represents failures where Axios could not obtain a server response.

Possible causes may include:

- unavailable network connectivity;
- DNS or connection failures;
- unreachable backend service;
- request transport failure.

The normalized result intentionally avoids exposing Axios implementation details.

---

## Unknown Error

Failures that cannot be safely classified use:

```ts
{
  type: "unknown";
  message: string;
}
```

Two main situations currently produce an unknown error.

### Non-Axios Errors

If the supplied value is not recognized by:

```ts
axios.isAxiosError(error);
```

the result is:

```ts
{
  type: "unknown",
  message: "An unexpected error occurred"
}
```

### Unsupported HTTP Status

If Axios provides an HTTP response but its status does not match a supported category, the result is:

```ts
{
  type: "unknown",
  message: "An unexpected API error occurred"
}
```

This provides a safe fallback without leaking the raw error object.

---

## Runtime Error Shape Validation

Network data cannot be trusted solely because TypeScript defines an interface.

API responses arrive at runtime as unknown external data.

TA-37 therefore validates API error payloads before treating them as `ApiErrorResponse`.

The validation chain is:

```text
unknown response data
        │
        ▼
isApiErrorResponse()
        │
        ▼
isApiErrorDetails()
        │
        ▼
isApiValidationIssue()
        │
        ▼
Validated ApiErrorResponse
```

These functions are TypeScript type guards.

---

## Validation Issue Type Guard

The function:

```ts
isApiValidationIssue();
```

checks that an unknown value:

- is an object;
- is not `null`;
- contains a `path`;
- has a `path` that is an array;
- contains only strings or numbers in the path;
- contains a string `message`;
- contains a string `code`.

Its return type:

```ts
value is ApiValidationIssue
```

tells TypeScript that after the function returns `true`, the value can safely be treated as an `ApiValidationIssue`.

---

## API Error Details Type Guard

The function:

```ts
isApiErrorDetails();
```

validates the nested `error` object.

It checks that:

- the value is a non-null object;
- `issues` exists;
- `issues` is an array;
- every issue passes `isApiValidationIssue`;
- `name` exists;
- `name` is a string.

Only after these checks does the value qualify as valid API error details.

---

## API Error Response Type Guard

The function:

```ts
isApiErrorResponse();
```

validates the overall API error payload.

The current contract requires:

```text
success === false
message is a string
```

If an `error` property is present, it must also pass the nested error-detail validation.

This allows general API errors without structured validation issues while validating nested structures when they are available.

---

## Shared API Type Reuse

The normalization layer reuses the API contracts defined in:

```text
src/types/api.ts
```

The error-normalization module imports:

```ts
import type { ApiErrorResponse, ApiValidationIssue } from "@/types/api";
```

This keeps the runtime normalization layer aligned with the shared API contract introduced in TA-36.

`ApiValidationIssue` is defined once and reused by both:

- `ApiErrorResponse`;
- the runtime validation type guard in `src/api/errors.ts`.

This avoids duplicating the validation issue structure across infrastructure modules.

The separation remains:

```text
src/types/api.ts
        │
        ├── ApiErrorResponse
        └── ApiValidationIssue
                │
                ▼
src/api/errors.ts
        │
        ├── Runtime type guards
        └── normalizeApiError()
                │
                ▼
src/types/errors.ts
        │
        └── AppError
```

The API types describe the validated backend contract.

The error-normalization module verifies unknown runtime values against those contracts and converts supported failures into application-facing `AppError` values.

---

## Normalization Function

The public normalization function is:

```ts
normalizeApiError(error: unknown): AppError
```

It deliberately accepts:

```ts
unknown;
```

because any thrown value can reach an error-handling boundary.

The function must prove what the error is before accessing transport or response properties.

Its processing sequence is:

```text
unknown error
      │
      ▼
Axios error?
      │
  ┌───┴────┐
  │        │
 No       Yes
  │        │
  ▼        ▼
unknown   response?
             │
        ┌────┴────┐
        │         │
       No        Yes
        │         │
        ▼         ▼
     network   status + data
                  │
                  ▼
          validate API data
                  │
                  ▼
            classify status
                  │
                  ▼
              AppError
```

---

## HTTP Status Mapping

The current normalization mapping is:

| HTTP Condition               | Normalized Type   |
| ---------------------------- | ----------------- |
| `401`                        | `unauthenticated` |
| `403`                        | `unauthorized`    |
| `404`                        | `not-found`       |
| `409`                        | `conflict`        |
| `422`                        | `validation`      |
| `429`                        | `rate-limit`      |
| `500-599`                    | `server`          |
| Axios error without response | `network`         |
| Unsupported Axios response   | `unknown`         |
| Non-Axios error              | `unknown`         |

---

## Safe Message Handling

The normalization layer distinguishes between information that can safely be preserved and information that should remain hidden.

For supported client/API errors such as:

```text
401
403
404
409
422
429
```

the normalized result may preserve the validated API `message`.

If the response does not match the validated API error structure, safe fallback messages are used.

For server errors, the implementation intentionally replaces backend details with:

```text
The server encountered an error
```

For network errors:

```text
Unable to reach the server
```

For unsupported errors:

```text
An unexpected error occurred
```

or:

```text
An unexpected API error occurred
```

This prevents raw transport details, stack traces, and unvalidated backend data from becoming part of the application-facing error contract.

---

## Presentation Boundary

`AppError.message` provides safe error information, but TA-37 does not define final feature presentation.

For example, a future UI may choose to convert:

```text
type: "unauthenticated"
```

into a feature-appropriate message or action.

The normalization layer determines:

```text
What kind of failure occurred?
What safe information can be preserved?
```

The presentation layer determines:

```text
How should this failure be shown to the user?
What UI action should be offered?
```

This separation keeps HTTP parsing out of components while keeping feature presentation decisions out of infrastructure.

---

## Feature Consumption

Without centralized normalization, future components or services might repeatedly perform logic such as:

```text
Is this Axios?
Does response exist?
What is the status?
Does response.data have error?
Does it have issues?
What fields are safe?
```

TA-37 centralizes that responsibility.

Future application code can instead receive:

```text
AppError
```

and reason about:

```ts
error.type;
```

This reduces duplicate low-level error parsing across features.

---

## Relationship to Axios

TA-35 established:

```text
src/api/client.ts
```

for HTTP communication.

TA-37 adds:

```text
src/api/errors.ts
```

for HTTP/API failure normalization.

Their responsibilities remain separate:

| Module      | Responsibility                                 |
| ----------- | ---------------------------------------------- |
| `client.ts` | Configure and perform HTTP communication       |
| `errors.ts` | Interpret failures from HTTP/API communication |

The shared Axios client does not become responsible for feature presentation.

---

## Relationship to Shared API Types

TA-36 established the shared backend contract types.

TA-37 builds directly on those types.

```text
TA-36
ApiErrorResponse
ApiValidationIssue
        │
        ▼
TA-37
Runtime shape validation
        │
        ▼
normalizeApiError()
        │
        ▼
AppError
```

TA-36 describes what the validated backend error structure looks like.

TA-37 determines whether unknown runtime data matches that structure and converts supported failures into application-facing errors.

---

## Error Normalization vs React Error Boundary

API error normalization is separate from React render error handling.

TA-37 handles:

```text
Axios failures
Network failures
HTTP/API errors
```

It does not handle:

```text
React render exceptions
Component tree crashes
Unexpected rendering failures
```

Application-level React Error Boundary behavior belongs to TA-38.

---

## Authentication Boundary

TA-37 recognizes authentication-related status codes:

```text
401 → unauthenticated
403 → unauthorized
```

It does not implement:

- token refresh;
- authentication retries;
- logout behavior;
- redirects;
- session restoration;
- credential storage.

The normalized error only communicates the failure category to later application layers.

---

## Current Scope

TA-37 includes:

- reusable API validation issue typing;
- normalized application error types;
- Axios error detection;
- network error detection;
- runtime API error shape validation;
- validation error normalization;
- unauthenticated error normalization;
- unauthorized error normalization;
- not-found error normalization;
- conflict error normalization;
- rate-limit error normalization;
- server error normalization;
- unknown error fallback behavior;
- safe preservation of supported validation issues;
- safe message fallbacks.

TA-37 does not include:

- feature-specific error UI;
- React Error Boundary behavior;
- authentication refresh;
- login redirects;
- retry orchestration;
- feature query hooks;
- task CRUD behavior;
- user-facing form implementation.

---

## Application Foundation Sequence

TA-37 continues the API infrastructure sequence:

```text
TA-34
Runtime Configuration
        ↓
TA-35
Shared Axios Client
        ↓
TA-36
Shared API Types
        ↓
TA-37
Centralized API Error Normalization
        ↓
TA-38
Application Error Boundary
```

Each layer solves a different error or infrastructure concern.

---

## Validation

Repository validation should include:

```bash
npm run format
npm run lint
npm run build
```

Representative normalization validation should confirm at minimum:

- non-Axios errors become `unknown`;
- Axios errors without responses become `network`;
- `401` becomes `unauthenticated`;
- `403` becomes `unauthorized`;
- `404` becomes `not-found`;
- `409` becomes `conflict`;
- valid `422` responses preserve validated issues;
- malformed `422` responses do not expose unvalidated issue data;
- `429` becomes `rate-limit`;
- `5xx` responses become `server`;
- unsupported HTTP statuses become `unknown`;
- malformed API error payloads use safe fallback messages;
- server errors do not expose backend response details;
- raw Axios errors and stack traces are not returned through `AppError`.

---

## Documentation Impact

TA-37 introduces a new application-level error infrastructure boundary.

Relevant repository documentation should reflect:

- `src/types/errors.ts` as the normalized application error contract;
- `src/api/errors.ts` as the centralized API normalization module;
- `ApiValidationIssue` as a reusable shared API type;
- the separation between backend API error contracts and frontend normalized errors;
- the separation between API error normalization and React Error Boundary behavior.

Relevant architecture documentation includes:

- `docs/architecture/api-types.md`
- `docs/architecture/api-client.md`
- `docs/architecture/project-structure.md`
- `docs/architecture/server-state.md`

---

## Final Architecture

```text
Backend / Transport Failure
          │
          ▼
      Axios Error
          │
          ▼
    Unknown response data
          │
          ▼
Runtime Type Guards
          │
          ├── isApiValidationIssue
          ├── isApiErrorDetails
          └── isApiErrorResponse
          │
          ▼
   normalizeApiError()
          │
          ▼
       AppError
          │
          ├── validation
          ├── unauthenticated
          ├── unauthorized
          ├── not-found
          ├── conflict
          ├── rate-limit
          ├── server
          ├── network
          └── unknown
          │
          ▼
Future Feature Error Handling
```

This provides the Todo Application with one predictable error contract while keeping Axios internals, unsafe backend data, authentication behavior, React render failures, and feature presentation outside the normalization layer.
