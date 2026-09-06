import { Router } from "express";
import { EventRepository } from "@/features/event/event.repository.ts";
import { EventService } from "@/features/event/event.service.ts";
import { EventController } from "@/features/event/event.controller.ts";
import { requireRole } from "@/shared/middlewares/require-role.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";

const router = Router();
const organizerRouter = Router();

const eventRepository = new EventRepository();
const eventService = new EventService(eventRepository);
const eventController = new EventController(eventService);

router.get("/", eventController.getEvents);

organizerRouter.use(authMiddleware, requireRole("organizer"));
organizerRouter.get("/", eventController.getEventsByOrganizerId);
organizerRouter.get("/:id", eventController.getEvent);
organizerRouter.post("/", eventController.createEvent);
organizerRouter.patch("/:id", eventController.updateEvent);
organizerRouter.delete("/:id", eventController.deleteEvent);

router.use("/organizer", organizerRouter);

export default router;
