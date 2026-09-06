import type { CreateOrganizerDto, Organizer, UpdateOrganizerDto } from "@/features/organizer/organizer.dto.ts";
import { db } from "@/shared/db";
import { organizers } from "@/shared/db/schemas";
import { asc, eq } from "drizzle-orm";

export class OrganizerRepository {
  async getOrganizers(): Promise<Organizer[]> {
    return await db.select().from(organizers).orderBy(asc(organizers.createdAt));
  }

  async getOrganizerByUserId(userId: string): Promise<Organizer | undefined> {
    const [data] = await db.select().from(organizers).where(eq(organizers.userId, userId)).limit(1);
    return data;
  }

  async getOrganizer(id: string): Promise<Organizer | undefined> {
    const [data] = await db.select().from(organizers).where(eq(organizers.id, id));
    return data;
  }

  async verifyOrganizer(id: string): Promise<Organizer | undefined> {
    const [data] = await db.update(organizers).set({
      isVerified: true
    }).where(eq(organizers.id, id)).returning();
    return data;
  }

  async createOrganizer(data: CreateOrganizerDto, userId: string): Promise<Organizer | undefined> {
    const [newOrganizer] = await db.insert(organizers).values({ ...data, userId }).returning();
    return newOrganizer;
  }

  async updateOrganizer(id: string, data: UpdateOrganizerDto): Promise<Organizer | undefined> {
    const [updatedOrganizer] = await db.update(organizers).set(data).where(eq(organizers.id, id)).returning();
    return updatedOrganizer;
  }

  async deleteOrganizer(id: string): Promise<Organizer | undefined> {
    const [deletedOrganizer] = await db.delete(organizers).where(eq(organizers.id, id)).returning();
    return deletedOrganizer;
  }
}