# Runtime Configuration

---

## Document Information

| Field              | Value                                                           |
| ------------------ | --------------------------------------------------------------- |
| **Category**       | Development                                                     |
| **Related Ticket** | TA-34 - Define Application Configuration and Runtime Validation |
| **Epic**           | TA-20 - Application Foundation                                  |
| **Release**        | v0.3.0                                                          |
| **Status**         | Complete                                                        |

---

## Overview

The Todo Application uses a centralized typed runtime configuration layer for frontend environment values required by application infrastructure.

Runtime configuration is read and validated before dependent application infrastructure uses it.

This prevents application code from reading Vite environment variables directly throughout the codebase and provides a predictable boundary between the Vite environment and application infrastructure.

TA-34 establishes configuration and validation only.

HTTP client behavior and Axios configuration remain outside this responsibility and are introduced separately by TA-35.

---

## Runtime Configuration Architecture

```text
Environment
    │
    ▼
Vite Environment Variables
    │
    ▼
import.meta.env
    │
    ▼
src/config/env.ts
    │
    ├── Read supported values
    ├── Validate required values
    └── Expose typed configuration
    │
    ▼
Application Infrastructure
```

Application infrastructure should consume the validated configuration exposed by the configuration layer instead of accessing `import.meta.env` directly.

---

## Configuration Location

The runtime configuration layer is located at:

```text
src/config/env.ts
```

The `config` directory owns application configuration concerns that do not belong to feature code, presentation components, services, or third-party library configuration.

Current structure:

```text
src/
├── config/
│   └── env.ts
├── lib/
│   └── queryClient.ts
├── providers/
├── routes/
├── layouts/
└── pages/
```

The distinction between `config` and `lib` is intentional.

`config` owns application runtime configuration.

`lib` owns shared library-level infrastructure such as the TanStack Query client.

---

## Supported Runtime Configuration

TA-34 establishes support for the API base URL required by later API infrastructure.

The corresponding Vite environment variable is:

```text
VITE_API_BASE_URL
```

The development configuration currently uses:

```text
VITE_API_BASE_URL=https://api.oluwasetemi.dev
```

The application configuration layer is responsible for reading and validating this value before dependent infrastructure consumes it.

---

## Environment Example

The repository contains:

```text
.env.example
```

This file documents the frontend environment variables required to configure the application.

Example:

```env
VITE_API_BASE_URL=https://api.oluwasetemi.dev
```

`.env.example` is documentation and configuration guidance.

It must not contain secrets, credentials, private tokens, or other confidential values.

---

## Local Environment

Developers may provide environment-specific values through local environment files supported by Vite.

Local environment files containing developer-specific configuration should not be committed when they are intentionally excluded by the repository Git configuration.

The tracked `.env.example` file remains the canonical example of required frontend configuration.

---

## TypeScript Environment Contract

Vite environment variables used by the application are represented through the project's TypeScript environment declarations.

The relevant declaration file is:

```text
src/vite-env.d.ts
```

This allows supported Vite environment variables to participate in the TypeScript contract rather than being treated as arbitrary untyped values throughout the application.

Type declarations alone do not provide runtime validation.

Runtime validation remains the responsibility of the centralized configuration layer.

---

## Validation

Required configuration must be validated before dependent application infrastructure uses it.

For TA-34, the API base URL is considered critical runtime configuration.

A missing or invalid required value must produce controlled developer-visible behavior instead of allowing the application to continue until unrelated infrastructure fails later.

This establishes the following boundary:

```text
Environment value
      │
      ▼
Configuration validation
      │
      ├── Valid
      │      ↓
      │   Typed configuration
      │      ↓
      │   Infrastructure
      │
      └── Invalid / Missing
             ↓
          Controlled configuration failure
```

The purpose of this validation is to make configuration failures identifiable at the configuration boundary.

---

## Application Startup

Runtime configuration is validated during application initialization before infrastructure that depends on the configuration is expected to use it.

This provides early feedback when required configuration is unavailable.

The application entry point therefore participates in establishing the configuration validation boundary without becoming responsible for defining environment values itself.

---

## Configuration Consumption Rule

Application infrastructure should consume centralized configuration rather than reading Vite environment variables independently.

Avoid:

```ts
const apiUrl = import.meta.env.VITE_API_BASE_URL;
```

throughout unrelated infrastructure or feature modules.

Instead, environment access should remain centralized behind the configuration layer.

This provides:

- one source of truth;
- consistent validation;
- TypeScript support;
- predictable configuration failures;
- easier maintenance;
- reduced environment access duplication.

---

## Frontend Environment Variable Security

Vite frontend environment variables are bundled into client-side application code.

Variables prefixed with:

```text
VITE_
```

must therefore be treated as publicly observable frontend configuration.

They are not secret storage.

Do not place values such as the following in frontend environment variables:

- passwords;
- private API keys;
- private access tokens;
- database credentials;
- server secrets;
- signing keys;
- refresh-token secrets;
- credentials intended to remain confidential.

Using an environment variable does not make a value secret when that variable is bundled into frontend code.

---

## Configuration Responsibilities

| Concern                         | Responsibility                              |
| ------------------------------- | ------------------------------------------- |
| Environment value declaration   | `.env.example`                              |
| Local environment values        | Developer/environment-specific `.env` files |
| TypeScript environment contract | `src/vite-env.d.ts`                         |
| Runtime configuration access    | `src/config/env.ts`                         |
| Required-value validation       | `src/config/env.ts`                         |
| Application startup validation  | Application bootstrap boundary              |
| Axios consumption               | TA-35                                       |
| Production Vercel configuration | Future deployment scope                     |

---

## Separation of Responsibilities

### Configuration Layer

Responsible for:

- reading supported frontend environment values;
- validating required values;
- exposing typed runtime configuration;
- providing controlled failure behavior for critical missing configuration.

### Application Entry Point

Responsible for:

- starting the React application;
- ensuring required runtime configuration has been evaluated before dependent infrastructure is used;
- preserving the existing application bootstrap architecture.

### API Layer

The shared Axios client now consumes the validated API base URL through `src/api/client.ts`, as implemented by TA-35. Axios configuration remains a separate responsibility from the TA-34 configuration module.

### Feature Code

Feature components should not access Vite environment variables directly when the value belongs to centralized application configuration.

---

## Relationship to Application Foundation

TA-34 builds on the existing Application Foundation sequence:

```text
TA-29 Runtime Dependencies
        ↓
TA-30 React Router
        ↓
TA-31 Application Layouts
        ↓
TA-32 Global Providers
        ↓
TA-33 TanStack Query + QueryClient
        ↓
TA-34 Runtime Configuration
        ↓
TA-35 Axios API Client
```

TA-34 creates the configuration boundary required by TA-35.

TA-35 consumes the validated API base URL without introducing direct Vite environment access into the shared HTTP client.

---

## Current Implementation Boundary

TA-34 includes:

- centralized frontend runtime configuration;
- typed environment declarations;
- required API base URL validation;
- controlled developer-visible configuration failure behavior;
- `.env.example`;
- Git handling for local environment configuration;
- application startup integration.

TA-34 does not include:

- Axios instance creation;
- Axios request configuration;
- HTTP interceptors;
- authentication tokens;
- API error normalization;
- task services;
- production Vercel environment configuration;
- secret management.

These responsibilities remain owned by their dedicated roadmap tickets.

---

## Validation

Repository validation should include:

```bash
npm run format
npm run lint
npm run build
```

Runtime validation should additionally confirm:

- the application starts when required configuration is valid;
- the configured API base URL is available through the centralized configuration layer;
- missing critical configuration produces controlled developer-visible behavior;
- feature and infrastructure code do not need to independently read the supported runtime value;
- `.env.example` documents the required variable;
- no frontend environment documentation presents `VITE_*` variables as secret storage;
- existing routes and application providers continue to start successfully.

---

## Related Repository Documentation

- `docs/development/environment-setup.md`
- `docs/architecture/project-structure.md`
- `docs/architecture/server-state.md`
- `docs/architecture/application-providers.md`
- `README.md`

---

## Future Evolution

Later tickets may extend the runtime configuration contract when additional approved frontend runtime values are required.

New values should be added deliberately rather than creating independent `import.meta.env` access throughout the application.

TA-35 consumes the validated API base URL in the shared Axios API client.

Production Vercel environment configuration remains outside TA-34 and will be handled during the appropriate deployment scope.

---

## Final Architecture

```text
Vite Environment
       │
       ▼
import.meta.env
       │
       ▼
src/config/env.ts
       │
       ├── Runtime validation
       ├── Typed configuration
       └── Controlled failure
       │
       ▼
Application Infrastructure
       │
       ▼
TA-35 Shared Axios Client
```

This configuration boundary ensures that frontend infrastructure consumes known, validated runtime configuration instead of depending on scattered environment-variable access.
