import type { Order } from "@/features/order/order.dto.ts";
import type { CreateOrderData } from "@/features/order/order.type.ts";
import type { TicketType } from "@/features/ticket-type/ticket-type.dto.ts";
import type { DbTransaction } from "@/shared/db";

export interface OrderInterface {
  createOrder(tx: DbTransaction, data: CreateOrderData): Promise<Order | undefined>;
  getTicketType(id: string): Promise<TicketType | undefined>;
  updateTicketTypeQuantitySold(tx: DbTransaction, id: string, quantity: number): Promise<TicketType | undefined>;
}