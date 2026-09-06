import { pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { organizers } from "@/shared/db/schemas/organizer.schema.ts";
import { eventStatusEnum } from "@/shared/db/schemas/enums.schema.ts";

export const events = pgTable("events", {
  id: uuid("id").primaryKey().defaultRandom(),
  organizerId: uuid("organizer_id").notNull().references(() => organizers.id),

  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),

  venue: varchar("venue", { length: 255 }).notNull(),
  location: text("location").notNull(),
  status: eventStatusEnum("status").default("DRAFT"),

  startAt: timestamp("start_at").notNull(),
  endAt: timestamp("end_at").notNull(),

  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow().$onUpdate(() => new Date()),
});
