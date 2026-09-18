/**
 * 1. PAGINATION METADATA
 * Matches the explicit layout returned by the oluwasetemi.dev API collections.
 */
export interface ApiPaginatedMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
/**
 * 2. STANDARDIZED COLLECTION RESPONSE WRAPPER (With Generics)
 * The type template '<T>' stands for whatever model (Task, User, etc.)
 * sits inside the array data slot.
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: ApiPaginatedMeta;
}

/**
 * 4. NESTED VALIDATION ISSUE FORMAT
 * Captures specific Zod runtime validation failure context.
 */
export interface ApiValidationIssue {
  path: Array<string | number>;
  message: string;
  code: string;
}

/**
 * 5. VALIDATED STANDARD ERROR RECOVERY STRUCTURE
 * Matches standard Hono/Zod-OpenAPI field error response shapes used by the server.
 */
export interface ApiErrorResponse {
  success: boolean;
  message: string;
  error?: {
    issues: ApiValidationIssue[];
    name: string;
  };
}
