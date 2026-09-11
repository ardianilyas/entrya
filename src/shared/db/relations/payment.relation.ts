import { relations } from "drizzle-orm";
import { orders, payments } from "@/shared/db/schemas";

export const paymentRelation = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id]
  }),
}));
