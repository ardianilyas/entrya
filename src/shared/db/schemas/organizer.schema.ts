import { boolean, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "@/shared/db/schemas/users.schema.ts";
import { organizerStatusEnum } from "@/shared/db/schemas/enums.schema.ts";

export const organizers = pgTable("organizers", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  bio: text("description"),
  isVerified: boolean("is_verified").default(false),
  status: organizerStatusEnum().notNull().default("PENDING"),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()).notNull(),
});
