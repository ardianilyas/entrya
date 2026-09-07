import { ticketTypes } from "@/shared/db/schemas";
import { z } from "zod";

export type TicketType = typeof ticketTypes.$inferSelect;
export type TicketTypeInsert = typeof ticketTypes.$inferInsert;

export const createTicketTypeDto = z.object({
  eventId: z.uuid({ error: "Event id is invalid" }),
  name: z.string({ error: "Name is required" }).min(3, { error: "Name must be at least 3 characters long" }),
  description: z.string({ error: "Description is required" }),
  price: z.number({ error: "Price is required" }).positive(),
  quantityTotal: z.number({ error: "Quantity total is required" }).positive(),
  saleStartAt: z.coerce.date({ error: "Sale start date is required" }),
  saleEndAt: z.coerce.date({ error: "Sale end date is required" }),
  isActive: z.boolean({ error: "Is active is required" }).default(true),
});
export const updateTicketTypeDto = createTicketTypeDto.partial();
export const getTicketTypeDto = z.uuid({ error: "Ticket type id is invalid" });
export const getEventDto = z.uuid({ error: "Event id is invalid" })

export type CreateTicketTypeDto = z.infer<typeof createTicketTypeDto>;
export type UpdateTicketTypeDto = z.infer<typeof updateTicketTypeDto>;
export type GetTicketTypeDto = z.infer<typeof getTicketTypeDto>;
