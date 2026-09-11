import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const processedWebhook = pgTable("processed_webhooks", {
  referenceId: text("reference_id").notNull().unique(),
  processedAt: timestamp("processed_at").notNull().defaultNow(),
});
