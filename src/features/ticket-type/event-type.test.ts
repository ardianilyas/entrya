import { beforeAll, describe, expect, it } from "vitest";
import { seedEvent } from "@/shared/seeder/event.seeder.ts";
import { seedTicketType } from "@/shared/seeder/ticket-type.seeder.ts";
import { authenticate } from "../../../tests/helpers/auth.helper.ts";
import { seedOrganizers } from "@/shared/seeder/organizer.seeder.ts";
import type { TicketTypeInsert } from "@/features/ticket-type/ticket-type.dto.ts";

describe("Ticket type endpoint", () => {
  let eventId: string;
  let ticketTypeId: string;
  let payload: TicketTypeInsert;

  beforeAll(async () => {
    await seedOrganizers(1);
    const event = await seedEvent(1);
    const ticketType = await seedTicketType(1);

    eventId = event[0]?.id ?? "";
    ticketTypeId = ticketType[0]?.id ?? "";

    const saleEndAt = new Date();
    saleEndAt.setDate(saleEndAt.getDate() + 3);

    payload = {
      name: "Test ticket type",
      description: "Description",
      price: 100000,
      quantityTotal: 100,
      saleStartAt: new Date(),
      saleEndAt,
      isActive: true,
      eventId
    }
  });

  describe("GET /api/ticket-types/event/:id", () => {
   it('should return 200 and return ticket types', async () => {
     const { agent } = await authenticate("organizer");
     const response = await agent.get(`/api/ticket-types/event/${eventId}`);

     console.log(eventId);
     console.log(response.body);

     expect(response.status).toBe(200);
     expect(response.body.data).toBeDefined();
     expect(response.body.data).toBeInstanceOf(Object);
   });
  });

  describe("POST /api/ticket-types", () => {
    it('should return 200 when data is valid', async () => {
      const { agent } = await authenticate("organizer");
      const response = await agent.post(`/api/ticket-types`).send(payload);

      expect(response.status).toBe(201);
      expect(response.body.data).toBeDefined();
      expect(response.body.data).toBeInstanceOf(Object);
    });
  })
})