import type { OrderInterface } from "@/features/order/repositories/order.interface.ts";
import type { Order, PaymentWithOrder, ProcessedWebhook, UpdateOrderData } from "@/features/order/order.dto.ts";
import type { CreateOrderData } from "@/features/order/order.type.ts";
import { db, type DbTransaction } from "@/shared/db";
import { orders, payments, processedWebhook, ticketTypes } from "@/shared/db/schemas";
import { eq, sql, and } from "drizzle-orm";
import type { TicketType } from "@/features/ticket-type/ticket-type.dto.ts";
import type { Payment, UpdatePaymentData } from "@/features/payment/payment.dto.ts";

export class OrderRepository implements OrderInterface {
  async createOrder(tx: DbTransaction, data: CreateOrderData): Promise<Order | undefined> {
    const [order] = await tx.insert(orders).values(data).returning();
    return order;
  }

  async getTicketType(id: string): Promise<TicketType | undefined> {
    const [ticketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, id));
    return ticketType;
  }

  async updateTicketTypeQuantitySold(tx: DbTransaction, id: string, quantity: number): Promise<TicketType | undefined> {
    const [updatedTicketType] = await tx
      .update(ticketTypes)
      .set({ quantitySold: sql`${ticketTypes.quantitySold} + ${quantity}` })
      .where(
        and(
          eq(ticketTypes.id, id),
          sql`${ticketTypes.quantityTotal} - ${ticketTypes.quantitySold} >= ${quantity}`,
        ),
      )
      .returning();
    return updatedTicketType;
  }

  async releaseTicketTypeQuantitySold(tx: DbTransaction, id: string, quantity: number): Promise<TicketType | undefined> {
    const [updatedTicketType] = await tx
      .update(ticketTypes)
      .set({ quantitySold: sql`GREATEST(0, ${ticketTypes.quantitySold} - ${quantity})` })
      .where(eq(ticketTypes.id, id))
      .returning();
    return updatedTicketType;
  }

  async getProcessedWebhook(referenceId: string): Promise<ProcessedWebhook | undefined> {
    const [processedWebhookData] = await db.select().from(processedWebhook).where(eq(processedWebhook.referenceId, referenceId));
    return processedWebhookData;
  }

  async createProcessedWebhook(tx: DbTransaction, referenceId: string): Promise<ProcessedWebhook | undefined> {
    const [result] = await tx.insert(processedWebhook).values({ referenceId }).returning();
    return result;
  }

  async getPaymentByReferenceId(referenceId: string): Promise<PaymentWithOrder | undefined> {
    const payment = await db.query.payments.findFirst({
      where: eq(payments.referenceId, referenceId),
      with: {
        order: true,
      },
    });
    return payment;
  }

  async getOrderById(id: string): Promise<Order | undefined> {
    const [order] = await db.select().from(orders).where(eq(orders.id, id));
    return order;
  }

  async updatePaymentStatus(tx: DbTransaction, id: string, data: UpdatePaymentData): Promise<Payment | undefined> {
    const [payment] = await tx.update(payments).set(data).where(eq(payments.id, id)).returning();
    return payment;
  }

  async updateOrderStatus(tx: DbTransaction, id: string, data: UpdateOrderData): Promise<Order | undefined> {
    const [order] = await tx.update(orders).set(data).where(eq(orders.id, id)).returning();
    return order;
  }
}