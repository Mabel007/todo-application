# Todo Application

A React and TypeScript task-management application. v0.4.0 Task Management Core is the current released version, following the v0.3.1 Foundation Hardening and QA Maintenance release. Task CRUD and authentication remain future work.

## Stack

- React 19, TypeScript, and Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS v4 and shadcn/ui
- ESLint, Prettier, Husky, and lint-staged

## Getting started

Prerequisites: Node.js 22+ and npm 10+.

```bash
git clone https://github.com/Mabel007/todo-application.git
cd todo-application
npm install
```

Copy `.env.example` to `.env` and provide the required public API base URL:

```env
VITE_API_BASE_URL=https://example.com
```

`VITE_API_BASE_URL` must be a valid HTTP or HTTPS URL. Vite exposes `VITE_` variables to browser code, so do not put secrets in them.

Start the development server with `npm run dev`. Vite normally serves the application at `http://localhost:5173`.

## Commands

| Command                | Purpose                                  |
| ---------------------- | ---------------------------------------- |
| `npm run dev`          | Start the Vite development server        |
| `npm run build`        | Type-check and create a production build |
| `npm run preview`      | Preview the production build locally     |
| `npm run lint`         | Run ESLint                               |
| `npm run lint:fix`     | Apply ESLint fixes                       |
| `npm run format`       | Format supported repository files        |
| `npm run format:check` | Verify formatting without writing files  |

There is no permanent automated application test suite yet. The current repository gates are lint, formatting, TypeScript/build, and targeted manual validation. The TA-53 manual integrated regression record contains 92 cases; the current reconciliation records most as PASS, with MR-009 fixed pending retest and MR-052, MR-057, and MR-075 still requiring manual confirmation.

## Application foundation

The current routes are:

- `/` — Home foundation page
- /tasks — read-only Task Management Core: Task collection and detail retrieval, pagination, debounced search, status and priority filtering, sorting, URL-synchronized state, loading, empty, no-results, normalized retrieval errors, retry/recovery, Task-specific not-found handling, and generic route 404 separation
- `*` — Not-found experience with recovery navigation

`src/main.tsx` owns the single `RouterProvider` and composes it inside `AppProviders`. The shared `QueryClient` is created once in `src/lib/queryClient.ts`. Route configuration is centralized in `src/routes`, with `AppLayout` rendering child pages through `Outlet`. The route tree is wrapped by the application Error Boundary.

Runtime configuration is read and validated through `src/config/env.ts`. The shared Axios client consumes that validated configuration. Shared API response contracts live in `src/types/api.ts`, while `src/api/errors.ts` converts Axios and API failures into the application error union in `src/types/errors.ts`.

## Project structure

```text
.github/             CI workflow and pull-request template
docs/                Architecture, development, API, design, release, and testing docs
postman/             API investigation assets
src/
  api/               Shared Axios client and error normalization
  assets/            Brand and application assets
  components/        Shared, layout, and UI components
  config/            Validated runtime configuration
  layouts/           Shared routed layout
  lib/               Shared infrastructure and utilities
  pages/             Current foundation pages
  providers/         Global provider composition
  routes/            Route paths, configuration, and router creation
  styles/            Global style layers and design tokens
  types/             Shared API and application error contracts
```

Detailed documentation is under `docs/`, including the canonical architecture documents for routing, providers, layout, server state, runtime configuration, API infrastructure, error handling, and not-found behavior.

## Development workflow

Before review, run:

```bash
npm run format
npm run lint
npm run build
```

The pre-commit hook runs lint-staged against staged supported files. Do not commit a local `.env` file.

## Release status

v0.4.0 Task Management Core was released on 2026-09-18 through the main branch release workflow.

`v0.3.0` / Epic 3 / TA-20 Application Foundation was released on 2026-09-02.

The v0.3.1 release contained TA-203 and TA-204 and remains the previous Foundation Hardening and QA Maintenance release. v0.4.0 now contains the completed Epic 4 Task Management Core work from TA-42 through TA-53.

Task CRUD, authentication, protected routes, frontend QA automation infrastructure, PWA work, and broader production-readiness work remain future scope beyond the current read-only Task Management Core.

## License

This project is licensed under the MIT License.

## Author

Christiana Mabel Nyuma — Frontend Developer and QA Analyst

- [GitHub](https://github.com/Mabel007)
- [LinkedIn](https://www.linkedin.com/in/christiana-mabel-nyuma/)
