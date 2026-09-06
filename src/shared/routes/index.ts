import { Router } from "express";
import organizerRoute from "@/features/organizer/organizer.route.ts";
import eventRoute from "@/features/event/event.route.ts";

const router = Router();

router.use("/organizers", organizerRoute);
router.use("/events", eventRoute);

export default router;