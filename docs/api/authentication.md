# TA - Authentication

---

## Document Information

| Field             | Value                                     |
| ----------------- | ----------------------------------------- |
| **Category**      | Project Documentation                     |
| **Related Epic**  | TA-2 – API Investigation & Manual Testing |
| **Related Story** | TA-11 – Review Authentication API         |
| **Status**        | Active                                    |
| **Version**       | v0.1.0                                    |
| **Last Updated**  | July 2026                                 |

---

# Overview

This document describes the authentication architecture used by the Todo Application API.

It provides an overview of the authentication strategy, JWT token lifecycle, authentication endpoints, authorization requirements, protected resources, supported HTTP responses, implementation considerations, and the results of manual authentication validation.

---

# Base URL

```text
https://api.oluwasetemi.dev
```

---

# Authentication Strategy

The Todo Application API uses **JSON Web Token (JWT)** authentication.

After a successful registration or login, the API issues two tokens:

| Token             | Purpose                                                            |
| ----------------- | ------------------------------------------------------------------ |
| **Access Token**  | Authorizes requests to protected endpoints.                        |
| **Refresh Token** | Generates new authentication tokens when the access token expires. |

The frontend is responsible for securely storing these tokens and attaching the access token to every protected request.

---

# Authentication Flow

```text
Register / Login
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

| Endpoint         | Method | Authentication | Purpose                                   |
| ---------------- | ------ | -------------- | ----------------------------------------- |
| `/auth/register` | POST   | Public         | Register a new user                       |
| `/auth/login`    | POST   | Public         | Authenticate an existing user             |
| `/auth/refresh`  | POST   | Refresh Token  | Generate new authentication tokens        |
| `/auth/me`       | GET    | Access Token   | Retrieve the authenticated user's profile |

---

# Endpoint Reference

## POST /auth/register

### Purpose

Registers a new user account.

### Authentication

Not Required

### Required Fields

| Field    | Required |
| -------- | -------- |
| name     | Yes      |
| email    | Yes      |
| password | Yes      |

### Optional Fields

- image
- emailVerified
- isActive
- lastLoginAt

### Success Response

**201 Created**

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

Authenticates an existing user.

### Authentication

Not Required

### Required Fields

| Field    | Required |
| -------- | -------- |
| email    | Yes      |
| password | Yes      |

### Success Response

**200 OK**

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

Generates new authentication tokens using a valid refresh token.

### Authentication

Refresh Token Required

### Request Body

| Field        | Required |
| ------------ | -------- |
| refreshToken | Yes      |

### Success Response

**200 OK**

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

Retrieves the authenticated user's profile.

### Authentication

Access Token Required

### Request Header

```http
Authorization: Bearer <access_token>
```

### Success Response

**200 OK**

Returns the authenticated user's profile.

### Error Responses

| Status | Description             |
| ------ | ----------------------- |
| 401    | Authentication required |

---

# JWT Token Lifecycle

## Registration or Login

1. User successfully authenticates.
2. API returns:
   - Access Token
   - Refresh Token
3. Frontend stores both tokens securely.

---

## Authenticated Requests

Protected requests include the following header:

```http
Authorization: Bearer <access_token>
```

---

## Token Refresh

When the access token expires:

1. Send the refresh token to:

```text
POST /auth/refresh
```

2. API returns:

- New Access Token
- New Refresh Token

3. Frontend replaces the previous tokens.

---

## Logout

The current API does not expose a logout endpoint.

Frontend logout should:

- Remove the access token.
- Remove the refresh token.
- Clear the authenticated user state.
- Redirect the user to the login page.

---

# Protected Endpoints

The following endpoints require authentication.

| Endpoint           | Requirement  |
| ------------------ | ------------ |
| GET /auth/me       | JWT Required |
| GET /tasks/me      | JWT Required |
| PATCH /tasks/{id}  | Task Owner   |
| DELETE /tasks/{id} | Task Owner   |

---

# Authorization Header

Protected endpoints require the following request header.

```http
Authorization: Bearer <access_token>
```

---

# Supported HTTP Status Codes

| Status | Description             |
| ------ | ----------------------- |
| 200    | Success                 |
| 201    | Resource Created        |
| 401    | Unauthorized            |
| 403    | Forbidden               |
| 409    | Resource Already Exists |
| 422    | Validation Error        |

---

# Authentication Capabilities

The authentication system supports:

- User registration
- User login
- JWT authentication
- Access token authorization
- Refresh token rotation
- Current user retrieval
- Protected API endpoints
- Bearer token authentication

---

# Authentication Limitations

Current limitations include:

- No logout endpoint.
- No password reset endpoint.
- No email verification endpoint.
- Refresh token is required to obtain a new access token.
- Protected endpoints require a valid bearer token.
- Task updates and deletions are restricted to resource owners.

---

# Authentication Validation Summary

Authentication endpoints were manually validated using the reusable Postman collection.

## Validation Coverage

| Area                      | Status |
| ------------------------- | ------ |
| User Registration         | Passed |
| User Login                | Passed |
| Token Refresh             | Passed |
| Current User Endpoint     | Passed |
| Protected Endpoint Access | Passed |
| Invalid Authentication    | Passed |

---

# QA Findings

The following observations were made during manual API testing:

- JWT authentication behaved as documented.
- Access and refresh tokens were generated successfully.
- Protected endpoints correctly required bearer authentication.
- Unauthorized requests returned the expected HTTP responses.
- Token refresh successfully generated replacement tokens.
- No authentication defects were identified during testing.

---

# Implementation Notes

Frontend implementation should:

- Securely store authentication tokens.
- Automatically include the access token in protected requests.
- Refresh expired access tokens using the refresh endpoint.
- Clear authentication data during logout.
- Handle unauthorized responses by redirecting users to the authentication flow when appropriate.

---

# Related Documentation

- API Reference
- Postman Collection
- Manual API Validation
- Manual API Test Cases
- API Investigation Findings & QA Baseline
