# Deployment Guide

---

## Document Information

**Category:** Deployment

**Related Ticket:** TA-8 Create Project Documentation and Verify Foundation Setup

**Epic:** TA-1 Project Foundation

**Status:** Complete

---

## Continuous Integration

GitHub Actions validates every push and pull request.

Workflow:

- Install dependencies
- Run ESLint
- Build application

---

## Production

Deployment target:

```text
Vercel
```

Production branch:

```text
main
```

Development branch:

```text
dev
```
