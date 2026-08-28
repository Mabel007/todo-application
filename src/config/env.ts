const getRequiredUrl = (name: string, value: string | undefined): string => {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  // set url
  let url: URL;

  try {
    url = new URL(trimmedValue);
  } catch {
    throw new Error(`Invalid environment variable ${name}: expected a valid HTTP or HTTPS URL`);
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new Error(`Invalid environment variable ${name}: expected a valid HTTP or HTTPS URL`);
  }

  return trimmedValue;
};

export const env = Object.freeze({
  apiBaseUrl: getRequiredUrl("VITE_API_BASE_URL", import.meta.env.VITE_API_BASE_URL),
});
