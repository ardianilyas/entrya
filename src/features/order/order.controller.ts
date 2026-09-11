import type { OrderService } from "@/features/order/order.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { Response, Request } from "express";
import { validate } from "@/shared/utils/validate.ts";
import { borderpayWebhookDto, createOrderDto } from "@/features/order/order.dto.ts";
import type { AuthenticatedRequest } from "@/shared/types";
import type { CreateOrderCommand } from "@/features/order/order.type.ts";
import { sendSuccess } from "@/shared/utils/response.ts";
import { UnauthorizedError } from "@/shared/errors/unauthorized.ts";
import { env } from "@/shared/config/env.ts";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = validate(createOrderDto, req.body);
    const data: CreateOrderCommand = { ...body, userId: req.auth.user.id };
    const { order, payment} = await this.orderService.createOrder(data);
    return sendSuccess(res, "Order created", { order, payment }, 201);
  });

  orderWebhook = asyncHandler(async (req: Request, res: Response) => {
    const TOKEN = env.BORDERPAY_WEBHOOK_TOKEN;

    if (req.headers["x-borderpay-token"] !== TOKEN) throw new UnauthorizedError("Invalid webhook token");

    const data = validate(borderpayWebhookDto, req.body);
    const result = await this.orderService.orderWebhook(data);

    return sendSuccess(res, "Webhook processed successfully", result, 200);
  });
}