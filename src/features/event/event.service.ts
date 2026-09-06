import type { EventRepository } from "@/features/event/event.repository.ts";
import type { CreateEventDto, UpdateEventDto } from "@/features/event/event.dto.ts";
import { ForbiddenError } from "@/shared/errors/forbidden.ts";
import { NotFoundError } from "@/shared/errors/not-found.ts";

export class EventService {
  constructor(private readonly eventRepository: EventRepository) {}

  async getEvents() {
    return this.eventRepository.getEvents();
  }

  async getEvent(id: string) {
    const event = await this.eventRepository.getEvent(id);
    if (!event) throw new NotFoundError("Event not found");
    return event;
  }

  async getEventsByOrganizerId(userId: string) {
    const organizerId = await this.eventRepository.getOrganizerIdByUserId(userId);

    if (!organizerId) throw new ForbiddenError("You dont have access to this route");

    return this.eventRepository.getEventsByOrganizerId(organizerId);
  }

  async createEvent(data: CreateEventDto, userId: string) {
    const organizerId = await this.eventRepository.getOrganizerIdByUserId(userId);

    if (!organizerId) throw new ForbiddenError("You dont have access to this resource");

    return this.eventRepository.createEvent(data, organizerId);
  }

  async updateEvent(data: UpdateEventDto, id: string) {
    const updatedEvent = await this.eventRepository.updateEvent(data, id);

    if (!updatedEvent) throw new NotFoundError("Event not found");

    return updatedEvent;
  }

  async deleteEvent(id: string) {
    const deletedEvent = await this.eventRepository.deleteEvent(id);

    if (!deletedEvent) throw new NotFoundError("Event not found");

    return deletedEvent;
  }
}