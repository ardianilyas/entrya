import { seed } from "drizzle-seed";
import { db } from "@/shared/db";
import * as schema from "@/shared/db/schemas";

async function main() {
  await seed(db, schema).refine(() => ({
    user: {
      count: 10,
    }
  }));
}

main();