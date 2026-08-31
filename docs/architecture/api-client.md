# Shared Axios API Client

---

## Document Information

| Field              | Value                                                          |
| ------------------ | -------------------------------------------------------------- |
| **Category**       | Architecture                                                   |
| **Related Ticket** | TA-35 - Configure Axios API Client and Environment Integration |
| **Epic**           | TA-20 - Application Foundation                                 |
| **Release**        | v0.3.0                                                         |
| **Status**         | Complete                                                       |

---

## Overview

The Todo Application uses a shared Axios client as the central HTTP communication layer between frontend API services and the backend REST API.

The client is configured once and can be reused by future application services instead of creating separate Axios configuration for individual features.

TA-35 connects the runtime configuration established in TA-34 with the application's HTTP infrastructure.

The shared client remains generic and does not contain task, authentication, or other feature-specific business logic.

---

## API Client Location

The shared Axios client is located at:

```text
src/api/client.ts
```

Current API infrastructure:

```text
src/
├── api/
│   └── client.ts
├── config/
│   └── env.ts
├── lib/
│   ├── queryClient.ts
│   └── utils.ts
├── services/
└── types/
```

The `api` directory owns shared low-level API communication infrastructure.

Feature-specific API operations remain separate from the client.

---

## Architecture

The API client sits between the centralized runtime configuration and future application services.

```text
Environment
    │
    ▼
src/config/env.ts
    │
    │ validated API base URL
    ▼
src/api/client.ts
    │
    │ shared Axios configuration
    ▼
Future API Services
    │
    ▼
Backend REST API
```

This establishes a single HTTP configuration boundary for the application.

---

## Runtime Configuration Integration

The API client does not read Vite environment variables directly.

Instead, it consumes the centralized runtime configuration established by TA-34:

```text
src/config/env.ts
```

The client receives the API base URL through:

```ts
env.apiBaseUrl;
```

This creates the following configuration flow:

```text
VITE_API_BASE_URL
        │
        ▼
import.meta.env
        │
        ▼
src/config/env.ts
        │
        ├── Read configuration
        ├── Validate configuration
        └── Expose typed value
        │
        ▼
env.apiBaseUrl
        │
        ▼
src/api/client.ts
        │
        ▼
Axios baseURL
```

This prevents API services from hard-coding the backend URL or accessing Vite environment variables independently.

---

## Shared Axios Instance

The application creates one reusable Axios instance using:

```ts
axios.create();
```

The shared instance centralizes HTTP configuration that applies broadly to API requests.

The current client configuration includes:

- the backend API base URL;
- JSON request content type;
- JSON response preference.

Conceptually:

```ts
const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
```

The configured client is exported for future API services to consume.

---

## Base URL

The Axios `baseURL` is provided by:

```ts
env.apiBaseUrl;
```

rather than being hard-coded in the API client.

This means future services can make requests using relative API paths.

For example, a future service may use:

```ts
apiClient.get("/tasks");
```

instead of constructing a complete backend URL for every request.

The final request URL is resolved by Axios using the configured `baseURL`.

---

## Shared Request Headers

The API client currently defines the following shared headers:

| Header         | Value              | Purpose                                          |
| -------------- | ------------------ | ------------------------------------------------ |
| `Content-Type` | `application/json` | Indicates JSON request content                   |
| `Accept`       | `application/json` | Indicates that the client expects JSON responses |

These headers belong at the shared client level because they represent general communication expectations for the application's JSON REST API.

Feature-specific headers should not be added to the global client unless they genuinely apply to shared application HTTP behavior.

---

## Why Use a Shared Client?

Without a shared client, individual services could repeat configuration:

```text
Task Service
├── API base URL
├── headers
└── request configuration

Auth Service
├── API base URL
├── headers
└── request configuration
```

This creates duplication and makes infrastructure changes harder to maintain.

With the shared client:

```text
                    ┌── Task Service
                    │
Shared API Client ──┼── Auth Service
                    │
                    └── Future Services
```

Common HTTP configuration is defined once.

Future services only need to define feature-specific API operations.

---

## Separation of Responsibilities

### Runtime Configuration

Location:

```text
src/config/env.ts
```

Responsible for:

- reading supported frontend environment values;
- validating required runtime configuration;
- exposing typed configuration to application infrastructure.

It does not configure Axios.

---

### API Client

Location:

```text
src/api/client.ts
```

Responsible for:

- creating the shared Axios instance;
- consuming the validated API base URL;
- defining appropriate shared request defaults;
- exposing the reusable HTTP client.

It does not contain feature business logic.

---

### Services

Location:

```text
src/services/
```

Future services will be responsible for feature-specific API operations.

Examples may eventually include task or authentication services.

Services should consume the shared API client rather than constructing their own Axios configuration or hard-coding the API base URL.

TA-35 does not implement these services.

---

## API Client and TanStack Query

Axios and TanStack Query have different responsibilities.

```text
TanStack Query
      │
      │ server-state lifecycle
      ▼
Future Query Hooks
      │
      ▼
Feature Services
      │
      │ HTTP operations
      ▼
Shared Axios Client
      │
      ▼
Backend API
```

### TanStack Query

Responsible for concerns such as:

- server-state caching;
- loading state;
- query lifecycle;
- refetching;
- mutations;
- cache invalidation.

### Axios

Responsible for:

- making HTTP requests;
- applying shared HTTP configuration;
- communicating with the backend API.

TA-33 established the TanStack Query infrastructure.

TA-35 establishes the shared Axios HTTP infrastructure.

Feature integration between these layers belongs to later tickets.

---

## Authentication Boundary

Authentication behavior is intentionally excluded from the TA-35 API client.

The client does not currently implement:

- `Authorization` headers;
- bearer tokens;
- authentication interceptors;
- token storage;
- token refresh;
- authentication session management.

These concerns will be introduced only when the dedicated authentication architecture requires them.

Keeping authentication outside TA-35 ensures that the shared client remains generic and that authentication behavior is not implemented before its approved scope.

---

## Error Handling Boundary

Centralized API error normalization is not implemented by TA-35.

The shared Axios client is responsible for HTTP communication, not for translating backend errors into application-level error structures.

Centralized API error normalization is handled separately by TA-37.

TA-35 therefore does not introduce error-normalization interceptors or feature-specific error handling.

---

## API Types Boundary

TA-35 does not define shared API response, error, or pagination contracts.

Those types are introduced separately by TA-36.

Axios already provides TypeScript definitions for the Axios client itself, so a custom API-client type is not required solely to create the shared instance.

---

## Current Responsibility Flow

```text
TA-34
Runtime Configuration
        │
        │ env.apiBaseUrl
        ▼
TA-35
Shared Axios Client
        │
        │ reusable HTTP client
        ▼
Future Services
        │
        ▼
Future Query Hooks
        │
        ▼
Application Features
```

Each layer has a distinct responsibility.

---

## Current Implementation Boundary

TA-35 includes:

- creation of the shared Axios client;
- integration with centralized runtime configuration;
- configuration of the validated API base URL;
- shared JSON request defaults;
- a reusable client for future application services.

TA-35 does not include:

- task API methods;
- authentication services;
- authentication tokens;
- `Authorization` headers;
- token refresh;
- authentication interceptors;
- centralized API error normalization;
- shared API response types;
- pagination types;
- feature-specific business logic.

---

## Validation

TA-35 should be validated with:

```bash
npm run format
npm run lint
npm run build
```

Manual validation should additionally confirm:

- the Axios client imports successfully;
- the client consumes `env.apiBaseUrl`;
- the API base URL is not duplicated or hard-coded in the client;
- shared JSON headers are configured correctly;
- the application continues to start successfully;
- existing Home and Tasks routes remain accessible;
- no authentication behavior has been introduced;
- no feature service methods have been introduced;
- no centralized error normalization has been introduced;
- a safe connectivity or configuration check confirms the client is configured for the expected backend.

---

## Related Repository Documentation

- `docs/development/runtime-configuration.md`
- `docs/development/environment-setup.md`
- `docs/architecture/project-structure.md`
- `docs/architecture/server-state.md`
- `docs/architecture/application-providers.md`
- `README.md`

---

## Future Evolution

Later tickets will build on the shared API client without changing its core responsibility.

The current Application Foundation sequence is:

```text
TA-34 Runtime Configuration
        ↓
TA-35 Shared Axios API Client
        ↓
TA-36 Shared API Types
        ↓
TA-37 API Error Normalization
```

Future task and authentication services will consume the shared client when their dedicated implementation tickets are reached.

Authentication behavior must not be added to the client until the appropriate authentication scope requires it.

---

## Final Architecture

```text
VITE_API_BASE_URL
        │
        ▼
src/config/env.ts
        │
        │ validated configuration
        ▼
src/api/client.ts
        │
        ├── baseURL
        ├── Content-Type: application/json
        └── Accept: application/json
        │
        ▼
Future API Services
        │
        ▼
Backend REST API
```

This establishes one reusable HTTP communication boundary for the Todo Application while keeping configuration, API infrastructure, feature services, authentication, and error handling separated by responsibility.
