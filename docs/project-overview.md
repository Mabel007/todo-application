# Project Overview

---

## Document Information

| Field             | Value                                                           |
| ----------------- | --------------------------------------------------------------- |
| **Category**      | Project Documentation                                           |
| **Related Epic**  | TA-1 – Project Foundation                                       |
| **Related Story** | TA-8 – Create Project Documentation and Verify Foundation Setup |
| **Status**        | Active                                                          |
| **Version**       | v0.2.0                                                          |
| **Last Updated**  | July 2026                                                       |

---

# Overview

Todo Application is a modern task management application built with React, TypeScript, Vite, Tailwind CSS, and ShadCN/UI.

The project serves as both an AltSchool Frontend Engineering capstone project and a professional portfolio demonstrating modern frontend engineering, quality assurance, API investigation, documentation, and CI/CD best practices.

Development follows an industry-standard software development lifecycle using GitHub, Jira, Confluence, GitHub Actions, Postman, and Vercel. Each epic delivers a complete, documented milestone that progressively expands the application's functionality while maintaining code quality and testing standards.

---

# Project Objectives

The project aims to:

- Build a scalable and maintainable frontend architecture.
- Implement modern React development best practices.
- Demonstrate structured API investigation and QA workflows.
- Produce comprehensive technical and project documentation.
- Establish a reusable testing strategy for manual and automated testing.
- Showcase a production-ready portfolio project.

---

# Technology Stack

## Frontend

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- ShadCN/UI

---

## Data Fetching

- Axios
- TanStack Query

---

## Forms & Validation

- React Hook Form
- Zod

---

## Development Tools

- ESLint
- Prettier
- Husky
- lint-staged
- CodeRabbit

---

## Testing

- Postman
- Newman
- Manual API Testing
- React Testing Library _(planned)_
- Vitest _(planned)_
- Playwright _(planned)_

---

## CI/CD

- GitHub Actions
- Vercel

---

# Documentation Structure

```text
docs/
├── api/
│   ├── task-api-reference.md
│   ├── authentication.md
│   └── postman-guide.md
│
├── architecture/
│   └── project-structure.md
│
├── deployment/
│   └── deployment-guide.md
│
├── design-system/
│   ├── application-theme.md
│   ├── colors.md
│   ├── design-tokens.md
│   ├── icons.md
│   └── typography.md
│
├── development/
│   ├── contribution-guidelines.md
│   ├── development-workflow.md
│   └── environment-setup.md
│
├── testing/
│   ├── api-test-cases.md
│   ├── manual-api-validation.md
│   └── manual-test-cases.md
│
├── project-overview.md
│
├── releases/
│   ├── v0.1.0.md
│   └── v0.2.0.md
│
postman/
├──todo-applicatiom.postman_collection.json
├── todo-application.postman_environment.json
└── README.md
```

---

# Project Roadmap

| Epic                                       | Status    |
| ------------------------------------------ | --------- |
| TA-1 Project Foundation                    | Completed |
| TA-2 API Investigation & Manual Testing    | Completed |
| TA-3 Application Foundation                | Planned   |
| TA-4 Task Management Core                  | Planned   |
| TA-5 Task Experience & CRUD                | Planned   |
| TA-6 Authentication                        | Planned   |
| TA-7 UI Components & Design System         | Planned   |
| TA-8 Accessibility & User Experience       | Planned   |
| TA-9 QA Automation                         | Planned   |
| TA-10 Deployment & Production Readiness    | Planned   |
| TA-11 Documentation & Portfolio Completion | Planned   |

---

# Current Project Status

## Epic 1 — Project Foundation

**Status:** Completed

### Key Deliverables

- React + TypeScript + Vite project initialized
- Tailwind CSS configured
- ShadCN/UI configured
- Development tooling established
- Code quality standards configured
- Git workflow established
- CI/CD pipeline configured
- Initial documentation completed

---

## Epic 2 — API Investigation & Manual Testing

**Status:** Completed

This epic established the QA baseline for frontend development through API investigation, manual validation, reusable Postman assets, and technical documentation.

### Deliverables

- API Reference
- Authentication Documentation
- API Investigation Findings & QA Baseline
- API Validation Report
- API Test Cases
- API Test Case Repository
- Postman Collection
- Postman Environment

---

## Epic Readiness Summary

| Requirement                    | Status   |
| ------------------------------ | -------- |
| API endpoints reviewed         | Complete |
| Authentication investigated    | Complete |
| CRUD operations validated      | Complete |
| Pagination validated           | Complete |
| Search validated               | Complete |
| Filtering validated            | Complete |
| Error handling validated       | Complete |
| Postman collection completed   | Complete |
| Postman environment configured | Complete |
| QA baseline established        | Complete |
| Documentation completed        | Complete |
| No blocking issues identified  | Complete |

---

# Current Release

**Current Version:** v0.2.0

Completed releases:

- v0.1.0 — Project Foundation
- v0.2.0 — API Investigation & Manual Testing

The project has completed its technical foundation and API investigation.

The application is ready to begin frontend implementation in Epic 3.

---

# Related Documentation

## API Documentation

- API Reference
- Authentication
- API Investigation Findings & QA Baseline
- API Validation Report
- API Test Cases
- API Test Case Repository
- Postman Collection
- Postman Environment

---

## Development Documentation

- Development Workflow
- Environment Setup
- Frontend Architecture
- Folder Structure
- Deployment Guide

---

## Release Documentation

- Release v0.1.0
- Release v0.2.0
