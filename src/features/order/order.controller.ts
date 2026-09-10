import type { OrderService } from "@/features/order/order.service.ts";
import { asyncHandler } from "@/shared/utils/async-handler.ts";
import type { Response } from "express";
import { validate } from "@/shared/utils/validate.ts";
import { createOrderDto } from "@/features/order/order.dto.ts";
import type { AuthenticatedRequest } from "@/shared/types";
import type { CreateOrderCommand } from "@/features/order/order.type.ts";
import { sendSuccess } from "@/shared/utils/response.ts";

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const body = validate(createOrderDto, req.body);
    const data: CreateOrderCommand = { ...body, userId: req.auth.user.id };
    const order = await this.orderService.createOrder(data);
    return sendSuccess(res, "Order created", order, 201);
  });
}