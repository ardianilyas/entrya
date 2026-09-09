import type { CreateOrderDto } from "@/features/order/order.dto.ts";
import { orders } from "@/shared/db/schemas";

export type CreateOrderCommand = CreateOrderDto & {
  userId: string;
};

export type CreateOrderData = typeof orders.$inferInsert;
