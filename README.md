# Todo Application

A modern task management application built with **React**, **TypeScript**, **Vite**, **Tailwind CSS v4**, and **ShadCN/UI**.

This project serves as both an **AltSchool Frontend Engineering Project** and a **professional portfolio** demonstrating modern frontend engineering, quality assurance, documentation, accessibility, and deployment best practices.

---

## 📖 Project Overview

Todo Application is designed using a scalable, maintainable, and production-ready architecture that supports future feature development, testing, and deployment.

The project emphasizes:

- Scalable Frontend Architecture
- Modern UI/UX
- Accessibility (WCAG 2.1 AA)
- Performance
- Maintainability
- Code Quality
- Responsive Design
- Developer Experience

Development follows an industry-standard workflow using:

- Jira
- Confluence
- GitHub
- GitHub Actions
- CodeRabbit
- Vercel

---

## 🚀 Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS v4
- ShadCN/UI

### Application Foundation

- React Router - Client-side routing and route composition
- TanStack Query - Server-state management and caching
- Axios - REST API communication

### Design System

The application uses a centralized design system built on:

- Sora Variable (Headings)
- Inter Variable (Body)
- CSS Custom Properties (Design Tokens)
- Lucide React
- Tailwind CSS v4
- Mobile-first Responsive Design

### Code Quality

- ESLint
- Prettier
- Husky
- lint-staged
- CodeRabbit

### CI/CD

- GitHub Actions
- Vercel

### Testing

- Manual Testing
- Playwright _(Planned)_
- React Testing Library _(Planned)_
- Vitest _(Planned)_

### Project Management

- Jira
- Confluence

---

## 📦 Getting Started

### Prerequisites

- Node.js 22+
- npm 10+

### Clone Repository

```bash
git clone https://github.com/Mabel007/todo-application.git

cd todo-application
```

### Install Dependencies

```bash
npm install
```

### Start Development Server

```bash
npm run dev
```

Application URL

```text
http://localhost:5173
```

### Build Application

```bash
npm run build
```

---

## 📜 Available Scripts

| Command                | Description                      |
| ---------------------- | -------------------------------- |
| `npm run dev`          | Start the development server     |
| `npm run build`        | Build the application            |
| `npm run lint`         | Run ESLint                       |
| `npm run lint:fix`     | Automatically fix linting issues |
| `npm run format`       | Format project files             |
| `npm run format:check` | Verify formatting                |

---

## 🎨 Design System

The application's branding foundation is centralized and reusable.

### Typography

- Sora Variable
- Inter Variable

### Color System

- Navy Brand Primary
- Teal Brand Accent
- Semantic Design Tokens
- Light & Dark Theme Support

### Icons

- Lucide React
- SVG Brand Assets

### Branding

- Application Logo
- Horizontal Logo
- Logo Icon
- Application Icons
- Browser Favicon

---

## 📚 Documentation

Project documentation is organized under the **docs/** directory.

### Project

- Project Overview

### Architecture

### Architecture

- Project Structure
- Application Routing
- Application Layout

### Development

- Environment Setup
- Development Workflow
- Contribution Guidelines
- Runtime Dependencies

### Deployment

- Deployment Guide

### Design System

- Application Theme
- Typography
- Color System
- Design Tokens
- Icons

---

## 📂 Project Structure

docs/
├── api/
├── architecture/
├── deployment/
├── design-system/
├── development/
├── releases/
└── testing/

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

public/
.github/

The application follows a modular architecture that separates documentation, application source code, assets, configuration, and workflows.

---

## 🔄 Continuous Integration

GitHub Actions automatically:

- Installs dependencies
- Runs ESLint
- Builds the application

Every Pull Request must successfully complete the CI pipeline before being merged.

---

## ✅ Definition of Done

A Jira ticket is complete only when:

- Acceptance Criteria satisfied
- ESLint passes
- Formatting passes
- Production build succeeds
- Manual testing completed
- CodeRabbit review resolved
- Pull Request approved
- Branch merged into `dev`
- Jira updated
- Documentation updated where applicable

---

## 📄 License

This project is licensed under the **MIT License**.

---

## 👩‍💻 Author

**Christiana Mabel Nyuma**

Frontend Developer & QA Analyst

GitHub

https://github.com/Mabel007

LinkedIn

https://www.linkedin.com/in/christiana-mabel-nyuma/
