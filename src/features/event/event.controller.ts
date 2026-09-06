import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { Request, Response } from "express";
import type { EventService } from "@/features/event/event.service.ts";
import { sendSuccess } from "@/shared/utils/response.ts";
import { validate } from "@/shared/utils/validate.ts";
import { createEventDto, getEventDto, updateEventDto } from "@/features/event/event.dto.ts";
import type { AuthenticatedRequest } from "@/shared/types";

export class EventController {
  constructor(private readonly eventService: EventService) {}

  getEvents = asyncHandler(async (req: Request, res: Response) => {
    const events = await this.eventService.getEvents();
    return sendSuccess(res, "Event list", events);
  });

  getEventsByOrganizerId = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const events = await this.eventService.getEventsByOrganizerId(req.auth.user.id);
    return sendSuccess(res, "Event list", events);
  });

  getEvent = asyncHandler(async (req: Request, res: Response) => {
    const id = validate(getEventDto, req.params.id);
    const event = await this.eventService.getEvent(id);
    return sendSuccess(res, "Event details", event);
  });

  createEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const data = validate(createEventDto, req.body);
    const event = await this.eventService.createEvent(data, req.auth.user.id);
    return sendSuccess(res, "Event created", event, 201);
  });

  updateEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getEventDto, req.params.id);
    const data = validate(updateEventDto, req.body);
    const event = await this.eventService.updateEvent(data, id);
    return sendSuccess(res, "Event updated", event);
  });

  deleteEvent = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const id = validate(getEventDto, req.params.id);
    await this.eventService.deleteEvent(id);
    return sendSuccess(res, "Event deleted");
  });
}