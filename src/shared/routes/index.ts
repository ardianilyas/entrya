import { Router } from "express";
import organizerRoute from "@/features/organizer/organizer.route.ts";

const router = Router();

router.use("/organizers", organizerRoute);

export default router;