import { relations } from "drizzle-orm";
import { events, orders, payments, ticketTypes, user } from "@/shared/db/schemas";

export const orderRelation = relations(orders, ({ one, many }) => ({
  user: one(user, {
    fields: [orders.userId],
    references: [user.id]
  }),
  event: one(events, {
    fields: [orders.eventId],
    references: [events.id]
  }),
  ticketType: one(ticketTypes, {
    fields: [orders.ticketTypeId],
    references: [ticketTypes.id]
  }),
  payment: one(payments)
}));