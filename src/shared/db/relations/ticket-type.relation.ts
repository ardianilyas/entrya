import { relations } from "drizzle-orm";
import { events, tickets, ticketTypes } from "@/shared/db/schemas";

export const ticketTypeRelation = relations(ticketTypes, ({ one, many }) => ({
  event: one(events, {
    fields: [ticketTypes.eventId],
    references: [events.id]
  }),
  tickets: many(tickets)
}))