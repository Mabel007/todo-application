# Todo API Postman Guide

---

## Document Information

| Field             | Value                                                     |
| ----------------- | --------------------------------------------------------- |
| **Category**      | Project Documentation                                     |
| **Related Epic**  | TA-2 API Investigation & Manual Testing                   |
| **Related Story** | TA-12 Create Reusable Postman Collection for the Todo API |
| **Status**        | Active                                                    |
| **Version**       | v0.1.0                                                    |
| **Last Updated**  | July 2026                                                 |

---

# Overview

This document describes how to import, configure, and use the Todo Application Postman Collection for manual API testing.

---

# Requirements

- Postman Desktop
- Todo Application Postman Collection
- Todo Application Environment
- Internet connection

---

# Import the Collection

1. Open Postman.
2. Select **Import**.
3. Import:

```
todo-application.postman_collection.json
```

---

# Import the Environment

1. Select **Import**.
2. Import:

```
todo-application.postman_environment.json
```

3. Select:

```
Todo Application - Local
```

from the environment dropdown.

---

# Configure the Environment

After importing the environment, configure the following variables.

| Variable     | Description                                   |
| ------------ | --------------------------------------------- |
| baseURL      | Base URL of the Todo API                      |
| accessToken  | JWT access token used for protected endpoints |
| refreshToken | JWT refresh token                             |
| taskId       | Existing task identifier used for testing     |
| userId       | Existing user identifier                      |
| parentId     | Existing parent task identifier               |

Only **baseURL** should have a predefined value.

The remaining variables should be populated after authenticating with the API or after creating test data.

---

# Authentication

1. Execute **POST /auth/register** to create a user.

or

2. Execute **POST /auth/login**.

3. Copy the returned **accessToken**.

4. Copy the returned **refreshToken**.

5. Update the Postman environment variables:

- accessToken
- refreshToken

Protected endpoints will now automatically use the configured Bearer token.

---

# Running Requests

1. Select **Todo Application - Local**.
2. Ensure `baseURL` is configured.
3. Authenticate using the Login endpoint.
4. Save the returned tokens.
5. Execute the required requests.
6. Update `taskId`, `userId`, and `parentId` as needed during testing.

---

# Exporting the Collection

Export the collection using **Collection v2.1**.

Save as:

```
todo-application.postman_collection.json
```

Export the environment as:

```
todo-application.postman_environment.json
```

---

# Repository Structure

```text
postman/
├── todo-application.postman_collection.json
├── todo-application.postman_environment.json
└── README.md
```

# Environment Validation

The Postman environment was validated using the following steps.

- Configured the base URL.
- Registered or logged in a test user.
- Stored the access token.
- Stored the refresh token.
- Executed authenticated endpoints.
- Verified environment variable substitution.
- Confirmed protected endpoints returned successful responses.
- Confirmed invalid authentication returned HTTP 401.

---

# Related Documentation

```text
docs/
├── api/
│   ├── authentication.md
│   ├── postman-guide.md
│   └── task-api-reference.md
├── architecture/
├── deployment/
├── development/
├── design-system/
├── project-overview.md
└── releases/
```
