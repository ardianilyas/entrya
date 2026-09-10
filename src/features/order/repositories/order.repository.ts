import type { OrderInterface } from "@/features/order/repositories/order.interface.ts";
import type { Order } from "@/features/order/order.dto.ts";
import type { CreateOrderData } from "@/features/order/order.type.ts";
import { db, type DbTransaction } from "@/shared/db";
import { orders, ticketTypes } from "@/shared/db/schemas";
import { eq, sql, and } from "drizzle-orm";
import type { TicketType } from "@/features/ticket-type/ticket-type.dto.ts";

export class OrderRepository implements OrderInterface {
  async createOrder(tx: DbTransaction, data: CreateOrderData): Promise<Order | undefined> {
    const [order] = await tx.insert(orders).values(data).returning();
    return order;
  }

  async getTicketType(id: string): Promise<TicketType | undefined> {
    const [ticketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, id));
    return ticketType;
  }

  async updateTicketTypeQuantitySold(tx: DbTransaction, id: string, quantity: number) {
    const [updatedTicketType] = await tx
      .update(ticketTypes)
      .set({ quantitySold: sql`${ticketTypes.quantitySold} + ${quantity}` })
      .where(
      and(
        eq(ticketTypes.id, id),
        sql`${ticketTypes.quantityTotal} - ${ticketTypes.quantitySold} >= ${quantity}`,
      ),
    ).returning();
    return updatedTicketType;
  }
}