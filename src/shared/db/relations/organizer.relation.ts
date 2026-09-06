import { relations } from "drizzle-orm";
import { organizers } from "@/shared/db/schemas/organizer.schema.ts";
import { events, user } from "@/shared/db/schemas";

export const organizerRelation = relations(organizers, ({ one, many }) => ({
  user: one(user, {
    fields: [organizers.userId],
    references: [user.id]
  }),
  events: many(events)
}));
