import { boolean, integer, numeric, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { events } from "@/shared/db/schemas/event.schema.ts";

export const ticketTypes = pgTable("ticket_types", {
  id: uuid("id").primaryKey().defaultRandom(),
  eventId: uuid("event_id").notNull().references(() => events.id),

  name: varchar("name").notNull(),
  description: text("description").notNull(),

  price: numeric("price", { precision: 12, scale: 2, mode: "number" }).notNull(),

  quantityTotal: integer("quantity_total").notNull(),
  quantitySold: integer("quantity_sold").notNull().default(0),

  saleStartAt: timestamp("sale_start_at", { withTimezone: true }),
  saleEndAt: timestamp("sale_end_at", { withTimezone: true }),

  isActive: boolean("is_active").notNull().default(true),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});