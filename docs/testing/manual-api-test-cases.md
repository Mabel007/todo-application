# Manual API Test Cases

---

## Document Information

| Field             | Value                                                |
| ----------------- | ---------------------------------------------------- |
| **Category**      | QA Documentation                                     |
| **Related Epic**  | TA-2 API Investigation & Manual Testing              |
| **Related Story** | TA-15 Document API Test Cases and Expected Behaviors |
| **Status**        | Active                                               |
| **Version**       | v0.1.0                                               |
| **Last Updated**  | July 2026                                            |

---

# Overview

This document defines the reusable manual API test cases for the Todo Application API.

The test suite covers authentication, CRUD operations, pagination, search, filtering, validation, boundary conditions, and security scenarios. These test cases provide the baseline for manual regression testing and future API automation.

---

# Test Objectives

- Verify endpoint functionality.
- Validate request and response payloads.
- Verify authentication and authorization.
- Verify validation rules.
- Verify pagination, filtering, and search.
- Verify API error handling.
- Support future automation.

---

# Test Case Priority

| Priority | Description             |
| -------- | ----------------------- |
| High     | Critical functionality  |
| Medium   | Important functionality |
| Low      | Nice-to-have validation |

---

# Positive Test Cases

## Authentication

| ID      | Scenario                      | Priority | Expected Result              |
| ------- | ----------------------------- | -------- | ---------------------------- |
| API-001 | Register with valid details   | High     | User registered successfully |
| API-002 | Login with valid credentials  | High     | Authentication succeeds      |
| API-003 | Retrieve current user profile | High     | User profile returned        |
| API-004 | Refresh access token          | High     | New access token returned    |

---

## Task Management

| ID      | Scenario                            | Priority | Expected Result       |
| ------- | ----------------------------------- | -------- | --------------------- |
| API-010 | Create a task                       | High     | Task created          |
| API-011 | Retrieve all tasks                  | High     | Task list returned    |
| API-012 | Retrieve authenticated user's tasks | High     | User tasks returned   |
| API-013 | Retrieve task by ID                 | High     | Task details returned |
| API-014 | Update a task                       | High     | Task updated          |
| API-015 | Delete a task                       | High     | Task deleted          |

---

## Search & Filtering

| ID      | Scenario           | Priority | Expected Result           |
| ------- | ------------------ | -------- | ------------------------- |
| API-020 | Search tasks       | Medium   | Matching tasks returned   |
| API-021 | Filter by status   | Medium   | Filtered results returned |
| API-022 | Filter by priority | Medium   | Filtered results returned |

---

## Pagination

| ID      | Scenario           | Priority | Expected Result                      |
| ------- | ------------------ | -------- | ------------------------------------ |
| API-030 | Default pagination | Medium   | Default page returned                |
| API-031 | Custom page        | Medium   | Requested page returned              |
| API-032 | Custom page size   | Medium   | Requested number of records returned |

---

# Negative Test Cases

| ID      | Scenario                     | Priority | Expected Result           |
| ------- | ---------------------------- | -------- | ------------------------- |
| API-100 | Login with invalid password  | High     | HTTP 401                  |
| API-101 | Missing bearer token         | High     | HTTP 401                  |
| API-103 | Task missing required fields | High     | HTTP 422 validation error |
| API-104 | Duplicate registration email | High     | HTTP 409                  |
| API-105 | Registration missing fields  | High     | HTTP 422 validation error |
| API-110 | Malformed task UUID          | Medium   | HTTP 422 validation error |
| API-111 | Valid nonexistent task UUID  | Medium   | HTTP 404                  |

---

# Boundary Test Cases

| ID      | Scenario             | Priority | Expected Result               |
| ------- | -------------------- | -------- | ----------------------------- |
| API-200 | Maximum title length | Medium   | Accepted if within limit      |
| API-201 | Minimum title length | Medium   | Accepted if valid             |
| API-202 | Maximum page size    | Low      | Results returned successfully |

---

# Validation Test Cases

| ID      | Scenario             | Priority | Expected Result  |
| ------- | -------------------- | -------- | ---------------- |
| API-300 | Invalid email format | High     | Validation error |
| API-301 | Invalid priority     | Medium   | Validation error |
| API-302 | Invalid status       | Medium   | Validation error |
| API-303 | Invalid data types   | Medium   | Validation error |

---

# Security Test Cases

| ID      | Scenario                   | Priority | Expected Result                                               |
| ------- | -------------------------- | -------- | ------------------------------------------------------------- |
| API-400 | Access another user's task | High     | Access denied                                                 |
| API-401 | Update another user's task | High     | Request rejected                                              |
| API-402 | Delete another user's task | High     | Request rejected                                              |
| API-403 | Expired access token       | High     | NOT EXECUTED - no safely reproducible expired token available |

---

## Postman Regression Traceability

TA-203 maintains API-100, API-101, API-103, API-104, API-105, API-110, API-111, API-401, and API-402 in the permanent Postman collection. The collection complements this canonical repository rather than replacing it. API-403 remains **NOT EXECUTED** for the reason recorded above.

---

# Test Coverage Summary

| Area            | Coverage |
| --------------- | -------- |
| Authentication  |
| CRUD Operations |
| Pagination      |
| Search          |
| Filtering       |
| Validation      |
| Security        |

---

# Related Documentation

- API Reference
- Authentication Guide
- Postman Guide
- Manual API Validation Report
