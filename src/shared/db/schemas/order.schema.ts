import { integer, numeric, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { user } from "@/shared/db/schemas/users.schema.ts";
import { events } from "@/shared/db/schemas/event.schema.ts";
import { ticketTypes } from "@/shared/db/schemas/ticket-type.schema.ts";
import { orderStatusEnum } from "@/shared/db/schemas/enums.schema.ts";

export const orders = pgTable("orders", {
  id: uuid("id").primaryKey().defaultRandom(),

  userId: text("user_id").notNull().references(() => user.id),

  eventId: uuid("event_id").notNull().references(() => events.id),

  ticketTypeId: uuid("ticket_type_id").notNull().references(() => ticketTypes.id),

  quantity: integer("quantity").notNull(),

  totalAmount: numeric("total_amount", {
    precision: 12,
    scale: 2,
    mode: "number",
  }).notNull(),

  status: orderStatusEnum("status").notNull().default("PENDING"),

  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  paidAt: timestamp("paid_at", { withTimezone: true }),

  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
});
