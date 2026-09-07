import type { TicketTypeRepository } from "@/features/ticket-type/repositories/ticket-type.repository.ts";
import type { CreateTicketTypeDto, TicketType, UpdateTicketTypeDto } from "@/features/ticket-type/ticket-type.dto.ts";
import { NotFoundError } from "@/shared/errors/not-found.ts";

export class TicketTypeService {
  constructor(private readonly ticketTypeRepository: TicketTypeRepository) {}

  async getTicketTypesByEventId(id: string): Promise<TicketType[]> {
    const eventId = await this.ticketTypeRepository.getEventIdById(id);
    if(!eventId) throw new NotFoundError("Event not found");
    return this.ticketTypeRepository.getTicketTypesByEventId(eventId);
  }

  async getTicketTypeById(id: string): Promise<TicketType | undefined> {
    return this.ticketTypeRepository.getTicketTypeById(id);
  }

  async createTicketType(data: CreateTicketTypeDto): Promise<TicketType | undefined> {
    const newTicketType = this.ticketTypeRepository.createTicketType(data);
    if (!newTicketType) throw new Error("Failed to create ticket type");
    return newTicketType;
  }

  async updateTicketType(id: string, data: UpdateTicketTypeDto): Promise<TicketType | undefined> {
    const updatedTicketType = this.ticketTypeRepository.updateTicketType(id, data);
    if (!updatedTicketType) throw new NotFoundError("Ticket type not found");
    return updatedTicketType;
  }

  async deleteTicketType(id: string): Promise<boolean> {
    const deleted = this.ticketTypeRepository.deleteTicketType(id);
    if (!deleted) throw new NotFoundError("Ticket type not found");
    return deleted;
  }
}