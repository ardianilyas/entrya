import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { ticketTypes } from "@/shared/db/schemas";
import { ticketStatusEnum } from "@/shared/db/schemas/enums.schema";

export const tickets = pgTable("tickets", {
  id: uuid("id").primaryKey().defaultRandom(),
  ticketTypeId: uuid("ticket_type_id").notNull().references(() => ticketTypes.id),

  attendeeId: text("attendee_id").notNull(),
  code: text("code").notNull(),

  status: ticketStatusEnum("status").default("AVAILABLE"),

  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().$onUpdate(() => new Date()),
});
