declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SKYFIRE_APP_ENV: ENV_TYPES;
      SKYFIRE_API_KEY: string;
    }
  }
}

export {};
