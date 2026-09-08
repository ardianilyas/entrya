import { relations } from "drizzle-orm";
import { events, orders, organizers } from "@/shared/db/schemas";

export const eventRelation = relations(events, ({ one, many }) => ({
  organizer: one(organizers, {
    fields: [events.organizerId],
    references: [organizers.id]
  }),
  orders: many(orders)
}));