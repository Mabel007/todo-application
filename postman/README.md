# Todo Application Postman Assets

This directory contains the reusable Postman collection and sanitized environment used for manual API testing and focused Newman regression checks.

## Files

- `todo-application.postman_collection.json` — verified success flow plus a focused negative/error regression subset
- `todo-application.postman_environment.json` — canonical variable keys with no runtime secrets
- `reports/api-error-contract-audit.*` — historical August 2026 discovery evidence (local evidence convention)
- `reports/ta-203-postman-reconciliation.md` — TA-203 v0.3.1 maintenance evidence

## Variable contract

The environment vocabulary is `baseURL`, `accessToken`, `refreshToken`, `taskId`, `userId`, and `parentId`. Runtime tokens and identifiers are generated and wired by setup requests; exported values remain empty except for the public API base URL.

## Run

```powershell
npx --yes newman run postman/todo-application.postman_collection.json -e postman/todo-application.postman_environment.json
```

The collection generates disposable `ta203.qa.<unique>@example.test` identities and task data. Do not replace these with personal credentials.

See `docs/api/postman-guide.md` for workflow, traceability, and coverage details.
