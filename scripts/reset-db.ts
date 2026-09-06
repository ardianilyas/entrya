import { reset } from "drizzle-seed";
import { db } from "@/shared/db";
import * as schema from "@/shared/db/schemas";

async function main() {
  await reset(db, schema);
}

main();