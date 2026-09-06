import { relations } from "drizzle-orm";
import { events, organizers } from "@/shared/db/schemas";

export const eventRelation = relations(events, ({ one }) => ({
  organizer: one(organizers, {
    fields: [events.organizerId],
    references: [organizers.id]
  }),
}));