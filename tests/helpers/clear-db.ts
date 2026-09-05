// import { sql } from "drizzle-orm";
import { reset } from "drizzle-seed";
import * as schema from "@/shared/db/schemas";
import { db } from "@/shared/db";

export async function clearDb() {
  await reset(db, schema);
}
