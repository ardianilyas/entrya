import type { CreateTicketTypeDto, TicketType, UpdateTicketTypeDto } from "@/features/ticket-type/ticket-type.dto.ts";

export interface TicketTypeInterface {
  getEventIdById(id: string): Promise<string | undefined>;
 getTicketTypesByEventId(eventId: string): Promise<TicketType[]>;
 getTicketTypeById(id: string): Promise<TicketType | undefined>;
 createTicketType(data: CreateTicketTypeDto): Promise<TicketType | undefined>;
 updateTicketType(id: string, data: UpdateTicketTypeDto): Promise<TicketType | undefined>;
 deleteTicketType(id: string): Promise<boolean>;
}