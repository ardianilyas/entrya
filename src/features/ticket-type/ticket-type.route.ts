import { Router } from "express";
import { TicketTypeRepository } from "@/features/ticket-type/repositories/ticket-type.repository.ts";
import { TicketTypeService } from "@/features/ticket-type/ticket-type.service.ts";
import { TicketTypeController } from "@/features/ticket-type/ticket-type.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";
import { requireRole } from "@/shared/middlewares/require-role.ts";

const router = Router();

const ticketTypeRepository = new TicketTypeRepository()
const ticketTypeService = new TicketTypeService(ticketTypeRepository);
const ticketTypeController = new TicketTypeController(ticketTypeService);

router.use(authMiddleware, requireRole("organizer"));
router.get("/event/:eventId", ticketTypeController.getTicketTypeByEventId);
router.get("/:id", ticketTypeController.getTicketTypeById);
router.post("/", ticketTypeController.createTicketType);
router.patch("/:id", ticketTypeController.updateTicketType);
router.delete("/:id", ticketTypeController.deleteTicketType);

export default router;
