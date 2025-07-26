declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: "dev" | "prod" | "test";
    NEXT_PUBLIC_API_URL: string;
  }
}
