import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { env } from "../config/env.ts";
import * as schemas from "./schemas";
import * as relations from "./relations";

const pool = new pg.Pool({
  connectionString: env.DATABASE_URL,
});

export const db = drizzle(pool, {
  schema: {
    ...schemas,
    ...relations
  }
});

export type DbTransaction = Parameters<
  Parameters<typeof db.transaction>[0]
>[0];
