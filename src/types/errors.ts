import type { ApiValidationIssue } from "./api";

export type AppError =
  | {
      type: "validation";
      message: string;
      status: 422;
      issues: ApiValidationIssue[];
    }
  | {
      type: "unauthenticated";
      message: string;
      status: 401;
    }
  | {
      type: "unauthorized";
      message: string;
      status: 403;
    }
  | {
      type: "not-found";
      message: string;
      status: 404;
    }
  | {
      type: "conflict";
      message: string;
      status: 409;
    }
  | {
      type: "rate-limit";
      message: string;
      status: 429;
    }
  | {
      type: "server";
      message: string;
      status: number;
    }
  | {
      type: "network";
      message: string;
    }
  | {
      type: "unknown";
      message: string;
    };
