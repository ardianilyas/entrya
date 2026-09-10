import { seedOrganizers } from "@/shared/seeder/organizer.seeder.ts";
import { seedEvent } from "@/shared/seeder/event.seeder.ts";
import { seedTicketType } from "@/shared/seeder/ticket-type.seeder.ts";

export async function orderFactory() {
  const organizer = await seedOrganizers(1);
  const event = await seedEvent(1, organizer[0]?.id);
  const ticketType = await seedTicketType(1, { eventId: event[ 0 ]?.id, quantityTotal: 10 });

  return { event, ticketType };
}