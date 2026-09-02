# Project Structure

## Document information

| Field           | Value                                                               |
| --------------- | ------------------------------------------------------------------- |
| Category        | Architecture                                                        |
| Related tickets | TA-8 Project Foundation; TA-29 through TA-40 Application Foundation |
| Epic            | TA-1 Project Foundation / TA-20 Application Foundation              |
| Release         | v0.3.0                                                              |
| Status          | Complete                                                            |

## Tracked source structure

```text
src/
├── api/
├── assets/
├── components/
├── config/
├── layouts/
├── lib/
├── pages/
├── providers/
├── routes/
├── styles/
└── types/
```

| Directory    | Responsibility                                          |
| ------------ | ------------------------------------------------------- |
| `api`        | Shared Axios client and API error normalization         |
| `assets`     | Brand logos and application icons                       |
| `components` | Shared, layout, and reusable UI components              |
| `config`     | Validated application runtime configuration             |
| `layouts`    | Shared routed application layout                        |
| `lib`        | Shared QueryClient and utility infrastructure           |
| `pages`      | Home, Tasks foundation, and not-found pages             |
| `providers`  | Global application provider composition                 |
| `routes`     | Central paths, route configuration, and router creation |
| `styles`     | Global CSS layers, theme, tokens, and utilities         |
| `types`      | Shared API response and application error contracts     |

Feature-specific folders should be introduced only by the Epic that implements those features. Empty local scaffolding directories are not part of the tracked repository architecture.

## Shared types

```text
src/types/
├── api.ts
└── errors.ts
```

`api.ts` owns reusable API response, pagination, and validation-issue contracts. `errors.ts` owns the discriminated application error contract consumed by centralized normalization.

## Design principles

- Separate infrastructure, presentation, and future feature concerns.
- Centralize cross-application ownership such as routing, configuration, providers, and API contracts.
- Add feature structure only when its approved scope is implemented.
- Keep accessibility and responsive behavior in the shared application foundation.
