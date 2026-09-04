import axios from "axios";

import { env } from "@/config/env";
import { logger } from "@/utils/logger";

const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

/**
 * Removes query parameters and fragments before a URL/path is logged.
 *
 * Query strings can contain sensitive values, so diagnostics should only
 * expose the request path.
 */
function getSafePath(url?: string): string | undefined {
  if (!url) {
    return undefined;
  }

  return url.split(/[?#]/)[0];
}

/**
 * Logs outgoing API requests without exposing request headers,
 * authorization data, or request payloads.
 */
apiClient.interceptors.request.use(
  (config) => {
    logger.debug("API", "api.request.started", {
      method: config.method?.toUpperCase(),
      path: getSafePath(config.url),
    });

    return config;
  },
  (error: unknown) => {
    logger.error("NETWORK", "api.request.setup_failed");

    return Promise.reject(error);
  },
);

/**
 * Logs successful API responses.
 *
 * Response data is available for development diagnostics and will pass
 * through the logger's sanitization policy. Production logging omits
 * structured context.
 */
apiClient.interceptors.response.use(
  (response) => {
    logger.debug("API", "api.response.received", {
      method: response.config.method?.toUpperCase(),
      path: getSafePath(response.config.url),
      status: response.status,
      data: response.data,
    });

    return response;
  },
  (error: unknown) => {
    if (!axios.isAxiosError(error)) {
      logger.error("APPLICATION_RUNTIME", "api.unexpected_error");

      return Promise.reject(error);
    }

    const method = error.config?.method?.toUpperCase();
    const path = getSafePath(error.config?.url);

    if (!error.response) {
      logger.error("NETWORK", "api.network_failed", {
        method,
        path,
        message: error.message,
      });

      return Promise.reject(error);
    }

    const { status, data } = error.response;

    const context = {
      method,
      path,
      status,
      data,
    };

    if (status >= 500) {
      logger.error("API", "api.response.failed", context);
    } else {
      logger.warn("API", "api.response.rejected", context);
    }

    return Promise.reject(error);
  },
);

export default apiClient;
