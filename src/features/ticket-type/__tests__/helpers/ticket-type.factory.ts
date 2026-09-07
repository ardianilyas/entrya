import { seedOrganizers } from "@/shared/seeder/organizer.seeder.ts";
import { seedEvent } from "@/shared/seeder/event.seeder.ts";
import { seedTicketType } from "@/shared/seeder/ticket-type.seeder.ts";

export async function ticketTypeFactory(userId: string) {
  const organizer = await seedOrganizers(1, { userIds: [userId] });
  const event = await seedEvent(1, organizer[0]?.id);
  const ticketType = await seedTicketType(1, event[0]?.id);

  return { event, ticketType };
}