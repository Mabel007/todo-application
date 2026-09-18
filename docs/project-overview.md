# Project Overview

## Document information

| Field         | Value                                                                         |
| ------------- | ----------------------------------------------------------------------------- |
| Category      | Project Documentation                                                         |
| Related epics | TA-1 Project Foundation; TA-2 API Investigation; TA-20 Application Foundation |
| Status        | Active                                                                        |
| Version       | v0.3.1 (Foundation Hardening & QA Maintenance - released 2026-09-04)          |
| Last updated  | September 2026                                                                |

## Overview

Todo Application is a React and TypeScript task-management application and portfolio project. Work is delivered incrementally through Jira, documented in the repository and Confluence, validated through GitHub Actions and manual QA, and prepared for later Vercel deployment.

## Current technology

- React 19, TypeScript, and Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS v4 and shadcn/ui
- ESLint, Prettier, Husky, and lint-staged
- Postman assets and manual API testing
- GitHub Actions for install, lint, and build validation

React Testing Library, Vitest, and Playwright are planned; the repository does not currently expose an automated application test script. React Hook Form and Zod are future feature dependencies and are not installed in the current foundation.

## Current state

| Milestone                                                   | Status                                |
| ----------------------------------------------------------- | ------------------------------------- |
| Project Foundation                                          | Completed                             |
| API Investigation and Manual Testing                        | Completed                             |
| Application Foundation (TA-20 / Epic 3)                     | Implemented; final TA-41 validation   |
| Task Management Core read experience (TA-42 to TA-53)       | Implemented in unreleased v0.4.0 work |
| Authentication, CRUD, automation, and production deployment | Future roadmap work                   |

The Application Foundation provides centralized client-side routing, a shared application layout and provider composition, one shared TanStack Query client, validated runtime configuration, a shared Axios client, shared API contracts, centralized API error normalization, an application Error Boundary, wildcard 404 handling, and the Task Management Core list/detail pages with URL-backed collection state.

It intentionally does not provide task CRUD, authentication, protected routes, token management, or production deployment configuration.

## Release status

`v0.3.0` is the released Application Foundation milestone. Epic 3 implementation, TA-41 validation, dev-to-main integration, post-merge validation, Git tagging, GitHub Release publication, Vercel Production deployment, and final repository/Jira/Confluence reconciliation were completed on 2026-09-02.

`v0.3.1` is the released Foundation Hardening & QA Maintenance milestone. It was released on 2026-09-04 and contains:

- TA-203 - Reconcile Postman assets with verified API contract.
- TA-204 - Establish Centralized Application Logging Foundation.

The maintenance scope strengthens the existing Application Foundation. The current working tree also contains unreleased v0.4.0 Task Management Core work: read-only list/detail views, pagination, search, filters, sorting, URL state, and controlled collection/detail states. TA-203 reconciles the permanent Postman collection, environment, execution scripts, API test documentation, and maintenance evidence with the verified API contract. TA-204 establishes centralized structured application logging, sanitization, environment-aware output, Axios diagnostics, and Error Boundary logging.

Task CRUD, authentication, protected routes, frontend QA automation infrastructure, PWA work, and broader production-readiness remain future-roadmap scope. The package version remains v0.3.1 until release preparation.

Completed release records remain available in:

- `docs/releases/v0.1.0.md`
- `docs/releases/v0.2.0.md`
- `docs/releases/v0.3.0.md`
- `docs/releases/v0.3.1.md` - Foundation Hardening & QA Maintenance release record

## Documentation map

- `docs/architecture/` — application structure and foundation decisions
- `docs/development/` — local setup, workflow, dependencies, and runtime configuration
- `docs/api/` and `postman/` — Epic 2 API investigation and manual-testing assets
- `docs/design-system/` — current visual foundation
- `docs/deployment/` — existing high-level deployment direction; production implementation is future scope
- `docs/releases/` — published historical release records
- `docs/testing/` — manual API validation records

The root `README.md` is the repository entry point. Detailed architecture remains in the topic-specific documents rather than being duplicated here.
