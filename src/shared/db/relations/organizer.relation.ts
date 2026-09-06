import { relations } from "drizzle-orm";
import { organizer } from "@/shared/db/schemas/organizer.schema.ts";
import { user } from "@/shared/db/schemas";

export const organizerRelation = relations(organizer, ({ one }) => ({
  user: one(user, {
    fields: [organizer.userId],
    references: [user.id]
  })
}));
