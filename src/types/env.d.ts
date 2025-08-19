declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "dev" | "prod" | "test";
    NEXT_PUBLIC_APP_URL: string;
    NEXT_PUBLIC_API_URL: string;
    NEXT_PUBLIC_IMAGE_URL: string;
    API_LOGIN_URL: string;
    AUTH_SECRET: string;
  }
}
