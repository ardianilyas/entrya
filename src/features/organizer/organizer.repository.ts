import type { CreateOrganizerDto, Organizer, UpdateOrganizerDto } from "@/features/organizer/organizer.dto.ts";
import { db } from "@/shared/db";
import { organizer } from "@/shared/db/schemas";
import { asc, eq } from "drizzle-orm";

export class OrganizerRepository {
  async getOrganizers(): Promise<Organizer[]> {
    return await db.select().from(organizer).orderBy(asc(organizer.createdAt));
  }

  async getOrganizerByUserId(userId: string): Promise<Organizer | undefined> {
    const [data] = await db.select().from(organizer).where(eq(organizer.userId, userId)).limit(1);
    return data;
  }

  async getOrganizer(id: string): Promise<Organizer | undefined> {
    const [data] = await db.select().from(organizer).where(eq(organizer.id, id));
    return data;
  }

  async verifyOrganizer(id: string): Promise<Organizer | undefined> {
    const [data] = await db.update(organizer).set({
      isVerified: true
    }).where(eq(organizer.id, id)).returning();
    return data;
  }

  async createOrganizer(data: CreateOrganizerDto, userId: string): Promise<Organizer | undefined> {
    const [newOrganizer] = await db.insert(organizer).values({ ...data, userId }).returning();
    return newOrganizer;
  }

  async updateOrganizer(id: string, data: UpdateOrganizerDto): Promise<Organizer | undefined> {
    const [updatedOrganizer] = await db.update(organizer).set(data).where(eq(organizer.id, id)).returning();
    return updatedOrganizer;
  }

  async deleteOrganizer(id: string): Promise<Organizer | undefined> {
    const [deletedOrganizer] = await db.delete(organizer).where(eq(organizer.id, id)).returning();
    return deletedOrganizer;
  }
}