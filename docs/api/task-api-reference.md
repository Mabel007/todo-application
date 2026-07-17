# TA - API Reference

---

## Document Information

| Field             | Value                                     |
| ----------------- | ----------------------------------------- |
| **Category**      | Project Documentation                     |
| **Related Epic**  | TA-2 – API Investigation & Manual Testing |
| **Related Story** | TA-10 – Review Task API Documentation     |
| **Status**        | Active                                    |
| **Version**       | v0.1.0                                    |
| **Last Updated**  | July 2026                                 |

---

# Overview

This document provides the technical reference for the Todo Application API.

It documents the available endpoints, authentication requirements, request and response formats, validation rules, query parameters, supported HTTP status codes, API capabilities, constraints, and implementation considerations identified during the API investigation.

The API serves as the primary backend interface for frontend task management functionality.

---

# API Environment

## Base URL

```text
https://api.oluwasetemi.dev
```

## Official Documentation

```text
https://api.oluwasetemi.dev/reference#main-api
```

---

# Authentication

## Authentication Model

The API supports both public and authenticated endpoints.

- Public endpoints are accessible without authentication.
- Protected endpoints require a valid JWT bearer token.
- Owner-only endpoints can only be accessed by the resource owner.

### Endpoint Authentication Matrix

| Endpoint                 | Authentication | Notes                         |
| ------------------------ | -------------- | ----------------------------- |
| GET /tasks               | Not Required   | Public tasks                  |
| GET /tasks/me            | JWT Required   | Current authenticated user    |
| POST /tasks              | Optional       | Creates public or owned tasks |
| GET /tasks/{id}          | Not Required   | Public task details           |
| PATCH /tasks/{id}        | JWT Required   | Owner only                    |
| DELETE /tasks/{id}       | JWT Required   | Owner only                    |
| GET /tasks/{id}/children | Not Required   | Child tasks                   |

---

# Data Model

## Task Object

```json
{
  "id": "string",
  "name": "string",
  "description": "string | null",
  "start": "string | null",
  "end": "string | null",
  "duration": "number | null",
  "priority": "LOW | MEDIUM | HIGH",
  "status": "TODO | IN_PROGRESS | DONE | CANCELLED",
  "archived": "boolean",
  "isDefault": "boolean | null",
  "parentId": "string | null",
  "children": "string",
  "owner": "string | null",
  "tags": "string | null",
  "completedAt": "string | null",
  "createdAt": "string | null",
  "updatedAt": "string | null"
}
```

---

## Required Fields

| Field  | Required |
| ------ | -------- |
| name   | Yes      |
| status | Yes      |

---

## Optional Fields

- description
- priority
- start
- end
- duration
- archived
- completedAt
- parentId
- children
- owner
- isDefault
- tags

---

## Enum Values

### Status

- TODO
- IN_PROGRESS
- DONE
- CANCELLED

### Priority

- LOW
- MEDIUM
- HIGH

---

# Request Reference

## Path Parameters

| Parameter | Type | Description     |
| --------- | ---- | --------------- |
| id        | UUID | Task identifier |

---

## Query Parameters

| Parameter | Type        | Default | Description        |
| --------- | ----------- | ------- | ------------------ |
| page      | Integer     | 1       | Current page       |
| limit     | Integer     | 10      | Number of records  |
| status    | Enum        | —       | Filter by status   |
| priority  | Enum        | —       | Filter by priority |
| search    | String      | —       | Search task name   |
| sort      | ASC \| DESC | DESC    | Sort order         |
| all       | Boolean     | false   | Return all records |

---

## Request Body Requirements

The API requires:

- `name`
- `status`

All remaining fields are optional.

---

# Endpoint Reference

## GET /tasks

### Purpose

Retrieve all public tasks.

### Authentication

Not Required

### Query Parameters

- page
- limit
- status
- priority
- search
- sort
- all

### Success Response

HTTP 200 OK

### Error Responses

- 422 Validation Error

---

## GET /tasks/me

### Purpose

Retrieve tasks belonging to the authenticated user.

### Authentication

JWT Required

### Success Response

HTTP 200 OK

### Error Responses

- 401 Unauthorized

---

## POST /tasks

### Purpose

Create a task.

### Authentication

Optional

### Success Response

HTTP 200 OK

### Error Responses

- 422 Validation Error

---

## GET /tasks/{id}

### Purpose

Retrieve a task by ID.

### Authentication

Not Required

### Success Response

HTTP 200 OK

### Error Responses

- 404 Not Found
- 422 Invalid UUID

---

## PATCH /tasks/{id}

### Purpose

Update a task.

### Authentication

JWT Required

Owner only.

### Success Response

HTTP 200 OK

### Error Responses

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error

---

## DELETE /tasks/{id}

### Purpose

Delete a task.

### Authentication

JWT Required

Owner only.

### Success Response

HTTP 204 No Content

or

HTTP 200 OK

### Error Responses

- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 422 Validation Error

---

## GET /tasks/{id}/children

### Purpose

Retrieve child tasks.

### Authentication

Not Required

### Success Response

HTTP 200 OK

---

# Response Formats

## Collection Response

```json
{
  "data": [],
  "meta": {
    "total": 0,
    "page": 1,
    "limit": 10,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

---

## Single Resource Response

Returns a Task object.

---

## Delete Response

Delete operations may return either:

```text
204 No Content
```

or

```json
{
  "success": true,
  "message": "Task deleted successfully."
}
```

---

# HTTP Status Codes

| Code | Meaning            |
| ---- | ------------------ |
| 200  | Success            |
| 204  | Resource deleted   |
| 401  | Unauthorized       |
| 403  | Forbidden          |
| 404  | Resource not found |
| 422  | Validation error   |

---

# Validation Rules

## Required Fields

- name
- status

---

## UUID Validation

Task IDs must be valid UUID values.

---

## Enum Validation

### Status

- TODO
- IN_PROGRESS
- DONE
- CANCELLED

### Priority

- LOW
- MEDIUM
- HIGH

---

## Pagination Rules

- Default page: 1
- Default limit: 10
- Supports custom page numbers
- Supports custom limits

---

## Sorting Rules

Supported values:

- ASC
- DESC

---

# API Features

The API supports:

- Authentication
- Task CRUD operations
- Pagination
- Searching
- Filtering
- Sorting
- Parent tasks
- Child tasks
- Public task creation
- Authenticated task ownership

---

# API Constraints

The current implementation includes the following constraints:

- JWT required for `GET /tasks/me`
- JWT required for protected endpoints
- Only task owners can update tasks
- Only task owners can delete tasks
- Task IDs must be valid UUIDs
- Pagination is enabled by default
- Sorting supports only ASC and DESC
- Validation failures return HTTP 422
- Collection endpoints return paginated responses

---

# API Risks & Known Issues

## Current Risks

| Risk                                           | Impact                                                                      | Recommendation                                               |
| ---------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------ |
| No logout endpoint                             | Frontend must handle logout locally by clearing stored authentication data. | Implement client-side logout until API support is available. |
| No password reset endpoint                     | Users cannot recover forgotten passwords through the API.                   | Plan frontend messaging until backend support is available.  |
| No email verification endpoint                 | Newly registered accounts cannot be verified.                               | Consider future backend enhancement.                         |
| JWT expiration handling                        | Expired access tokens will fail protected requests.                         | Automatically refresh tokens before retrying requests.       |
| Authorization required for protected endpoints | Missing or invalid tokens will result in unauthorized responses.            | Implement route protection and authentication guards.        |

---

## Known Issues

No functional defects were identified during the API investigation and manual validation.

The API behaved consistently with the documented contract throughout testing.

---

## Technical Notes

### Frontend Considerations

- Store authentication tokens securely.
- Automatically attach bearer tokens to protected requests.
- Handle HTTP 401 responses globally.
- Refresh expired access tokens before retrying requests.
- Display backend validation messages to users.
- Handle empty search and filter results gracefully.
- Protect authenticated routes.
- Centralize API error handling.

---

# QA Validation Summary

## Validation Results

| Area            | Status |
| --------------- | ------ |
| Authentication  | Passed |
| CRUD Operations | Passed |
| Pagination      | Passed |
| Search          | Passed |
| Filtering       | Passed |
| Error Handling  | Passed |

---

## Findings

- No blocking defects identified.
- API behavior matches the documented contract.
- API is ready for frontend integration.

---

## QA Baseline

The API investigation established the following baseline:

- Authentication validated
- CRUD operations validated
- Pagination validated
- Search validated
- Filtering validated
- Error handling validated

No blocking issues were identified prior to frontend implementation.

---

# Related Documentation

- TA - Authentication
- TA - API Test Cases
- TA - API Test Case Repository
- TA - API Validation Report
- TA - Postman Collection
- TA - Manual Testing Repository
- Release Notes
