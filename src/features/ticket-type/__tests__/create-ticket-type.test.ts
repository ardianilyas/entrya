import { beforeAll, describe, expect, it } from "vitest";
import type { CreateTicketTypeDto } from "@/features/ticket-type/ticket-type.dto.ts";
import { authenticate } from "../../../../tests/helpers/auth.helper.ts";
import { ticketTypeFactory } from "@/features/ticket-type/__tests__/helpers/ticket-type.factory.ts";
import request from "supertest";
import app from "@/server.ts";
import { AUTH_MESSAGE } from "@/shared/constants/auth.constants.ts";
import { VALIDATION_ERROR } from "@/shared/constants/test.constant.ts";
import { createTicketTypePayload } from "@/features/ticket-type/__tests__/helpers/payload.ts";

describe("POST /api/ticket-types", () => {
  let payload: CreateTicketTypeDto;
  let user: ReturnType<typeof request.agent>;

  beforeAll(async () => {
    const { agent, userId } = await authenticate("organizer");
    const { event } = await ticketTypeFactory(userId);

    user = agent;

    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    payload = createTicketTypePayload(event[0]?.id ?? "");
  });

  it('should return 401 when user is unauthorized', async () => {
    const response = await request(app).post('/api/ticket-types').send(payload);

    expect(response.status).toBe(401);
    expect(response.body.message).toBe(AUTH_MESSAGE.UNAUTHORIZED);
  });

  it('should return 400 when data is invalid or empty', async () => {
    const response = await user.post(`/api/ticket-types`).send({});

    expect(response.status).toBe(400);
    expect(response.body.message).toBe(VALIDATION_ERROR);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors).toBeInstanceOf(Object);
  });

  it('should return 201 when data is valid and created', async () => {
    const response = await user.post(`/api/ticket-types`).send(payload);

    expect(response.status).toBe(201);
    expect(response.body.message).toBeDefined();
    expect(response.body.data).toBeDefined();
  });
})