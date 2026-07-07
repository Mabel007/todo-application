# Development Workflow

---

## Document Information

**Category:** Development

**Related Ticket:** TA-8 Create Project Documentation and Verify Foundation Setup

**Epic:** TA-1 Project Foundation

**Status:** Complete

---

## Jira Workflow

```text
Backlog
↓
Selected for Development
↓
In Progress
↓
Code Review
↓
QA Testing
↓
Ready for Release
↓
Done
```

---

## Git Workflow

```text
main
↑
dev
↑
feature/*
```

---

## Development Process

1. Create Jira ticket.
2. Create feature branch.
3. Implement ticket.
4. Run lint.
5. Run format.
6. Run build.
7. Manual testing.
8. Open Pull Request.
9. Resolve CodeRabbit comments.
10. Merge into dev.
