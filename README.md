# Todo Application

A React and TypeScript task-management application. Release `v0.3.0` established the application foundation: routing, shared layouts and providers, server-state infrastructure, validated runtime configuration, API infrastructure, shared contracts, and controlled error experiences. The `v0.3.1` maintenance release hardens that foundation through verified Postman/API contract reconciliation and centralized application logging. Task CRUD and authentication remain future work.

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

There is no automated application test suite yet. The current repository gates are lint, formatting, TypeScript/build, and targeted manual validation. GitHub Actions runs `npm ci`, lint, and build for pushes and pull requests to `dev` and `main`.

## Application foundation

The current routes are:

- `/` — Home foundation page
- `/tasks` — Tasks foundation placeholder; no CRUD behavior yet
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

`v0.3.0` / Epic 3 / TA-20 Application Foundation was released on 2026-09-02.

`v0.3.1` / Foundation Hardening & QA Maintenance was released on 2026-09-04. The release contains TA-203 and TA-204, reconciling the permanent Postman assets with the verified API contract and establishing the centralized application logging foundation required before Task Management Core development begins.

Task CRUD, authentication, protected routes, feature-specific business state, frontend QA automation infrastructure, and broader production-readiness work remain outside this maintenance release.

## License

This project is licensed under the MIT License.

## Author

Christiana Mabel Nyuma — Frontend Developer and QA Analyst

- [GitHub](https://github.com/Mabel007)
- [LinkedIn](https://www.linkedin.com/in/christiana-mabel-nyuma/)
