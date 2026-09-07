import { beforeAll, describe, expect, it } from "vitest";
import { ticketTypeFactory } from "@/features/ticket-type/__tests__/helpers/ticket-type.factory.ts";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import request from "supertest";
import app from "@/server.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { INVALID_ID } from "@/shared/constants/test.constant.ts";

describe("DELETE /api/ticket-types/:id", () => {
  let ticketTypeId: string;
  let user: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const { agent, userId } = await authenticate("organizer");
    const { ticketType } = await ticketTypeFactory(userId);

    ticketTypeId = ticketType[0]?.id ?? "";
    user = agent;
  });

  it('should return 401 when user is unauthorized', async () => {
    const response = await request(app).delete(`/api/ticket-types/${ticketTypeId}`);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when ticket type not sound', async () => {
    const response = await user.delete(`/api/ticket-types/${INVALID_ID}`);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Ticket type not found");
    expect(response.body.data).toBeUndefined();
  });

  it('should return 200 when ticket type deleted', async () => {
    const response = await user.delete(`/api/ticket-types/${ticketTypeId}`);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Ticket type deleted");
    expect(response.body.data).toBeNull();
  });
});