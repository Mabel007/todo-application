# TA - API Reference

---

## Document Information

| Field             | Value                                   |
| ----------------- | --------------------------------------- |
| **Category**      | Project Documentation                   |
| **Related Epic**  | TA-2 API Investigation & Manual Testing |
| **Related Story** | TA-10 Review Task API Documentation     |
| **Status**        | Active                                  |
| **Version**       | v0.1.0                                  |
| **Last Updated**  | July 2026                               |

---

# Overview

This document provides the technical reference for the Todo Application Task API.

It defines the available endpoints, authentication requirements, request payloads, response structures, path parameters, query parameters, supported HTTP status codes, validation rules, and known API limitations.

The Task API serves as the primary data source for the frontend application and supports complete task management functionality including task retrieval, creation, updates, deletion, searching, filtering, sorting, pagination, and parent-child task relationships.

---

# Base URL

```text
https://api.oluwasetemi.dev
```

---

# API Documentation

```text
https://api.oluwasetemi.dev/reference#main-api
```

---

# Authentication

The API supports both public and authenticated endpoints.

| Endpoint                 | Authentication            |
| ------------------------ | ------------------------- |
| GET /tasks               | Not Required              |
| GET /tasks/me            | JWT Required              |
| POST /tasks              | Optional                  |
| GET /tasks/{id}          | Not Required              |
| PATCH /tasks/{id}        | JWT Required (Owner Only) |
| DELETE /tasks/{id}       | JWT Required (Owner Only) |
| GET /tasks/{id}/children | Not Required              |

Authenticated POST requests create user-owned tasks.

Unauthenticated POST requests create public tasks.

---

# Task Object

```json
{
  "id": "string",
  "name": "string",
  "description": "string | null",
  "start": "string | null (RFC 3339 full-date)",
  "end": "string | null (RFC 3339 full-date)",
  "duration": "number | null",
  "priority": "LOW | MEDIUM | HIGH",
  "status": "TODO | IN_PROGRESS | DONE | CANCELLED",
  "archived": "boolean",
  "isDefault": "boolean | null",
  "parentId": "string | null",
  "children": "string",
  "owner": "string | null",
  "tags": "string | null",
  "completedAt": "string | null (RFC 3339 full-date)",
  "createdAt": "string | null (RFC 3339 full-date)",
  "updatedAt": "string | null (RFC 3339 full-date)"
}
```

---

# Request Requirements

## Required Fields

| Field  | Required |
| ------ | -------- |
| name   | Yes      |
| status | Yes      |

All remaining fields are optional.

---

# Response Requirements

The API guarantees all Task object properties will be returned, even when their values are `null`.

Collection endpoints additionally return pagination metadata.

---

# Query Parameters

The following query parameters are supported where applicable.

| Parameter | Type        | Default | Description                  |
| --------- | ----------- | ------- | ---------------------------- |
| page      | Integer     | 1       | Current page number          |
| limit     | Integer     | 10      | Number of records returned   |
| status    | Enum        | —       | Filter by task status        |
| priority  | Enum        | —       | Filter by task priority      |
| search    | String      | —       | Search task name             |
| sort      | ASC \| DESC | DESC    | Sort order                   |
| all       | Boolean     | false   | Return all available records |

---

# Path Parameters

| Parameter | Type | Description            |
| --------- | ---- | ---------------------- |
| id        | UUID | Unique task identifier |

---

# API Endpoints

## GET /tasks/me

### Purpose

Retrieve all tasks belonging to the authenticated user.

### Authentication

JWT Required

### Query Parameters

- page
- limit
- status
- priority
- search
- sort
- all

### Success Response

**200 OK**

Returns:

```json
{
  "data": [],
  "meta": {}
}
```

### Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 401    | Authentication required |

---

## GET /tasks

### Purpose

Retrieve all public tasks.

### Authentication

Not Required

### Query Parameters

Same as **GET /tasks/me**.

### Success Response

**200 OK**

Returns:

```json
{
  "data": [],
  "meta": {}
}
```

### Error Responses

| Status | Description      |
| ------ | ---------------- |
| 422    | Validation error |

---

## POST /tasks

### Purpose

Create a new task.

### Authentication

Optional

Authenticated users create owned tasks.

Unauthenticated users create public tasks.

### Request Body

| Field       | Required |
| ----------- | -------- |
| name        | Yes      |
| status      | Yes      |
| priority    | No       |
| description | No       |
| start       | No       |
| end         | No       |
| duration    | No       |
| archived    | No       |
| completedAt | No       |
| parentId    | No       |
| children    | No       |
| owner       | No       |
| isDefault   | No       |
| tags        | No       |

### Success Response

**200 OK**

Returns a Task object.

### Error Responses

| Status | Description      |
| ------ | ---------------- |
| 422    | Validation error |

---

## GET /tasks/{id}

### Purpose

Retrieve a single task.

### Path Parameter

UUID task identifier.

### Success Response

**200 OK**

Returns a Task object.

### Error Responses

| Status | Description    |
| ------ | -------------- |
| 404    | Task not found |
| 422    | Invalid UUID   |

---

## PATCH /tasks/{id}

### Purpose

Update an existing task.

Only the supplied properties are updated.

### Authentication

JWT Required.

Only the task owner can update a task.

### Success Response

**200 OK**

Returns the updated Task object.

### Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 401    | Authentication required |
| 403    | Task ownership required |
| 404    | Task not found          |
| 422    | Validation error        |

---

## DELETE /tasks/{id}

### Purpose

Delete a task.

### Authentication

JWT Required.

Only the task owner can delete a task.

### Success Responses

**204 No Content**

Task successfully deleted.

Some default task deletions may return:

```json
{
  "success": true,
  "message": "Task deleted successfully."
}
```

with **HTTP 200 OK**.

### Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 401    | Authentication required |
| 403    | Task ownership required |
| 404    | Task not found          |
| 422    | Invalid UUID            |

---

## GET /tasks/{id}/children

### Purpose

Retrieve child tasks for a parent task.

### Query Parameters

- page
- limit
- all

### Success Response

**200 OK**

Returns:

```json
{
  "data": [],
  "meta": {}
}
```

---

# Response Formats

## Collection Endpoints

The following endpoints return paginated collections:

- GET /tasks
- GET /tasks/me
- GET /tasks/{id}/children

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

## Single Resource Endpoints

The following endpoints return a Task object:

- GET /tasks/{id}
- POST /tasks
- PATCH /tasks/{id}

---

## Delete Responses

Delete operations may return either:

**204 No Content**

or

```json
{
  "success": true,
  "message": "Task deleted successfully."
}
```

depending on the task type.

---

# Supported HTTP Status Codes

| Status | Description                    |
| ------ | ------------------------------ |
| 200    | Request completed successfully |
| 204    | Resource deleted successfully  |
| 401    | Authentication required        |
| 403    | Forbidden                      |
| 404    | Resource not found             |
| 422    | Validation error               |

> **Note:** Although HTTP **201 Created** is a common REST convention, the current Task API returns **HTTP 200 OK** after successfully creating a task.

---

# API Capabilities

The Task API supports:

- Task retrieval
- Task creation
- Task updates
- Task deletion
- Pagination
- Searching
- Filtering
- Sorting
- Parent task relationships
- Child task retrieval
- Public task creation
- Authenticated task ownership

---

# API Limitations

The current API has the following constraints:

- JWT authentication is required for **GET /tasks/me**.
- Only task owners can update tasks.
- Only task owners can delete tasks.
- Task IDs must be valid UUIDs.
- Pagination is enabled by default.
- Sorting supports only **ASC** and **DESC**.
- Priority values are limited to **LOW**, **MEDIUM**, and **HIGH**.
- Status values are limited to **TODO**, **IN_PROGRESS**, **DONE**, and **CANCELLED**.
- Validation errors return **HTTP 422**.
- Collection endpoints return paginated responses, while single-resource endpoints return a Task object.

---

# Related Documentation

- Project Overview
- Frontend Architecture
- Authentication
- Testing Strategy
- Manual Test Cases
- Environment Setup
- Development Workflow
- Release Notes
