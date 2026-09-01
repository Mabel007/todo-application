import axios from "axios";

import type { ApiErrorResponse, ApiValidationIssue } from "@/types/api";
import type { AppError } from "@/types/errors";

type ApiErrorDetails = NonNullable<ApiErrorResponse["error"]>;

function isApiValidationIssue(value: unknown): value is ApiValidationIssue {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "path" in value &&
    Array.isArray(value.path) &&
    value.path.every((item) => typeof item === "string" || typeof item === "number") &&
    "message" in value &&
    typeof value.message === "string" &&
    "code" in value &&
    typeof value.code === "string"
  );
}

function isApiErrorDetails(value: unknown): value is ApiErrorDetails {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  return (
    "issues" in value &&
    Array.isArray(value.issues) &&
    value.issues.every(isApiValidationIssue) &&
    "name" in value &&
    typeof value.name === "string"
  );
}

function isApiErrorResponse(value: unknown): value is ApiErrorResponse {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  if (
    !("success" in value) ||
    value.success !== false ||
    !("message" in value) ||
    typeof value.message !== "string"
  ) {
    return false;
  }

  if (!("error" in value) || value.error === undefined) {
    return true;
  }

  return isApiErrorDetails(value.error);
}

export function normalizeApiError(error: unknown): AppError {
  if (!axios.isAxiosError(error)) {
    return {
      type: "unknown",
      message: "An unexpected error occurred",
    };
  }

  if (!error.response) {
    return {
      type: "network",
      message: "Unable to reach the server",
    };
  }

  const { status, data } = error.response;

  const apiError = isApiErrorResponse(data) ? data : undefined;

  switch (status) {
    case 401:
      return {
        type: "unauthenticated",
        status: 401,
        message: apiError?.message ?? "Authentication failed",
      };

    case 403:
      return {
        type: "unauthorized",
        status: 403,
        message: apiError?.message ?? "Access denied",
      };

    case 404:
      return {
        type: "not-found",
        status: 404,
        message: apiError?.message ?? "Resource not found",
      };

    case 409:
      return {
        type: "conflict",
        status: 409,
        message: apiError?.message ?? "Request conflict",
      };

    case 422:
      return {
        type: "validation",
        status: 422,
        message: apiError?.message ?? "Validation failed",
        issues: apiError?.error?.issues ?? [],
      };

    case 429:
      return {
        type: "rate-limit",
        status: 429,
        message: apiError?.message ?? "Too many requests",
      };

    default:
      if (status >= 500 && status <= 599) {
        return {
          type: "server",
          status,
          message: "The server encountered an error",
        };
      }

      return {
        type: "unknown",
        message: "An unexpected API error occurred",
      };
  }
}
