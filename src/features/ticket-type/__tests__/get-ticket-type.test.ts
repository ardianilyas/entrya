import { beforeAll, describe, expect, it } from "vitest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { ticketTypeFactory } from "@/features/ticket-type/__tests__/helpers/ticket-type.factory.ts";
import request from "supertest";
import app from "@/server.ts";
import { INVALID_ID } from "@/shared/constants/test.constant.ts";

describe("GET /api/ticket-types/:id", () => {
  let user: ReturnType<typeof request.agent>;
  let ticketTypeId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate("organizer");
    const { ticketType } = await ticketTypeFactory(userId);

    user = agent;
    ticketTypeId = ticketType[0]?.id ?? "";
  });

  it('should return 401 when user is unauthorized', async () => {
    const response = await request(app).get(`/api/ticket-types/${ticketTypeId}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe("Unauthorized");
  });

  it('should return 404 when event type not found', async () => {
    const response = await user.get(`/api/ticket-types/${INVALID_ID}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Ticket type not found");
  });

  it('should return 200 when event type found', async () => {
    const response = await user.get(`/api/ticket-types/${ticketTypeId}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBeInstanceOf(Object);
  });
});