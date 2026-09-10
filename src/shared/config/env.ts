import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  PORT: z.string({
    error: "PORT is required",
  }),

  DATABASE_URL: z.string({
    error: "DATABASE_URL is required",
  }),

  BETTER_AUTH_SECRET: z.string({
    error: "BETTER_AUTH_SECRET is required",
  }),

  BETTER_AUTH_URL: z.string({
    error: "BETTER_AUTH_URL is required",
  }),

  BORDERPAY_API_URL: z.string({
    error: "BORDERPAY_API_URL is required",
  }),

  BORDERPAY_API_KEY: z.string({
    error: "BORDERPAY_API_KEY is required",
  }),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    "Invalid environment variables:",
    z.prettifyError(parsedEnv.error)
  );

  process.exit(1);
}

export const env = parsedEnv.data;