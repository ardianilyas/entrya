import { beforeAll, describe, expect, it } from "vitest";
import { orderFactory } from "@/features/order/__tests__/helpers/order.factory.ts";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import type { TicketType } from "@/features/ticket-type/ticket-type.dto.ts";
import { db } from "@/shared/db";
import { ticketTypes } from "@/shared/db/schemas";
import { eq } from "drizzle-orm";
import { INVALID_ID } from "@/shared/constants/test.constant.ts";

describe("POST /api/orders", () => {
  let eventId: string;
  let ticketTypeId: string;
  let ticketTypeData: TicketType | undefined;
  let user: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const { agent } = await authenticate();
    const { event, ticketType } = await orderFactory();

    ticketTypeData = ticketType[0];

    eventId = event[0]?.id ?? "";
    ticketTypeId = ticketType[0]?.id ?? "";

    user = agent
  });

  it('should return 404 when ticket type not found', async () => {
    const response = await user.post("/api/orders").send({
      eventId,
      ticketTypeId: INVALID_ID,
      quantity: 5
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Ticket type not found");
  });

  it('should return 404 when event not found', async () => {
    const response = await user.post("/api/orders").send({
      eventId: INVALID_ID,
      ticketTypeId,
      quantity: 5
    });

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Ticket type not found. Invalid event");
  });

  it('should return 400 when quantity is greater than available ticket', async () => {
    const response = await user.post("/api/orders").send({
      eventId,
      ticketTypeId,
      quantity: ticketTypeData?.quantityTotal! + 1
    });

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("Not enough tickets available");
  });

  it('should return 200 when data is valid and return order', async () => {
    const quantity = 5;
    const response = await user.post("/api/orders").send({
      eventId,
      ticketTypeId,
      quantity
    });

    const ticketTypeQuantitySoldAfter = ticketTypeData?.quantitySold! + quantity;

    const [updatedTicketType] = await db.select({ quantitySold: ticketTypes.quantitySold }).from(ticketTypes).where(eq(ticketTypes.id, ticketTypeId));

    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(ticketTypeQuantitySoldAfter).toBe(updatedTicketType?.quantitySold!);
  })
})