import { ENV_TYPES } from "../environment";

// App Envs ////////////////////////////////////////////////
const app_env = process.env.NEXT_PUBLIC_APP_ENV || "development";
export const APP_ENV = app_env as ENV_TYPES;
