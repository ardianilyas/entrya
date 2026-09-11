import { z } from "zod";
import { orders, processedWebhook } from "@/shared/db/schemas";

import type { Payment } from "@/features/payment/payment.dto.ts";

export type Order = typeof orders.$inferSelect;
export type UpdateOrderData = Partial<typeof orders.$inferInsert>;
export type ProcessedWebhook = typeof processedWebhook.$inferSelect;
export type PaymentWithOrder = Payment & {
  order: Order | null;
};

export const createOrderDto = z.object({
  eventId: z.uuid({ error: "Invalid id" }),
  ticketTypeId: z.uuid({ error: "Invalid id" }),
  quantity: z.number({ error: "Invalid quantity" }),
});

const paymentDataDto = z.object({
  slug: z.string().optional(),
  reference_id: z.string(),
  order_id: z.string().optional(),
  status: z.string().optional(),
  amount: z.number().int().positive().optional(),
  fee: z.number().int().nonnegative().optional(),
  merchant_receives: z.number().int().positive().optional(),
  method: z.string().optional(),
}).passthrough();

export const borderpayWebhookDto = z.object({
  event: z.enum(["payment.paid", "payment.expired", "payment.failed"]),
  mode: z.literal('live').or(z.literal('test')).optional(),
  data: paymentDataDto,
}).passthrough();

export const getOrderDto = z.uuid({ error: "Invalid id" });

export type CreateOrderDto = z.infer<typeof createOrderDto>;
export type GetOrderDto = z.infer<typeof getOrderDto>;
export type BorderpayWebhookDto = z.infer<typeof borderpayWebhookDto>;