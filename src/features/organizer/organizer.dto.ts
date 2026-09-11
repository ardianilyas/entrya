import { z } from "zod";
import { organizers } from "@/shared/db/schemas";

export type Organizer = typeof organizers.$inferSelect;

export const createOrganizerDto = z.object({
  name: z.string().min(1, { error: "Name is required" }),
  bio: z.string().min(1, { error: "Bio is required" }),
});
export const updateOrganizerDto = createOrganizerDto.partial();
export const getOrganizerDto = z.uuid({ error: "Id is invalid" });

export type CreateOrganizerDto = z.infer<typeof createOrganizerDto>;
export type UpdateOrganizerDto = z.infer<typeof updateOrganizerDto>;
export type GetOrganizerDto = z.infer<typeof getOrganizerDto>;
