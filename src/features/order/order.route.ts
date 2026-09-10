import { Router } from "express";
import { OrderRepository } from "@/features/order/repositories/order.repository.ts";
import { OrderService } from "@/features/order/order.service.ts";
import { OrderController } from "@/features/order/order.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";

const router = Router();

const orderRepository = new OrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

router.use(authMiddleware);
router.post("/", orderController.createOrder);

export default router;
