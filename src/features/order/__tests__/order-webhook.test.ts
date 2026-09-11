import { beforeAll, describe, expect, it } from "vitest";
import request from "supertest";
import app from "@/server.ts";
import { orderFactory } from "@/features/order/__tests__/helpers/order.factory.ts";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { db } from "@/shared/db";
import { orders, payments, processedWebhook, ticketTypes } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";
import { env } from "@/shared/config/env.ts";

describe("POST /api/orders/webhook", () => {
  const WEBHOOK_TOKEN = env.BORDERPAY_WEBHOOK_TOKEN;

  let eventId: string;
  let ticketTypeId: string;
  let userAgent: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const { agent } = await authenticate();
    const { event, ticketType } = await orderFactory();

    eventId = event[0]?.id ?? "";
    ticketTypeId = ticketType[0]?.id ?? "";
    userAgent = agent;
  });

  it("should return 401 when x-borderpay-token is missing", async () => {
    const response = await request(app)
      .post("/api/orders/webhook")
      .send({
        event: "payment.paid",
        mode: "test",
        data: {
          reference_id: "ENTRYA-test-ref",
          amount: 10000,
        },
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid webhook token");
  });

  it("should return 401 when x-borderpay-token is invalid", async () => {
    const response = await request(app)
      .post("/api/orders/webhook")
      .set("x-borderpay-token", "invalid-token")
      .send({
        event: "payment.paid",
        mode: "test",
        data: {
          reference_id: "ENTRYA-test-ref",
          amount: 10000,
        },
      });

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Invalid webhook token");
  });

  it("should return 404 when payment is not found", async () => {
    const response = await request(app)
      .post("/api/orders/webhook")
      .set("x-borderpay-token", WEBHOOK_TOKEN)
      .send({
        event: "payment.paid",
        mode: "test",
        data: {
          reference_id: "ENTRYA-non-existent",
          amount: 10000,
        },
      });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Payment not found");
  });

  it("should process payment.paid event successfully and update order & payment status", async () => {
    // 1. Create order
    const createOrderRes = await userAgent.post("/api/orders").send({
      eventId,
      ticketTypeId,
      quantity: 2,
    });

    expect(createOrderRes.status).toBe(201);
    const { order, payment } = createOrderRes.body.data;
    const referenceId = payment.referenceId;

    // 2. Send webhook for payment.paid
    const webhookRes = await request(app)
      .post("/api/orders/webhook")
      .set("x-borderpay-token", WEBHOOK_TOKEN)
      .send({
        event: "payment.paid",
        mode: "test",
        data: {
          reference_id: referenceId,
          amount: payment.amount,
          order_id: order.id,
          status: "PAID",
        },
      });

    expect(webhookRes.status).toBe(200);
    expect(webhookRes.body.message).toBe("Webhook processed successfully");

    // 3. Verify in DB
    const [updatedPayment] = await db.select().from(payments).where(eq(payments.id, payment.id));
    const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, order.id));
    const [processed] = await db.select().from(processedWebhook).where(eq(processedWebhook.referenceId, referenceId));

    expect(updatedPayment?.status).toBe("PAID");
    expect(updatedPayment?.paidAt).toBeDefined();
    expect(updatedOrder?.status).toBe("PAID");
    expect(updatedOrder?.paidAt).toBeDefined();
    expect(processed?.referenceId).toBe(referenceId);
  });

  it("should return early when duplicate webhook arrives (idempotency)", async () => {
    // 1. Create order
    const createOrderRes = await userAgent.post("/api/orders").send({
      eventId,
      ticketTypeId,
      quantity: 1,
    });

    const { payment } = createOrderRes.body.data;
    const referenceId = payment.referenceId;

    // 2. Send webhook first time
    const webhookRes1 = await request(app)
      .post("/api/orders/webhook")
      .set("x-borderpay-token", WEBHOOK_TOKEN)
      .send({
        event: "payment.paid",
        mode: "test",
        data: {
          reference_id: referenceId,
          amount: payment.amount,
        },
      });

    expect(webhookRes1.status).toBe(200);

    // 3. Send webhook second time with same reference_id
    const webhookRes2 = await request(app)
      .post("/api/orders/webhook")
      .set("x-borderpay-token", WEBHOOK_TOKEN)
      .send({
        event: "payment.paid",
        mode: "test",
        data: {
          reference_id: referenceId,
          amount: payment.amount,
        },
      });

    expect(webhookRes2.status).toBe(200);
    expect(webhookRes2.body.data.message).toBe("Webhook already processed");
  });

  it("should process payment.expired event and release ticket inventory", async () => {
    // Check initial quantitySold
    const [initialTicketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, ticketTypeId));
    const initialSold = initialTicketType?.quantitySold ?? 0;

    // 1. Create order for 2 tickets
    const createOrderRes = await userAgent.post("/api/orders").send({
      eventId,
      ticketTypeId,
      quantity: 2,
    });

    const { order, payment } = createOrderRes.body.data;
    const referenceId = payment.referenceId;

    const [afterOrderTicketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, ticketTypeId));
    expect(afterOrderTicketType?.quantitySold).toBe(initialSold + 2);

    // 2. Send payment.expired webhook
    const webhookRes = await request(app)
      .post("/api/orders/webhook")
      .set("x-borderpay-token", WEBHOOK_TOKEN)
      .send({
        event: "payment.expired",
        mode: "test",
        data: {
          reference_id: referenceId,
          amount: payment.amount,
        },
      });

    expect(webhookRes.status).toBe(200);

    // 3. Verify status and quantitySold reverted
    const [updatedPayment] = await db.select().from(payments).where(eq(payments.id, payment.id));
    const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, order.id));
    const [revertedTicketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, ticketTypeId));

    expect(updatedPayment?.status).toBe("EXPIRED");
    expect(updatedOrder?.status).toBe("EXPIRED");
    expect(revertedTicketType?.quantitySold).toBe(initialSold);
  });

  it("should process payment.failed event and release ticket inventory", async () => {
    // Check initial quantitySold
    const [initialTicketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, ticketTypeId));
    const initialSold = initialTicketType?.quantitySold ?? 0;

    // 1. Create order for 1 ticket
    const createOrderRes = await userAgent.post("/api/orders").send({
      eventId,
      ticketTypeId,
      quantity: 1,
    });

    const { order, payment } = createOrderRes.body.data;
    const referenceId = payment.referenceId;

    // 2. Send payment.failed webhook
    const webhookRes = await request(app)
      .post("/api/orders/webhook")
      .set("x-borderpay-token", WEBHOOK_TOKEN)
      .send({
        event: "payment.failed",
        mode: "test",
        data: {
          reference_id: referenceId,
          amount: payment.amount,
        },
      });

    expect(webhookRes.status).toBe(200);

    // 3. Verify status and quantitySold reverted
    const [updatedPayment] = await db.select().from(payments).where(eq(payments.id, payment.id));
    const [updatedOrder] = await db.select().from(orders).where(eq(orders.id, order.id));
    const [revertedTicketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, ticketTypeId));

    expect(updatedPayment?.status).toBe("CANCELLED");
    expect(updatedOrder?.status).toBe("CANCELLED");
    expect(revertedTicketType?.quantitySold).toBe(initialSold);
  });
});
