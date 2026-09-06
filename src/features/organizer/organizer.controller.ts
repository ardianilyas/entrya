import type { OrganizerService } from "@/features/organizer/organizer.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { Request, Response } from "express";
import { sendSuccess } from "@/shared/utils/response.ts";
import { validate } from "@/shared/utils/validate.ts";
import { createOrganizerDto, getOrganizerDto, updateOrganizerDto } from "@/features/organizer/organizer.dto.ts";
import type { AuthenticatedRequest } from "@/shared/types/index.ts";

export class OrganizerController {
  constructor(private readonly organizerService: OrganizerService) {}

  getOrganizers = asyncHandler(async(req: Request, res: Response) => {
    const organizers = await this.organizerService.getOrganizers();
    return sendSuccess(res, "Organizer list", organizers);
  });

  getOrganizer = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getOrganizerDto, req.params.id);
    const organizer = await this.organizerService.getOrganizer(id);
    return sendSuccess(res, "Organizer details", organizer);
  });

  getOrganizerByUserId = asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
    const organizer = await this.organizerService.getOrganizerByUserId(req.auth.user.id);
    return sendSuccess(res, "Organizer details", organizer);
  });

  verifyOrganizer = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getOrganizerDto, req.params.id);
    const organizer = await this.organizerService.verifyOrganizer(id);
    return sendSuccess(res, "Organizer verified successfully", organizer);
  })

  createOrganizer = asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
    const data = validate(createOrganizerDto, req.body);
    const organizer = await this.organizerService.createOrganizer(data, req.auth.user.id);
    return sendSuccess(res, "Organizer created successfully", organizer, 201);
  });

  updateOrganizer = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getOrganizerDto, req.params.id);
    const data = validate(updateOrganizerDto, req.body);
    const organizer = await this.organizerService.updateOrganizer(data, id)

    return sendSuccess(res, "Organizer updated successfully", organizer);
  });

  deleteOrganizer = asyncHandler(async(req: Request, res: Response) => {
    const id = validate(getOrganizerDto, req.params.id);
    await this.organizerService.deleteOrganizer(id);
    return sendSuccess(res, "Organizer deleted successfully");
  });
}