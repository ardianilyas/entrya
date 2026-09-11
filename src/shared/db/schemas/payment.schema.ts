import { numeric, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core";
import { orders } from "@/shared/db/schemas/order.schema.ts";
import { paymentProviderEnum, paymentStatusEnum } from "@/shared/db/schemas/enums.schema.ts";

export const payments = pgTable("payments", {
  id: uuid("id").defaultRandom().primaryKey(),
  orderId: uuid("order_id").notNull().references(() => orders.id),
  amount: numeric("amount", { precision: 12, scale: 2, mode: "number" }).notNull(),
  provider: paymentProviderEnum("provider").notNull(),
  referenceId: varchar("reference_id").notNull(),
  status: paymentStatusEnum("status").notNull().default("PENDING"),
  currency: varchar("currency").notNull().default("IDR"),
  qrString: varchar("qr_string"),
  pay_url: varchar("pay_url"),
  paidAt: timestamp("pais_at"),
  expiredAt: timestamp("expired_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date())
});
