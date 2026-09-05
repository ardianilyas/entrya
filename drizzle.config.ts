import { defineConfig } from "drizzle-kit";
import { env } from "@/shared/config/env.ts";

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/shared/db/schemas/index.ts",
  out: "./drizzle",
  dbCredentials: {
    url: env.DATABASE_URL
  }
});
