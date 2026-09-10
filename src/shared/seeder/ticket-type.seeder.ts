import type { TicketTypeInsert } from "@/features/ticket-type/ticket-type.dto.ts";
import { faker } from "@faker-js/faker";
import { db } from "@/shared/db";
import { events, ticketTypes } from "@/shared/db/schemas";

type SeedTicketTypeOptions = {
  eventId?: string;
  quantityTotal?: number;
};

export async function seedTicketType(length: number = 1, options?: SeedTicketTypeOptions) {
  const eventIds = await db.select({ id: events.id }).from(events).limit(5);
  const data: TicketTypeInsert[] = Array.from({ length: length }).map((_, _i) => ({
    name: faker.music.songName(),
    description: faker.lorem.sentence(),
    price: faker.number.int({ min: 1000000, max: 5000000 }),
    quantityTotal: faker.number.int({ min: 100, max: 1000 }),
    saleStartAt: faker.date.past(),
    saleEndAt: faker.date.future(),
    isActive: true,
    eventId: options?.eventId ?? faker.helpers.arrayElement(eventIds).id,
  }));

  return db.insert(ticketTypes).values(data).returning();
}
