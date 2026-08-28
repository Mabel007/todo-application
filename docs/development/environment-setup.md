# Environment Setup

---

## Document Information

| Field             | Value                                                           |
| ----------------- | --------------------------------------------------------------- |
| **Category**      | Development                                                     |
| **Introduced By** | TA-8 - Create Project Documentation and Verify Foundation Setup |
| **Updated By**    | TA-34 - Define Application Configuration and Runtime Validation |
| **Epic**          | TA-1 Project Foundation / TA-20 Application Foundation          |
| **Status**        | Active                                                          |
| **Last Updated**  | August 2026                                                     |

---

## Overview

This document describes the local development environment required to run the Todo Application.

The application uses Vite frontend environment variables together with a centralized typed runtime configuration layer.

Required runtime configuration must be available before dependent application infrastructure is used.

---

## Prerequisites

- Node.js 22+
- npm 10+

Verify the installed versions:

```bash
node --version
npm --version
```

---

## Installation

Install project dependencies:

```bash
npm install
```

---

## Environment Configuration

The repository provides an example environment configuration file:

```text
.env.example
```

Create a local `.env` file from the example before starting the application.

### Windows PowerShell

```powershell
Copy-Item .env.example .env
```

### macOS / Linux

```bash
cp .env.example .env
```

The local `.env` file is environment-specific and should not be committed to source control.

---

## Required Environment Variables

The current required frontend runtime configuration is:

```env
VITE_API_BASE_URL=https://api.oluwasetemi.dev
```

### `VITE_API_BASE_URL`

Defines the root URL of the backend API used by application infrastructure.

The value is read and validated through the centralized runtime configuration layer:

```text
src/config/env.ts
```

Application infrastructure should consume the validated configuration exposed by this layer instead of reading `import.meta.env` independently throughout the codebase.

---

## Runtime Configuration Architecture

Frontend runtime configuration follows this flow:

```text
.env
  │
  ▼
Vite
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

TypeScript declarations for supported Vite environment variables are maintained in:

```text
src/vite-env.d.ts
```

This provides a typed contract for supported environment variables.

Runtime validation remains the responsibility of:

```text
src/config/env.ts
```

---

## Runtime Configuration Validation

Required configuration is validated before dependent application infrastructure uses it.

If critical configuration such as `VITE_API_BASE_URL` is missing, the application provides controlled developer-visible behavior rather than allowing an obscure downstream infrastructure failure.

This makes configuration problems identifiable during application startup and development.

---

## Frontend Environment Variable Security

Frontend environment variables must **not** be treated as secret storage.

Vite exposes variables prefixed with:

```text
VITE_
```

to client-side application code.

These values can therefore become visible to users through the compiled frontend application.

Do not store the following in frontend environment variables:

- Passwords
- Private API keys
- Database credentials
- Private access tokens
- Signing secrets
- Server-only credentials
- Any value that must remain confidential

The API base URL is public application configuration and is safe to expose as frontend runtime configuration.

Using an environment variable does not make a value secret when that value is bundled into client-side code.

---

## Start Development Server

After installing dependencies and configuring the local environment, start the Vite development server:

```bash
npm run dev
```

Open the local URL displayed by Vite in the terminal.

Verify that:

- The application starts successfully.
- No runtime configuration error is reported.
- The Home route loads.
- The Tasks route loads.

---

## Build

Create a production build:

```bash
npm run build
```

The build must complete successfully before a ticket is considered ready for review.

---

## Code Quality

Run lint validation:

```bash
npm run lint
```

Run formatting:

```bash
npm run format
```

Before opening a Pull Request, run:

```bash
npm run format
npm run lint
npm run build
```

---

## Configuration Troubleshooting

### Missing API Base URL

If application startup reports that the required API base URL is missing, verify that the local `.env` file exists and contains:

```env
VITE_API_BASE_URL=https://api.oluwasetemi.dev
```

After changing environment variables, restart the Vite development server so the updated values are loaded.

### Local Environment File Accidentally Tracked

The developer-specific `.env` file should not be committed.

Verify with:

```bash
git status
```

The tracked `.env.example` file should remain available as the canonical example configuration.

---

## Current Configuration Responsibilities

| File                | Responsibility                                                           |
| ------------------- | ------------------------------------------------------------------------ |
| `.env.example`      | Documents required frontend runtime variables                            |
| `.env`              | Developer-specific local runtime values                                  |
| `.gitignore`        | Prevents local environment configuration from being committed            |
| `src/vite-env.d.ts` | Defines the TypeScript contract for supported Vite environment variables |
| `src/config/env.ts` | Reads, validates, and exposes application runtime configuration          |
| `src/main.tsx`      | Participates in application startup and runtime configuration validation |

---

## Scope Boundary

TA-34 establishes the frontend runtime configuration and validation layer.

It does not configure:

- Axios behavior
- HTTP interceptors
- Authentication tokens
- API error normalization
- Production Vercel environment variables
- Secret management

Shared Axios configuration is handled separately by TA-35.

---

## Related Documentation

- [Runtime Configuration](./runtime-configuration.md)
- [Project Structure](../architecture/project-structure.md)
- [Application Providers](../architecture/application-providers.md)
- [Server State and TanStack Query](../architecture/server-state.md)

---

## Development Checklist

Before beginning development:

- [ ] Node.js 22+ is installed.
- [ ] npm 10+ is installed.
- [ ] Dependencies are installed.
- [ ] Local `.env` exists.
- [ ] Required runtime variables are configured.
- [ ] No secrets are stored in frontend environment variables.
- [ ] Development server starts successfully.

Before submitting changes:

- [ ] `npm run format` passes.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Application startup is manually validated.
- [ ] Relevant routes are manually validated.
- [ ] Local `.env` is not included in Git changes.
