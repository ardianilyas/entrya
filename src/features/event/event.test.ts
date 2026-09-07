import { beforeAll, describe, expect, it } from "vitest";
import { seedOrganizers } from "@/shared/seeder/organizer.seeder.ts";
import { seedEvent } from "@/shared/seeder/event.seeder.ts";
import type { CreateEventDto } from "@/features/event/event.dto.ts";
import request from "supertest";
import app from "@/server.ts";
import { EVENT_TEST_ROUTE } from "@/features/event/event.constant.ts";
import { authenticate } from "../../../tests/helpers/auth.helper.ts";
import { INVALID_ID, VALIDATION_ERROR } from "@/shared/constants/test.constant.ts";

describe("Event endpoint", () => {
  let eventId: string;
  let payload: CreateEventDto;

  beforeAll(async () => {
    await seedOrganizers(1);
    const events = await seedEvent();

    eventId = events[0]?.id ?? "";

    const twoDaysLater = new Date();
    twoDaysLater.setDate(twoDaysLater.getDate() + 2);

    payload = {
      title: "Test event",
      description: "Test description",
      venue: "Test venue",
      location: "Test location",
      startAt: new Date(),
      endAt: twoDaysLater,
    }
  });

  describe("GET /api/events", () => {
    it('should return 200 and fetch events', async () => {
      const response = await request(app).get(EVENT_TEST_ROUTE.GET_EVENTS_PUBLIC);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Event list");
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });

  describe("GET /api/events/organizer", () => {
    it("should return 401 when user is unauthorized", async () => {
      const response = await request(app).get(EVENT_TEST_ROUTE.GET_EVENTS_ORGANIZER);

      expect(response.status).toBe(401);
    });

    it('should return 200 when user is authorized', async () => {
      const { agent, userId } = await authenticate("organizer");
      await seedOrganizers(1, { userIds: [userId] });
      const response = await agent.get(EVENT_TEST_ROUTE.GET_EVENTS_ORGANIZER);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Event list");
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });

  describe("POST /api/events/organizer", () => {
    it("should return 401 when user is unauthorized", async () => {
      const response = await request(app).get(EVENT_TEST_ROUTE.CREATE_EVENT_ORGANIZER);

      expect(response.status).toBe(401);
    });

    it('should return 400 when data is invalid', async () => {
      const { agent } = await authenticate("organizer");
      const response = await agent.post(EVENT_TEST_ROUTE.CREATE_EVENT_ORGANIZER).send({});

      expect(response.status).toBe(400);
      expect(response.body.message).toBe(VALIDATION_ERROR);
      expect(response.body.errors).toBeInstanceOf(Object);
    });

    it('should return 200 when data is valid', async () => {
      const { agent, userId } = await authenticate("organizer");
      await seedOrganizers(1, { userIds: [userId] });
      const response = await agent.post(EVENT_TEST_ROUTE.CREATE_EVENT_ORGANIZER).send(payload);

      console.log('STATUS:', response.status);
      console.log('BODY:', JSON.stringify(response.body, null, 2));

      expect(response.status).toBe(201);
      expect(response.body.message).toBe("Event created");
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });

  describe("GET /api/events/organizer/:id", () => {
   it('should return 404 when event not found', async () => {
     const { agent } = await authenticate("organizer");
     const response = await agent.get(EVENT_TEST_ROUTE.GET_EVENT_ORGANIZER(INVALID_ID));

     expect(response.status).toBe(404);
     expect(response.body.message).toBe("Event not found");
   });

   it('should return 200 when event found', async () => {
     const { agent } = await authenticate("organizer");
     const response = await agent.get(EVENT_TEST_ROUTE.GET_EVENT_ORGANIZER(eventId));

     expect(response.status).toBe(200);
     expect(response.body.message).toBe("Event details");
     expect(response.body.data).toBeDefined();
     expect(response.body.data).toBeInstanceOf(Object);
   });
  });

  describe("PATCH /api/events/organizer/:id", () => {
    it('should return 404 when event not found', async () => {
      const { agent } = await authenticate("organizer");
      const response = await agent.patch(EVENT_TEST_ROUTE.UPDATE_EVENT_ORGANIZER(INVALID_ID)).send(payload);

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });

    it('should return 200 when event found', async () => {
      const { agent } = await authenticate("organizer");
      const response = await agent.patch(EVENT_TEST_ROUTE.UPDATE_EVENT_ORGANIZER(eventId)).send(payload);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe("Event updated");
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Object);
    });
  });

  describe("DELETE /api/events/organizer/:id", () => {
    it('should return 404 when event not found', async () => {
      const { agent } = await authenticate("organizer");
      const response = await agent.delete(EVENT_TEST_ROUTE.DELETE_EVENT_ORGANIZER(INVALID_ID));

      expect(response.status).toBe(404);
      expect(response.body.message).toBe("Event not found");
    });

    it('should return 200 when event found and deleted', async () => {
     const { agent } = await authenticate("organizer");
     const response = await agent.delete(EVENT_TEST_ROUTE.DELETE_EVENT_ORGANIZER(eventId));

     expect(response.status).toBe(200);
     expect(response.body.message).toBe("Event deleted");
    });
  });
})