import type { CreateTicketTypeDto, UpdateTicketTypeDto } from "@/features/ticket-type/ticket-type.dto.ts";


const now = new Date();
const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

export const createTicketTypePayload = (eventId: string): CreateTicketTypeDto => {
  return {
    name: "Test Ticket Type",
    description: "Test Description",
    quantityTotal: 200,
    saleStartAt: now,
    saleEndAt: twoDaysFromNow,
    price: 100,
    eventId: eventId ?? "",
    isActive: true,
  };
};

export const updateTicketTypePayload = (): UpdateTicketTypeDto => {
  return {
    name: "Test Ticket Type",
    description: "Test Description",
    quantityTotal: 200,
    saleStartAt: now,
    saleEndAt: twoDaysFromNow,
    price: 100,
    isActive: true,
  }
}