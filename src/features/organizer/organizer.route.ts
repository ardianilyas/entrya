import { Router } from "express";
import { OrganizerRepository } from "@/features/organizer/organizer.repository.ts";
import { OrganizerService } from "@/features/organizer/organizer.service.ts";
import { OrganizerController } from "@/features/organizer/organizer.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";
import { requireRole } from "@/shared/middlewares/require-role.ts";

const router = Router();
const userRouter = Router();
const adminRouter = Router();

const organizerRepository = new OrganizerRepository();
const organizerService = new OrganizerService(organizerRepository);
const organizerController = new OrganizerController(organizerService);

router.get("/", organizerController.getOrganizers);
router.get( "/me", authMiddleware, organizerController.getOrganizerByUserId, );
router.get("/:id", organizerController.getOrganizer);

userRouter.use(authMiddleware);
userRouter.post("/", organizerController.createOrganizer);
userRouter.patch("/:id", organizerController.updateOrganizer);
userRouter.delete("/:id", organizerController.deleteOrganizer);

adminRouter.use(authMiddleware, requireRole("admin"));
adminRouter.post("/:id/verify", organizerController.verifyOrganizer);

router.use("/", userRouter);
router.use("/admin", adminRouter);

export default router;