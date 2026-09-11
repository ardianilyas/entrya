import { Router } from "express";
import { OrderRepository } from "@/features/order/repositories/order.repository.ts";
import { OrderService } from "@/features/order/order.service.ts";
import { OrderController } from "@/features/order/order.controller.ts";
import { authMiddleware } from "@/shared/middlewares/auth.middleware.ts";
import { PaymentRepository } from "@/features/payment/repositories/payment.repository.ts";

const router = Router();

const orderRepository = new OrderRepository();
const paymentRepository = new PaymentRepository();
const orderService = new OrderService(orderRepository, paymentRepository);
const orderController = new OrderController(orderService);

router.post("/webhook", orderController.orderWebhook);

router.use(authMiddleware);
router.post("/", orderController.createOrder);

export default router;
