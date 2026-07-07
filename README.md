# Todo Application

A modern task management application built with React, TypeScript, and Vite.

## Tech Stack

- React 19
- TypeScript
- Vite

## Prerequisites

- Node.js 22+
- npm 10+

## Getting Started

### Install dependencies

npm install

### Start development server

npm run dev

### Build for production

npm run build

## Project Structure

src/
public/

## Scripts

npm run dev
npm run build
npm run preview

## Branch Strategy

main
dev
feature/*
bugfix/*
docs/*
test/*

## Jira

Project Key: TA

## License

MIT

## Styling

This project uses Tailwind CSS v4 for utility-first styling.

Global styles are located in:

```
src/index.css
```

## UI Component Library

This project uses ShadCN/UI as its component library.

### Generate a Component

```bash
npx shadcn@latest add button
```

Components are generated into:

```text
src/components/ui
```

## Code Quality

This project enforces code quality using:

- ESLint
- Prettier
- Husky
- lint-staged
- CodeRabbit

### Available Scripts

npm run lint

npm run lint:fix

npm run format

npm run format:check

## Project Structure

```text
src/
├── api/
├── assets/
├── components/
├── constants/
├── context/
├── data/
├── hooks/
├── layouts/
├── lib/
├── pages/
├── providers/
├── routes/
├── services/
├── styles/
├── types/
└── utils/
```

The project follows a feature-ready architecture that promotes scalability, maintainability, and separation of concerns.

## Folder responsibilities

| Folder       | Purpose                                                                   |
| ------------ | ------------------------------------------------------------------------- |
| `api`        | API client configuration (Axios, interceptors, endpoints)                 |
| `assets`     | Fonts, icons, images and static resources                                 |
| `components` | Reusable UI components                                                    |
| `constants`  | Application constants, enums and configuration values                     |
| `context`    | React Context providers                                                   |
| `data`       | Static mock data and seed data                                            |
| `hooks`      | Custom React hooks                                                        |
| `layouts`    | Shared application layouts                                                |
| `lib`        | Third-party utilities and shared helpers (for example `cn()` from ShadCN) |
| `pages`      | Route-level page components                                               |
| `providers`  | Global application providers (QueryClient, Theme, etc.)                   |
| `routes`     | Route definitions and route guards                                        |
| `services`   | Business logic and API services                                           |
| `styles`     | Global CSS, theme overrides and future design tokens                      |
| `types`      | Shared TypeScript interfaces and types                                    |
| `utils`      | Generic utility/helper functions                                          |

## Continuous Integration

This project uses GitHub Actions to automate quality checks for every push and pull request.

### Workflow

The CI pipeline performs the following tasks:

- Installs project dependencies
- Runs ESLint
- Builds the application

The workflow is located at:

```text
.github/workflows/ci.yml
```
