export type LogLevel = "debug" | "info" | "warn" | "error";

export type LogCategory =
  "API" | "AUTH_SESSION" | "AUTHORIZATION" | "TASK_DOMAIN" | "APPLICATION_RUNTIME" | "NETWORK";

export type LogContext = Record<string, unknown>;

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: LogCategory;
  event: string;
  context?: LogContext;
}

/**
 * Keys that should never be intentionally written to application logs.
 *
 * This includes credentials, authentication/session data,
 * API secrets, cookies, and private keys.
 */
const SENSITIVE_KEYS =
  /password|token|authorization|cookie|secret|session|api[-_]?key|private[-_]?key/i;

const REDACTED_VALUE = "[REDACTED]";

/**
 * Recursively sanitizes values before they are written to logs.
 *
 * Arrays are traversed item by item.
 * Objects are traversed property by property.
 * Sensitive keys are replaced instead of exposing their values.
 */
function sanitizeValue(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitizeValue);
  }

  if (value && typeof value === "object") {
    return Object.entries(value).reduce<Record<string, unknown>>(
      (sanitized, [key, nestedValue]) => {
        sanitized[key] = SENSITIVE_KEYS.test(key) ? REDACTED_VALUE : sanitizeValue(nestedValue);

        return sanitized;
      },
      {},
    );
  }

  return value;
}

/**
 * Sanitizes structured log context before output.
 */
function sanitizeContext(context?: LogContext): LogContext | undefined {
  if (!context) {
    return undefined;
  }

  return sanitizeValue(context) as LogContext;
}

/**
 * Determines whether a log level is allowed in the current environment.
 *
 * Development:
 * - debug
 * - info
 * - warn
 * - error
 *
 * Production:
 * - warn
 * - error
 *
 * Production context is restricted separately when the log entry is created.
 */
function shouldLog(level: LogLevel): boolean {
  if (import.meta.env.DEV) {
    return true;
  }

  return level === "warn" || level === "error";
}

/**
 * Builds the structured object sent to the logging destination.
 *
 * Development receives sanitized diagnostic context.
 * Production deliberately omits context to reduce the risk of exposing
 * application or user data in the browser console.
 */
function createLogEntry(
  level: LogLevel,
  category: LogCategory,
  event: string,
  context?: LogContext,
): LogEntry {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    category,
    event,
  };

  if (import.meta.env.DEV && context) {
    entry.context = sanitizeContext(context);
  }

  return entry;
}

/**
 * Central output boundary for application logs.
 *
 * All direct console usage for supported application diagnostics
 * should remain inside this function rather than being scattered
 * throughout the application.
 */
function writeLog(entry: LogEntry): void {
  switch (entry.level) {
    case "debug":
      console.debug(entry);
      break;

    case "info":
      console.info(entry);
      break;

    case "warn":
      console.warn(entry);
      break;

    case "error":
      console.error(entry);
      break;
  }
}

/**
 * Writes a structured log entry when permitted by the
 * current environment policy.
 */
function log(level: LogLevel, category: LogCategory, event: string, context?: LogContext): void {
  if (!shouldLog(level)) {
    return;
  }

  const entry = createLogEntry(level, category, event, context);

  writeLog(entry);
}

/**
 * Centralized application logger.
 *
 * Current TA-204 integrations:
 * - API
 * - NETWORK
 * - APPLICATION_RUNTIME
 *
 * Future-ready categories:
 * - AUTH_SESSION
 * - AUTHORIZATION
 * - TASK_DOMAIN
 *
 * Defining those categories does not implement future authentication,
 * authorization, or task-management behavior.
 */
export const logger = {
  debug(category: LogCategory, event: string, context?: LogContext): void {
    log("debug", category, event, context);
  },

  info(category: LogCategory, event: string, context?: LogContext): void {
    log("info", category, event, context);
  },

  warn(category: LogCategory, event: string, context?: LogContext): void {
    log("warn", category, event, context);
  },

  error(category: LogCategory, event: string, context?: LogContext): void {
    log("error", category, event, context);
  },
};
