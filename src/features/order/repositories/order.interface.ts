import type { Order, PaymentWithOrder, ProcessedWebhook, UpdateOrderData } from "@/features/order/order.dto.ts";
import type { CreateOrderData } from "@/features/order/order.type.ts";
import type { TicketType } from "@/features/ticket-type/ticket-type.dto.ts";
import type { DbTransaction } from "@/shared/db";
import type { Payment, UpdatePaymentData } from "@/features/payment/payment.dto.ts";

export interface OrderInterface {
  createOrder(tx: DbTransaction, data: CreateOrderData): Promise<Order | undefined>;
  getTicketType(id: string): Promise<TicketType | undefined>;
  updateTicketTypeQuantitySold(tx: DbTransaction, id: string, quantity: number): Promise<TicketType | undefined>;
  releaseTicketTypeQuantitySold(tx: DbTransaction, id: string, quantity: number): Promise<TicketType | undefined>;
  getProcessedWebhook(referenceId: string): Promise<ProcessedWebhook | undefined>;
  createProcessedWebhook(tx: DbTransaction, referenceId: string): Promise<ProcessedWebhook | undefined>;
  getPaymentByReferenceId(referenceId: string): Promise<PaymentWithOrder | undefined>;
  getOrderById(id: string): Promise<Order | undefined>;
  updatePaymentStatus(tx: DbTransaction, id: string, data: UpdatePaymentData): Promise<Payment | undefined>;
  updateOrderStatus(tx: DbTransaction, id: string, data: UpdateOrderData): Promise<Order | undefined>;
}

