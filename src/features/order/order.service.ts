import type { OrderRepository } from "@/features/order/repositories/order.repository.ts";
import type { CreateOrderCommand } from "@/features/order/order.type.ts";
import { NotFoundError } from "@/shared/errors/not-found.ts";
import { BadRequestError } from "@/shared/errors/bad-request.ts";
import { db } from "@/shared/db";
import type { PaymentRepository } from "@/features/payment/repositories/payment.repository.ts";
import { borderpayClient } from "@/shared/lib/borderpay.client.ts";
import type { BorderpayWebhookDto, Order } from "@/features/order/order.dto.ts";
import type { Payment } from "@/features/payment/payment.dto.ts";

export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly paymentRepository: PaymentRepository
  ) {}

  async createOrder(data: CreateOrderCommand) {
    const ticketType = await this.orderRepository.getTicketType(data.ticketTypeId);

    if (!ticketType) throw new NotFoundError("Ticket type not found");

    if (ticketType.eventId !== data.eventId) throw new NotFoundError("Ticket type not found. Invalid event");

    const availableTicket = ticketType.quantityTotal - ticketType.quantitySold;

    if (availableTicket < data.quantity) throw new BadRequestError("Not enough tickets available");

    const totalAmount = ticketType.price * data.quantity;

    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
    const referenceId = `ENTRYA-${crypto.randomUUID()}`;

    const { order, payment } = await db.transaction(async (tx) => {
      const order = await this.orderRepository.createOrder(tx, {
        ...data,
        totalAmount,
        expiresAt
      });

      if (!order) throw new BadRequestError("Failed to create order");

      const updatedTicketType = await this.orderRepository.updateTicketTypeQuantitySold(tx, data.ticketTypeId, data.quantity);

      if (!updatedTicketType) throw new BadRequestError("Not enough tickets available");

      const payment = await this.paymentRepository.createPayment(tx, {
        amount: totalAmount,
        provider: "BORDERPAY",
        currency: "IDR",
        orderId: order.id,
        referenceId,
      });

      if (!payment) throw new BadRequestError("Failed to create payment");

      return { order, payment };
    });

    try {
      const borderpayPayment = await borderpayClient.createQrisPayment({
        amount: totalAmount,
        referenceId,
      });

      const updatedPayment = await this.paymentRepository.updatePayment(payment.id, {
        qrString: borderpayPayment.qr_string,
        expiredAt: new Date(borderpayPayment.expires_at)
      });
      
      return {
        order,
        payment: updatedPayment
      };
    } catch (e: any) {
      console.error(e);
      throw new Error(e.message);
    }
  }

  async orderWebhook(payload: BorderpayWebhookDto) {
    const { event, data } = payload;

    const processedWebhook = await this.orderRepository.getProcessedWebhook(data.reference_id);
    if (processedWebhook) {
      return { message: "Webhook already processed" };
    }

    const payment = await this.orderRepository.getPaymentByReferenceId(data.reference_id);
    if (!payment) throw new NotFoundError("Payment not found");

    const order = payment.order;
    if (!order) throw new NotFoundError("Order not found");

    switch (event) {
      case "payment.paid":
        return await this.handlePaymentPaid(payment, order, data.reference_id);
      case "payment.expired":
        return await this.handlePaymentExpired(payment, order, data.reference_id);
      case "payment.failed":
        return await this.handlePaymentFailed(payment, order, data.reference_id);
      default:
        return { message: `Unhandled event: ${event}` };
    }
  }

  private async handlePaymentPaid(payment: Payment, order: Order, referenceId: string) {
    return await db.transaction(async (tx) => {
      const updatedPayment = await this.orderRepository.updatePaymentStatus(tx, payment.id, {
        status: "PAID",
        paidAt: new Date(),
      });

      if (!updatedPayment) throw new BadRequestError("Failed to update payment");

      const updatedOrder = await this.orderRepository.updateOrderStatus(tx, order.id, {
        status: "PAID",
        paidAt: new Date(),
      });

      if (!updatedOrder) throw new BadRequestError("Failed to update order");

      await this.orderRepository.createProcessedWebhook(tx, referenceId);

      return { payment: updatedPayment, order: updatedOrder };
    });
  }

  private async handlePaymentExpired(payment: Payment, order: Order, referenceId: string) {
    if (payment.status === "PAID" || order.status === "PAID") {
      return { payment, order };
    }

    return await db.transaction(async (tx) => {
      const updatedPayment = await this.orderRepository.updatePaymentStatus(tx, payment.id, {
        status: "EXPIRED",
      });

      if (!updatedPayment) throw new BadRequestError("Failed to update payment");

      const updatedOrder = await this.orderRepository.updateOrderStatus(tx, order.id, {
        status: "EXPIRED",
      });

      if (!updatedOrder) throw new BadRequestError("Failed to update order");

      await this.orderRepository.releaseTicketTypeQuantitySold(tx, order.ticketTypeId, order.quantity);

      await this.orderRepository.createProcessedWebhook(tx, referenceId);

      return { payment: updatedPayment, order: updatedOrder };
    });
  }

  private async handlePaymentFailed(payment: Payment, order: Order, referenceId: string) {
    if (payment.status === "PAID" || order.status === "PAID") {
      return { payment, order };
    }

    return await db.transaction(async (tx) => {
      const updatedPayment = await this.orderRepository.updatePaymentStatus(tx, payment.id, {
        status: "CANCELLED",
      });

      if (!updatedPayment) throw new BadRequestError("Failed to update payment");

      const updatedOrder = await this.orderRepository.updateOrderStatus(tx, order.id, {
        status: "CANCELLED",
      });

      if (!updatedOrder) throw new BadRequestError("Failed to update order");

      await this.orderRepository.releaseTicketTypeQuantitySold(tx, order.ticketTypeId, order.quantity);

      await this.orderRepository.createProcessedWebhook(tx, referenceId);

      return { payment: updatedPayment, order: updatedOrder };
    });
  }
}