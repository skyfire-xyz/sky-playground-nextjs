declare global {
  namespace NodeJS {
    interface ProcessEnv {
      SKYFIRE_APP_ENV: ENV_TYPES;
      SKYFIRE_API_KEY: string;
    }
  }
}
interface Window {
  SpeechRecognition: typeof SpeechRecognition;
  webkitSpeechRecognition: typeof SpeechRecognition;
}

export {};
