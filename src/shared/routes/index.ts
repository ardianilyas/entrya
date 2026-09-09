import { Router } from "express";
import organizerRoute from "@/features/organizer/organizer.route.ts";
import eventRoute from "@/features/event/event.route.ts";
import ticketTypeRoute from "@/features/ticket-type/ticket-type.route.ts";
import orderRoute from "@/features/order/order.route.ts";

const router = Router();

router.use("/organizers", organizerRoute);
router.use("/events", eventRoute);
router.use("/ticket-types", ticketTypeRoute);
router.use("/orders", orderRoute);

export default router;
