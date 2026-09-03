# TA-203 Postman Reconciliation Evidence

## Metadata

| Field          | Value                                  |
| -------------- | -------------------------------------- |
| Jira           | TA-203                                 |
| Purpose        | Postman API contract reconciliation    |
| Release target | v0.3.1                                 |
| Execution date | 2026-09-03                             |
| Branch         | `test/TA-203-reconcile-postman-assets` |

## Reconciliation inventory

- Replaced collection `baseUrl` references with the environment's canonical `baseURL`; removed the collection-level stale alias.
- Replaced undefined `bearerToken` usage with Bearer Auth backed by `accessToken` on every protected request.
- Reconciled registration, login, refresh, and current-user scripts with verified top-level response fields.
- Reconciled task create/get/update scripts with top-level task objects.
- Changed `POST /tasks` success expectation from HTTP 201 to verified HTTP 200 and captured `response.id` into `taskId`.
- Replaced literal `:id` paths with `{{taskId}}` consumers where the success flow requires the created task.
- Added minimal stale-state clearing before primary auth and task setup requests.
- Replaced silent setup extraction with assertions that require non-empty tokens and identifiers.
- Added a focused permanent negative/error subset with API-ID descriptions and scenario-specific 422 assertions.
- Retained the canonical six-key environment vocabulary: `baseURL`, `accessToken`, `refreshToken`, `taskId`, `userId`, `parentId`.

## Negative/error scenario evaluation

| API ID       | Scenario                            | Verified Status | Permanent Postman? | Reason                                                                                              |
| ------------ | ----------------------------------- | --------------: | ------------------ | --------------------------------------------------------------------------------------------------- |
| API-100      | Login incorrect password            |             401 | Yes                | High-value authentication regression.                                                               |
| Not assigned | Login unregistered email            |             401 | No                 | Same stable response family as API-100; avoids duplication.                                         |
| API-104      | Duplicate registration email        |             409 | Yes                | Stable conflict contract and reuses synthetic primary setup.                                        |
| API-105      | Register missing required fields    |             422 | Yes                | Canonical structured registration validation case.                                                  |
| API-300      | Register invalid email              |             422 | No                 | Covered canonically by manual validation; redundant response family.                                |
| Not assigned | Register invalid password           |             422 | No                 | Message-based 422 retained in audit evidence; omitted to avoid brittle password-message assertions. |
| API-101      | Protected endpoint missing token    |             401 | Yes                | Core bearer-auth contract.                                                                          |
| Not assigned | Protected endpoint invalid token    |             401 | No                 | Avoids maintaining a token-like literal; missing-token case covers the canonical requirement.       |
| Not assigned | Malformed Authorization header      |             401 | No                 | Duplicate auth-family coverage without a canonical case ID.                                         |
| Not assigned | Invalid refresh token               |             401 | No                 | Valid refresh wiring is maintained; invalid-token literal adds limited regression value.            |
| API-103      | Create task missing required fields |             422 | Yes                | Core task validation contract.                                                                      |
| API-302      | Create task invalid status          |             422 | No                 | Canonical manual case; same structured task-validation family as API-103.                           |
| API-301      | Create task invalid priority        |             422 | No                 | Canonical manual case; same structured task-validation family as API-103.                           |
| API-303      | Create task invalid field types     |             422 | No                 | Broad manual case would duplicate multiple field assertions.                                        |
| API-110      | Get task malformed UUID             |             422 | Yes                | Distinct path-parameter validation contract.                                                        |
| API-111      | Get valid nonexistent task UUID     |             404 | Yes                | Distinguishes valid absent identifiers from malformed UUIDs.                                        |
| Not assigned | Update nonexistent task             |             404 | No                 | Same stable not-found family as API-111.                                                            |
| Not assigned | Delete nonexistent task             |             404 | No                 | Same stable not-found family as API-111.                                                            |
| API-401      | Update another user's task          |             403 | Yes                | High-value ownership boundary; repeatable with synthetic dual-user setup.                           |
| API-402      | Delete another user's task          |             403 | Yes                | High-value destructive ownership boundary; repeatable with synthetic dual-user setup.               |
| Not assigned | Unauthenticated task update         |             401 | No                 | Missing bearer behavior is represented by API-101.                                                  |
| Not assigned | Unauthenticated tasks/me            |             401 | No                 | Missing bearer behavior is represented by API-101.                                                  |
| Not assigned | Invalid pagination page             |             422 | No                 | Lower-value query validation retained in audit/manual coverage.                                     |
| Not assigned | Invalid pagination limit            |             422 | No                 | Lower-value query validation retained in audit/manual coverage.                                     |
| Not assigned | Invalid status filter               |             422 | No                 | Overlaps API-302 enum validation family.                                                            |
| Not assigned | Invalid priority filter             |             422 | No                 | Overlaps API-301 enum validation family.                                                            |
| Not assigned | Invalid sort value                  |             422 | No                 | Lower-value query validation retained in audit/manual coverage.                                     |

## Newman results

Command:

```powershell
npx --yes newman run postman/todo-application.postman_collection.json -e postman/todo-application.postman_environment.json --reporters cli --color off
```

| Metric             | Executed | Failed |
| ------------------ | -------: | -----: |
| Iterations         |        1 |      0 |
| Requests           |       21 |      0 |
| Test scripts       |       42 |      0 |
| Prerequest scripts |        3 |      0 |
| Assertions         |       67 |      0 |

- Total duration: 15.6 seconds.
- Failed scripts: 0.
- Failed assertions: 0.
- Synthetic task cleanup: passed with HTTP 204.
- Newman was invoked through `npx --yes`; no dependency or package-script change was necessary.

## Coverage gap

Expired access token remains **NOT EXECUTED**.

Reason: no safely reproducible expired token available. Missing, malformed, and invalid tokens were not treated as substitutes, and no exact expired-token response was inferred.

## Security review

The maintained collection and this evidence use runtime-generated `ta203.qa.<unique>@example.test` identities. Exported environment token and identifier values remain empty. Evidence was checked for access tokens, refresh tokens, Authorization values, reusable passwords, credentials, and private user data; none are retained.

## Evidence timeline

- `docs/testing/manual-api-validation.md` remains historical original validation evidence.
- `postman/reports/api-error-contract-audit.md` and `.json` remain unchanged August 2026 discovery evidence.
- This file records only TA-203 v0.3.1 maintenance reconciliation and its 2026-09-03 execution.
