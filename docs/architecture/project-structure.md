# Project Structure

---

## Document Information

**Category:** Architecture

**Related Ticket:** TA-8 Create Project Documentation and Verify Foundation Setup

**Epic:** TA-1 Project Foundation

**Status:** Complete

---

## Source Structure

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

### `src/types`

Contains reusable TypeScript contracts shared across application layers.

Current shared infrastructure types include:

```text
src/types/
└── api.ts
```

---

## Design Principles

- Separation of concerns
- Scalability
- Maintainability
- Reusability
- Accessibility
