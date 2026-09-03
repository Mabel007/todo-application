# Todo API Postman Guide

## Document Information

| Field          | Value                                                      |
| -------------- | ---------------------------------------------------------- |
| Category       | Project Documentation                                      |
| Related Story  | TA-203 Reconcile Postman assets with verified API contract |
| Status         | Active                                                     |
| Release Target | v0.3.1                                                     |
| Last Updated   | September 2026                                             |

## Purpose

The permanent Postman assets provide a runnable verified success flow and a focused negative/error regression subset. Canonical scenario definitions remain in `docs/testing/manual-api-test-cases.md`; Postman request descriptions carry concise `API-xxx` traceability.

Historical v0.2.0 manual validation, the August 2026 API Error Contract Discovery Audit, and this TA-203 maintenance reconciliation are separate evidence timelines.

## Import and configuration

Import:

- `postman/todo-application.postman_collection.json`
- `postman/todo-application.postman_environment.json`

Select **Todo App - Local**. The canonical environment variables are:

| Variable       | Purpose                                        | Exported value                |
| -------------- | ---------------------------------------------- | ----------------------------- |
| `baseURL`      | Todo API origin                                | `https://api.oluwasetemi.dev` |
| `accessToken`  | Bearer token for protected requests            | Empty                         |
| `refreshToken` | Token consumed by `/auth/refresh`              | Empty                         |
| `taskId`       | ID captured from successful task creation      | Empty                         |
| `userId`       | ID captured from registration/login            | Empty                         |
| `parentId`     | Optional parent task ID for manual exploration | Empty                         |

Do not add `baseUrl` or `bearerToken` aliases. Do not export runtime tokens, passwords, authorization headers, or personal data.

## Automated wiring

Run the collection in order:

1. Primary registration generates a unique synthetic identity, clears stale auth/task values, and captures top-level `accessToken`, `refreshToken`, and `user.id`.
2. Login and refresh assert and replace the same canonical token variables.
3. Protected requests use Postman Bearer Auth with `{{accessToken}}`.
4. Task creation expects HTTP 200, asserts a top-level task object, and stores `response.id` as `taskId`.
5. Later task requests consume `{{taskId}}`.
6. A second synthetic user supports repeatable cross-user 403 checks; cleanup restores the primary identity and deletes its task.

Setup assertions fail clearly when required response values are absent, preventing stale-state false positives.

## Negative/error regression

The maintained subset covers API-100, API-101, API-103, API-104, API-105, API-110, API-111, API-401, and API-402. It targets stable status and response-family behavior without duplicating the full manual repository.

HTTP 422 checks are scenario-specific. Structured Zod validation scenarios assert `success: false`, `error.name`, and `error.issues`; the audit's message-based password-validation family is not treated as having that shape.

Expired access token coverage remains **NOT EXECUTED** because no safely reproducible expired token is available. Missing, malformed, and invalid token behavior is not used as a substitute.

## Newman

The repository does not pin Newman or expose a package script. The supported maintenance command uses the existing documented `npx newman` convention without changing application dependencies:

```powershell
npx --yes newman run postman/todo-application.postman_collection.json -e postman/todo-application.postman_environment.json
```

Only synthetic QA identities and tasks may be used. Review console output before sharing it because runtime values are held in memory during execution.

## Evidence

- Historical validation: `docs/testing/manual-api-validation.md`
- Canonical cases: `docs/testing/manual-api-test-cases.md`
- August discovery evidence: `postman/reports/api-error-contract-audit.md` and `.json`
- TA-203 maintenance evidence: `postman/reports/ta-203-postman-reconciliation.md`
