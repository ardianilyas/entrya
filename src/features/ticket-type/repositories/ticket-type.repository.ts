import type { TicketTypeInterface } from "@/features/ticket-type/repositories/ticket-type.interface.ts";
import type { CreateTicketTypeDto, TicketType, UpdateTicketTypeDto } from "@/features/ticket-type/ticket-type.dto.ts";
import { db } from "@/shared/db";
import { eq } from "drizzle-orm";
import { events, ticketTypes } from "@/shared/db/schemas";

export class TicketTypeRepository implements TicketTypeInterface {
  async getEventIdById(id: string): Promise<string | undefined> {
    const [event] = await db.select({ id: events.id }).from(events).where(eq(events.id, id)).limit(1);
    return event?.id ?? undefined;
  }

  async getTicketTypesByEventId(eventId: string): Promise<TicketType[]> {
    return db.select().from(ticketTypes).where(eq(ticketTypes.eventId, eventId))
  }

  async getTicketTypeById(id: string): Promise<TicketType | undefined> {
    const [ticketType] = await db.select().from(ticketTypes).where(eq(ticketTypes.id, id)).limit(1);
    return ticketType;
  }

  async createTicketType(data: CreateTicketTypeDto): Promise<TicketType | undefined> {
    const [ticketType] = await db.insert(ticketTypes).values(data).returning();
    return ticketType;
  }

  async updateTicketType(id: string, data: UpdateTicketTypeDto): Promise<TicketType | undefined> {
    const [updatedTicketType] = await db.update(ticketTypes).set(data).where(eq(ticketTypes.id, id)).returning();
    return updatedTicketType;
  }

  async deleteTicketType(id: string): Promise<boolean> {
    const result = await db.delete(ticketTypes).where(eq(ticketTypes.id, id));
    return !!result.rowCount;
  }
}