import { z } from "zod";
import { orders } from "@/shared/db/schemas";

export type Order = typeof orders.$inferSelect;

export const createOrderDto = z.object({
  eventId: z.uuid({ error: "Invalid id" }),
  ticketTypeId: z.uuid({ error: "Invalid id" }),
  quantity: z.number({ error: "Invalid quantity" }),
});

export const getOrderDto = z.uuid({ error: "Invalid id" });

export type CreateOrderDto = z.infer<typeof createOrderDto>;
export type GetOrderDto = z.infer<typeof getOrderDto>;
