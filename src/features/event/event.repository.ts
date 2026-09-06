import { db } from "@/shared/db";
import { events, organizers } from "@/shared/db/schemas";
import { eq, desc } from "drizzle-orm";
import type { CreateEventDto, UpdateEventDto } from "@/features/event/event.dto.ts";

export class EventRepository {
  async getEvents() {
    return db.select().from(events).orderBy(desc(events.createdAt));
  }

  async getEventsByOrganizerId(organizerId: string) {
    return db.select().from(events).where(eq(events.organizerId, organizerId)).orderBy(desc(events.createdAt));
  }

  async getEvent(id: string) {
    const [event] = await db.select().from(events).where(eq(events.id, id)).limit(1);
    return event;
  }

  async getOrganizerIdByUserId(userId: string) {
    const [organizer] = await db.select({ id: organizers.id }).from(organizers).where(eq(organizers.userId, userId));
    return organizer?.id;
  }

  async createEvent(data: CreateEventDto, organizerId: string) {
    const [newEvent] = await db.insert(events).values({ ...data, organizerId }).returning();
    return newEvent;
  }

  async updateEvent(data: UpdateEventDto, id: string) {
    const [updatedEvent] = await db.update(events).set(data).where(eq(events.id, id)).returning();
    return updatedEvent;
  }

  async deleteEvent(id: string) {
    const [deletedEvent] = await db.delete(events).where(eq(events.id, id)).returning();
    return deletedEvent;
  }
}