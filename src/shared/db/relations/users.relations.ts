import { relations } from "drizzle-orm";
import { account, session, user } from "@/shared/db/schemas";
import { organizers } from "@/shared/db/schemas";

export const userRelations = relations(user, ({ one, many }) => ({
  organizer: one(organizers),
  sessions: many(session),
  accounts: many(account),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const accountRelations = relations(account, ({ one }) => ({
  user: one(user, {
    fields: [account.userId],
    references: [user.id],
  }),
}));