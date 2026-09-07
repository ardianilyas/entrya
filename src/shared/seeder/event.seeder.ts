import type { EventInsert } from "@/features/event/event.dto.ts";
import { faker } from "@faker-js/faker";
import { db } from "@/shared/db";
import { events, organizers } from "@/shared/db/schemas";

export async function seedEvent(length: number = 1, organizerId?: string) {
  const organizersId = await db.select({ id: organizers.id }).from(organizers).limit(5);
  const data: EventInsert[] = Array.from({ length }).map((_, _index) => ({
    title: faker.music.album(),
    description: faker.lorem.sentence(),
    venue: faker.location.street(),
    location: faker.location.city(),
    startAt: faker.date.future(),
    endAt: faker.date.future(),
    organizerId: organizerId ?? faker.helpers.arrayElement(organizersId).id,
  }));

  return db.insert(events).values(data).returning();
}