import { events } from "@/shared/db/schemas";
import { z } from "zod";

export type Event = typeof events.$inferSelect;
export type EventInsert = typeof events.$inferInsert;

export const createEventDto = z.object({
  title: z.string().min(1, { error: "Event title is required" }).min(3, { error: "Event title minimum length is 3" }),
  description: z.string().min(1, { error: "Event description is required" }),
  venue: z.string().min(1, { error: "Event venue is required" }),
  location: z.string().min(1, { error: "Event location is required" }),
  startAt: z.coerce.date({
    error: "Start date is required",
  }),
  endAt: z.coerce.date({
    error: "End date is required",
  }),
});
export const updateEventDto = createEventDto.partial();
export const getEventDto = z.uuid({ error: "Invalid event id" });

export type CreateEventDto = z.infer<typeof createEventDto>;
export type UpdateEventDto = z.infer<typeof updateEventDto>;
export type GetEventDto = z.infer<typeof getEventDto>;
