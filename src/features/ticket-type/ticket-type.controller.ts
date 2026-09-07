import type { TicketTypeService } from "@/features/ticket-type/ticket-type.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { Request, Response } from "express";
import { validate } from "@/shared/utils/validate.ts";
import { createTicketTypeDto, getEventDto, getTicketTypeDto, updateTicketTypeDto } from "@/features/ticket-type/ticket-type.dto.ts";
import { sendSuccess } from "@/shared/utils/response.ts";

export class TicketTypeController {
  constructor(private readonly ticketTypeService: TicketTypeService) {}

  getTicketTypeByEventId = asyncHandler(async (req: Request, res: Response) => {
    const eventId = validate(getEventDto, req.params.eventId);
    const ticketTypes = await this.ticketTypeService.getTicketTypesByEventId(eventId);
    return sendSuccess(res, "Ticket type list", ticketTypes);
  });

  getTicketTypeById = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getTicketTypeDto, req.params.id);
    const ticketType = await this.ticketTypeService.getTicketTypeById(id);
    return sendSuccess(res, "Ticket type", ticketType);
  });

  createTicketType = asyncHandler(async (req: Request, res: Response) => {
    const data = validate(createTicketTypeDto, req.body);
    const ticketType = await this.ticketTypeService.createTicketType(data);
    return sendSuccess(res, "Ticket type created", ticketType, 201);
  });

  updateTicketType = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getTicketTypeDto, req.params.id);
    const data = validate(updateTicketTypeDto, req.body);
    const ticketType = await this.ticketTypeService.updateTicketType(id, data);
    return sendSuccess(res, "Ticket type updated", ticketType);
  });

  deleteTicketType = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getTicketTypeDto, req.params.id);
     await this.ticketTypeService.deleteTicketType(id);
    return sendSuccess(res, "Ticket type deleted", null);
  })
}