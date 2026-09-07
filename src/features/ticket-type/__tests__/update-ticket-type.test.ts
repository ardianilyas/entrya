import { beforeAll, describe, expect, it } from "vitest";
import type { UpdateTicketTypeDto } from "@/features/ticket-type/ticket-type.dto.ts";
import request from "supertest";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { ticketTypeFactory } from "@/features/ticket-type/__tests__/helpers/ticket-type.factory.ts";
import app from "@/server.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { updateTicketTypePayload } from "@/features/ticket-type/__tests__/helpers/payload.ts";
import { INVALID_ID } from "@/shared/constants/test.constant.ts";

describe("PATCH /api/ticket-types/:id", () => {
  let payload: UpdateTicketTypeDto;
  let user: ReturnType<typeof request.agent>;
  let ticketTypeId: string;

  beforeAll(async () => {
    const { agent, userId } = await authenticate("organizer");
    const { ticketType } = await ticketTypeFactory(userId);

    user = agent;
    ticketTypeId = ticketType[0]?.id ?? "";

    payload = updateTicketTypePayload();
  });

  it('shoulr return 401 when user is unauthorized', async () => {
    const response = await request(app).patch(`/api/ticket-types/${ticketTypeId}`).send(payload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 404 when ticket type not found', async () => {
    const response = await user.patch(`/api/ticket-types/${INVALID_ID}`).send(payload);

    expect(response.status).toBe(404);
    expect(response.body.message).toBe("Ticket type not found");
  });

  it('should return 200 whdn data is valid', async () => {
    const response = await user.patch(`/api/ticket-types/${ticketTypeId}`).send(payload);

    expect(response.status).toBe(200);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
    expect(response.body.data).toBeInstanceOf(Object);
  });
})