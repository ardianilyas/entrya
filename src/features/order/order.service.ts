import type { OrderRepository } from "@/features/order/repositories/order.repository.ts";
import type { CreateOrderCommand } from "@/features/order/order.type.ts";
import { NotFoundError } from "@/shared/errors/not-found.ts";
import { BadRequestError } from "@/shared/errors/bad-request.ts";
import { db } from "@/shared/db";

export class OrderService {
  constructor(private readonly orderRepository: OrderRepository) {}

  async createOrder(data: CreateOrderCommand) {
    const ticketType = await this.orderRepository.getTicketType(data.ticketTypeId);

    if (!ticketType) throw new NotFoundError("Ticket type not found");

    if (ticketType.eventId !== data.eventId) throw new NotFoundError("Ticket type not found. Invalid event");

    const availableTicket = ticketType.quantityTotal - ticketType.quantitySold;

    if (availableTicket < data.quantity) throw new BadRequestError("Not enough tickets available");

    const totalAmount = ticketType.price * data.quantity;

    const expiresAt = new Date(Date.now() + 8 * 60 * 1000);

    return db.transaction(async (tx) => {
      const order = await this.orderRepository.createOrder(tx, {
        ...data,
        totalAmount,
        expiresAt
      });

      const updatedTicketType = await this.orderRepository.updateTicketTypeQuantitySold(tx, data.ticketTypeId, data.quantity);

      if (!updatedTicketType) throw new BadRequestError("Not enough tickets available")

      return order;
    })
  }
}