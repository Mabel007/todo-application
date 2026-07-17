# TA - API Reference

## Document Information

| Field         | Value                                     |
| ------------- | ----------------------------------------- |
| Category      | Project Documentation                     |
| Related Epic  | TA-2 – API Investigation & Manual Testing |
| Related Story | TA-10 – Review Task API Documentation     |
| Status        | Active                                    |
| Version       | v0.1.0                                    |
| Last Updated  | July 2026                                 |

---

# Overview

Purpose of the API

Supported capabilities

Intended consumers

---

# API Environment

## Base URL

```
https://api.oluwasetemi.dev
```

## Official Documentation

```
https://api.oluwasetemi.dev/reference#main-api
```

---

# Authentication

## Authentication Model

Explain:

- Public endpoints
- JWT protected endpoints
- Owner-only endpoints

### Endpoint Authentication Matrix

| Endpoint           | Auth Required | Notes           |
| ------------------ | ------------- | --------------- |
| GET /tasks         | No            | Public          |
| GET /tasks/me      | Yes           | Current user    |
| POST /tasks        | Optional      | Public or owned |
| PATCH /tasks/{id}  | Yes           | Owner only      |
| DELETE /tasks/{id} | Yes           | Owner only      |

---

# Data Model

## Task Object

(JSON)

---

## Required Fields

---

## Optional Fields

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

## Query Parameters

## Request Body Requirements

---

# Endpoint Reference

Create a consistent section for **every endpoint**.

---

## GET /tasks

### Purpose

### Authentication

### Query Parameters

### Success Response

### Error Responses

### Notes

---

## GET /tasks/me

---

## POST /tasks

---

## GET /tasks/{id}

---

## PATCH /tasks/{id}

---

## DELETE /tasks/{id}

---

## GET /tasks/{id}/children

---

# Response Formats

## Collection Response

(JSON)

---

## Single Resource Response

(JSON)

---

## Delete Response

(JSON)

---

# HTTP Status Codes

| Code | Meaning |
| ---- | ------- |

---

# Validation Rules

Move everything validation-related into one section.

### Required Fields

### UUID Validation

### Enum Validation

### Pagination Rules

### Sorting Rules

---

# API Features

- CRUD
- Pagination
- Search
- Filtering
- Sorting
- Parent Tasks
- Child Tasks
- Authentication

---

# API Constraints

Instead of "limitations", call them **Constraints**, for example:

- JWT required for `/tasks/me`
- UUID required for task IDs
- Owner-only updates
- Owner-only deletes
- Pagination enabled by default
- 422 for validation failures

---

# QA Validation Summary

Move your QA findings into their own section.

## Validation Results

| Area           | Status |
| -------------- | ------ |
| Authentication |        |
| CRUD           |        |
| Pagination     |        |
| Search         |        |
| Filtering      |        |
| Error Handling |        |

---

## Findings

- No blocking defects identified.
- API behavior matches documented contract.
- Ready for frontend integration.

---

# Related Documentation

- TA - Authentication
- TA - API Test Cases
- TA - API Test Case Repository
- TA - API Validation Report
- TA - Postman Collection
- TA - Manual Testing Repository
- Release Notes

---
