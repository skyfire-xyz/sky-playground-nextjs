export const SKYFIRE_API_KEY = process.env.SKYFIRE_API_KEY;
export const SKYFIRE_ENV = process.env.SKYFIRE_APP_ENV || "production";
export const SKYFIRE_ENDPOINT_URL =
  SKYFIRE_ENV === "production"
    ? "https://api.skyfire.xyz"
    : "https://api-qa.skyfire.xyz";
