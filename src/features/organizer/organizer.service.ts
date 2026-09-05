import type { OrganizerRepository } from "@/features/organizer/organizer.repository.ts";
import type { CreateOrganizerDto, Organizer, UpdateOrganizerDto } from "@/features/organizer/organizer.dto.ts";
import { AppError } from "@/shared/errors/app-error.ts";
import { NotFoundError } from "@/shared/errors/not-found.ts";
import { ORGANIZER_NOT_FOUND } from "@/features/organizer/organizer.constant.ts";

export class OrganizerService {
  constructor(private readonly organizerRepository: OrganizerRepository) {}

  async getOrganizers(): Promise<Organizer[]> {
    return this.organizerRepository.getOrganizers();
  }

  async getOrganizer(id: string): Promise<Organizer | undefined> {
    const organizer = await this.organizerRepository.getOrganizer(id);

    if (!organizer) throw new NotFoundError(ORGANIZER_NOT_FOUND);

    return organizer;
  }

  async getOrganizerByUserId(userId: string): Promise<Organizer | undefined> {
    return this.organizerRepository.getOrganizerByUserId(userId);
  }

  async verifyOrganizer(id: string): Promise<Organizer | undefined> {
    return this.organizerRepository.verifyOrganizer(id);
  }

  async createOrganizer(data: CreateOrganizerDto, userId: string): Promise<Organizer> {
    const organizer = await this.organizerRepository.createOrganizer(data, userId);

    if (!organizer) throw new AppError("Failed to create organizer. Please contact support team");

    return organizer;
  }

  async updateOrganizer(data: UpdateOrganizerDto, id: string): Promise<Organizer | undefined> {
    const organizer = await this.organizerRepository.updateOrganizer(id, data);

    if(!organizer) throw new NotFoundError(ORGANIZER_NOT_FOUND);

    return organizer;
  }

  async deleteOrganizer(id: string): Promise<boolean> {
    const organizer = await this.organizerRepository.deleteOrganizer(id);

    if (!organizer) throw new NotFoundError(ORGANIZER_NOT_FOUND);

    return true;
  }
}