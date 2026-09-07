import { relations } from "drizzle-orm";
import { tickets, ticketTypes } from "@/shared/db/schemas";

export const ticketRelation = relations(tickets, ({ one }) => ({
  ticketType: one(ticketTypes, {
    fields: [tickets.ticketTypeId],
    references: [ticketTypes.id]
  })
}))