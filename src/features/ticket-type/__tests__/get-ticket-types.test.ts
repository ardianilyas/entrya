import { beforeAll, describe, expect, it } from "vitest";
import app from "@/server.ts";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { INVALID_ID } from "@/shared/constants/test.constant.ts";
import { ticketTypeFactory } from "@/features/ticket-type/__tests__/helpers/ticket-type.factory.ts";

describe("GET /api/ticket-types/event/:eventTd", () => {
  let user: ReturnType<typeof request.agent>;
  let eventId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate("organizer");
    const { event } = await ticketTypeFactory(userId);

    user = agent;
    eventId = event[0]?.id ?? "";
  });

  it('should return 401 when user is unauthorized', async () => {
    const response = await request(app).get(`/api/ticket-types/event/${eventId}`);

    expect(response.status).toBe(401);
  });

  it("should return 404 when event id is invalid", async () => {
    const response = await user.get(`/api/ticket-types/event/${INVALID_ID}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Event not found");
  });

  it('should return 200 and return ticket types', async () => {
    const response = await user.get(`/api/ticket-types/event/${eventId}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBeInstanceOf(Array);
  });
});
