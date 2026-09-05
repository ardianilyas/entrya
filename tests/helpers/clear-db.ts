import { sql } from "drizzle-orm";
import { db } from "@/shared/db";

export async function clearDb() {
  await db.execute(
    sql.raw(`
      TRUNCATE TABLE
      organizers
      RESTART IDENTITY
      CASCADE;
    `)
  );
}