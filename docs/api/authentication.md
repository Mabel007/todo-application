# TA - Authentication

---

## Document Information

| Field             | Value                                   |
| ----------------- | --------------------------------------- |
| **Category**      | Project Documentation                   |
| **Related Epic**  | TA-2 API Investigation & Manual Testing |
| **Related Story** | TA-11 Review Authentication API         |
| **Status**        | Active                                  |
| **Version**       | v0.1.0                                  |
| **Last Updated**  | July 2026                               |

---

# Overview

This document describes the authentication architecture used by the Todo Application API.

It documents the authentication endpoints, JWT token flow, request and response payloads, protected endpoints, authorization requirements, token lifecycle, and authentication strategy that will be implemented by the frontend application.

---

# Base URL

```text
https://api.oluwasetemi.dev
```

---

# Authentication Strategy

The API uses JSON Web Tokens (JWT) for authentication.

Two tokens are issued after successful registration or login:

- Access Token
- Refresh Token

The access token is used to authorize protected API requests.

The refresh token is used to obtain a new access token after expiration.

---

# Authentication Flow

```text
Register
    │
    ▼
Receive Access Token
Receive Refresh Token
    │
    ▼
Store Tokens
    │
    ▼
Access Protected Endpoints
    │
    ▼
Access Token Expires
    │
    ▼
POST /auth/refresh
    │
    ▼
Receive New Tokens
    │
    ▼
Continue Using Application
```

---

# Authentication Endpoints

| Endpoint       | Method | Authentication | Purpose                             |
| -------------- | ------ | -------------- | ----------------------------------- |
| /auth/register | POST   | Public         | Register a new user                 |
| /auth/login    | POST   | Public         | Authenticate a user                 |
| /auth/refresh  | POST   | Refresh Token  | Generate new authentication tokens  |
| /auth/me       | GET    | Access Token   | Retrieve current authenticated user |

---

# Endpoint Details

## POST /auth/register

### Purpose

Register a new user account.

### Authentication

Not Required

### Required Fields

| Field    | Required |
| -------- | -------- |
| email    | Yes      |
| name     | Yes      |
| password | Yes      |

### Optional Fields

- image
- emailVerified
- isActive
- lastLoginAt

### Success Response

**201 Created**

Returns:

```json
{
  "user": {},
  "accessToken": "",
  "refreshToken": ""
}
```

### Error Responses

| Status | Description          |
| ------ | -------------------- |
| 409    | Email already exists |
| 422    | Validation error     |

---

## POST /auth/login

### Purpose

Authenticate an existing user.

### Authentication

Not Required

### Required Fields

| Field    | Required |
| -------- | -------- |
| email    | Yes      |
| password | Yes      |

### Success Response

**200 OK**

Returns:

```json
{
  "user": {},
  "accessToken": "",
  "refreshToken": ""
}
```

### Error Responses

| Status | Description         |
| ------ | ------------------- |
| 401    | Invalid credentials |
| 422    | Validation error    |

---

## POST /auth/refresh

### Purpose

Generate a new access token using a valid refresh token.

### Authentication

Refresh Token Required

### Request Body

| Field        | Required |
| ------------ | -------- |
| refreshToken | Yes      |

### Success Response

**200 OK**

Returns:

```json
{
  "accessToken": "",
  "refreshToken": ""
}
```

### Error Responses

| Status | Description           |
| ------ | --------------------- |
| 401    | Invalid refresh token |
| 422    | Validation error      |

---

## GET /auth/me

### Purpose

Retrieve the authenticated user's profile.

### Authentication

Access Token Required

### Request Header

```http
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the authenticated user profile.

### Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 401    | Authentication required |

---

# JWT Token Lifecycle

## Registration

User registers successfully.

↓

Access Token issued.

↓

Refresh Token issued.

↓

Tokens stored securely.

---

## Authenticated Requests

Frontend sends:

```http
Authorization: Bearer <access_token>
```

with every protected request.

---

## Token Expiration

When the access token expires:

1. Frontend sends the refresh token to:

```text
POST /auth/refresh
```

2. API returns:

- New Access Token
- New Refresh Token

3. Frontend replaces the previous tokens.

---

## Logout

The API currently exposes no logout endpoint.

Logout should therefore:

- Remove the access token.
- Remove the refresh token.
- Clear the authenticated user state.
- Redirect to the login screen.

---

# Protected Endpoints

The following endpoints require authentication.

| Endpoint           | Requirement  |
| ------------------ | ------------ |
| GET /tasks/me      | JWT Required |
| PATCH /tasks/{id}  | Task Owner   |
| DELETE /tasks/{id} | Task Owner   |
| GET /auth/me       | JWT Required |

---

# Request Headers

Protected requests require:

```http
Authorization: Bearer <access_token>
```

---

# Supported HTTP Status Codes

| Status | Description             |
| ------ | ----------------------- |
| 200    | Success                 |
| 201    | Resource created        |
| 401    | Unauthorized            |
| 403    | Forbidden               |
| 409    | Resource already exists |
| 422    | Validation error        |

---

# Authentication Capabilities

The authentication system supports:

- User registration
- User login
- JWT authentication
- Refresh token rotation
- Current user retrieval
- Protected endpoints
- Token renewal
- Authorization using Bearer tokens

---

# Authentication Limitations

The current API has the following limitations:

- No logout endpoint.
- Password reset endpoint not available.
- Email verification endpoint not available.
- Refresh token is required to obtain a new access token.
- Protected endpoints require a valid Bearer token.
- Only task owners may modify or delete their tasks.

---

# Related Documentation

```text
docs/
├── api/
│   ├── task-api-reference.md
│   └── authentication.md
├── architecture/
├── deployment/
├── development/
├── design-system/
├── project-overview.md
└── releases/
```
