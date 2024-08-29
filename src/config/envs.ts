import { ENV_TYPES } from "../environment";

const ENV_URLS = {
  development: "http://localhost:3001",
  sandbox: "https://sky-services-api-qa.onrender.com",
  production: "https://api.skyfire.xyz",
} as const;

// App Envs ////////////////////////////////////////////////
const app_env = process.env.SKYFIRE_APP_ENV || "production";
export const APP_ENV = app_env as ENV_TYPES;
export const API_BASE_URL = ENV_URLS[APP_ENV as ENV_TYPES];
