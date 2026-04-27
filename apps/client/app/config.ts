// All config values come from environment variables - never hardcode secrets in source code
export const config = {
  url: process.env.API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "",
} as const;
